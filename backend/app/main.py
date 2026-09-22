import json
import os

import redis
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Query
from app.services.jdoodle_provider import JDoodleProvider
from app.services.harness_generator import generate_harness
from app.services.test_runner import TestRunner
from app.services.jdoodle_provider import JDoodleProvider

load_dotenv()

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

    if not problem.get("test_cases"):
        raise HTTPException(
            status_code=400,
            detail="This problem does not have test cases yet",
        )

    if request.language != "python":
        raise HTTPException(
            status_code=400,
            detail="Automated judging currently supports Python only",
        )

    runner = TestRunner()
    test_cases = runner.get_test_cases(problem)

    execution = json.loads(problem["execution"])

    harness = generate_harness(
        user_code=request.code,
        execution=execution,
        test_cases=test_cases,
    )

    provider = JDoodleProvider()

    execution_result = provider.execute(
        language=request.language,
        code=harness,
    )

    return runner.evaluate_execution(
        execution_result,
        test_cases,
        execution,
    )

def escape_tag(value: str) -> str:
    special_characters = r",.<>{}[]\"':;!@#$%^&*()-+=~"

    for character in special_characters:
        value = value.replace(character, f"\\{character}")

    return value

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
