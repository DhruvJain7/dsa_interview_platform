import json
import os

import redis
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.exceptions import ProviderExecutionError
from app.services.execution_service import ExecutionService


load_dotenv()
def escape_tag(value: str) -> str:
    return value.replace("\\", "\\\\").replace("}", "\\}")
app = FastAPI(title="Articula")


# Redis connection
redis_url = os.getenv("REDIS_URL")

if not redis_url:
    raise RuntimeError("REDIS_URL is not set")

r = redis.from_url(
    redis_url,
    decode_responses=True,
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}

class TestRequest(BaseModel):
    language: str
    code: str
    problem_id: str

class ExecuteRequest(BaseModel):
    language: str
    code: str
    problem_id: str

@app.post("/execute-tests")
def execute_tests(request: TestRequest):
    problem = r.hgetall(f"problem:{request.problem_id}")

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    examples = json.loads(problem["examples"])

    provider = JDoodleProvider()

    results = []

    for index, example in enumerate(examples):
        result = provider.execute(
            language=request.language,
            code=request.code,
            stdin=example["input"],
        )

        actual_output = (result.get("output") or "").strip()
        expected_output = example["output"].strip()

        results.append({
            "test_case": index + 1,
            "input": example["input"],
            "expected_output": expected_output,
            "actual_output": actual_output,
            "passed": actual_output == expected_output,
        })

    return {
        "problem_id": request.problem_id,
        "results": results,
    }

@app.post("/execute")
def execute_code(request: ExecuteRequest):
    problem = r.hgetall(f"problem:{request.problem_id}")

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found",
        )

    execution_service = ExecutionService()

    try:
        return execution_service.execute(
            language=request.language,
            code=request.code,
            problem=problem,
        )

    except ProviderExecutionError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
@app.get("/problems")
def get_problems(
    topic: str | None = Query(default=None),
    difficulty: str | None = Query(default=None),
):
    query_parts = []

    if topic:
        query_parts.append(f"@topic:{{{escape_tag(topic)}}}")

    if difficulty:
        query_parts.append(f"@difficulty:{{{escape_tag(difficulty)}}}")

    query = " ".join(query_parts) if query_parts else "*"

    result = r.execute_command(
        "FT.SEARCH",
        "idx:problems",
        query,
        "LIMIT",
        "0",
        "100",
    )

    problems = []

    for item in result["results"]:
        problem = item["extra_attributes"]

        problem["examples"] = json.loads(problem["examples"])
        problem["hints"] = json.loads(problem["hints"])
        problem["constraints"] = json.loads(problem["constraints"])
        problem["tags"] = json.loads(problem["tags"])

        problems.append(problem)

    return problems
