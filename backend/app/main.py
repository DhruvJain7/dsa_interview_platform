import json
import os

import redis
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.exceptions import ProviderExecutionError
from app.services.execution_service import ExecutionService
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.services.auth_dependency import get_current_user_id
from app.services.session_service import SessionService

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

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SessionCreateRequest(BaseModel):
    problem_id: str
    language: str

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

@app.get("/problems/{problem_id}")
def get_problem(problem_id: str):
    problem = r.hgetall(f"problem:{problem_id}")

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found",
        )

    problem["examples"] = json.loads(problem["examples"])
    problem["hints"] = json.loads(problem["hints"])
    problem["constraints"] = json.loads(problem["constraints"])
    problem["tags"] = json.loads(problem["tags"])

    return problem


@app.post("/auth/signup")
def signup(request: SignupRequest):
    if not request.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Name is required",
        )

    if not request.email.strip():
        raise HTTPException(
            status_code=400,
            detail="Email is required",
        )

    if len(request.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters",
        )

    user_service = UserService(r)
    auth_service = AuthService()

    try:
        user = user_service.create_user(
            name=request.name,
            email=request.email,
            password=request.password,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    token = auth_service.create_access_token(
        user["user_id"]
    )

    return {
        "user": user,
        "access_token": token,
        "token_type": "bearer",
    }


@app.post("/auth/login")
def login(request: LoginRequest):
    user_service = UserService(r)
    auth_service = AuthService()

    user = user_service.get_user_by_email(
        request.email
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not user_service.verify_password(
        request.password,
        user["password_hash"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = auth_service.create_access_token(
        user["user_id"]
    )

    return {
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"],
        },
        "access_token": token,
        "token_type": "bearer",
    }

@app.get("/auth/me")
def get_me(user_id: str = Depends(get_current_user_id)):
    return {
        "user_id": user_id,
    }

@app.post("/sessions")
def create_session(
    request: SessionCreateRequest,
    user_id: str = Depends(get_current_user_id),
):
    session_service = SessionService(r)

    try:
        return session_service.create_session(
            user_id=user_id,
            problem_id=request.problem_id,
            language=request.language,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@app.get("/sessions/{session_id}")
def get_session(
    session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    session = r.hgetall(f"session:{session_id}")

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    if session.get("user_id") != user_id:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    session["execution_result"] = json.loads(
        session["execution_result"]
    )
    session["evaluation"] = json.loads(
        session["evaluation"]
    )

    return session
