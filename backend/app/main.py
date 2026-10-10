import json
import os
import tempfile
from datetime import datetime, timezone

import redis
from dotenv import load_dotenv
from fastapi import (
    Depends,
    FastAPI,
    File,
    HTTPException,
    Query,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.adaptive_agent import build_adaptive_graph
from app.services.adaptive_session_service import AdaptiveSessionService
from app.services.auth_dependency import get_current_user_id
from app.services.auth_service import AuthService
from app.services.evaluation_service import EvaluationService
from app.services.exceptions import (
    EvaluationError,
    ProviderExecutionError,
)
from app.services.execution_service import ExecutionService
from app.services.session_service import SessionService
from app.services.transcription_service import TranscriptionService
from app.services.user_service import UserService


load_dotenv()


def escape_tag(value: str) -> str:
    return value.replace("\\", "\\\\").replace("}", "\\}")


app = FastAPI(
    title="Articula",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
)


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


# -------------------------------------------------------------------
# Request models
# -------------------------------------------------------------------

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


class SessionSubmitRequest(BaseModel):
    code: str


# -------------------------------------------------------------------
# Execution
# -------------------------------------------------------------------

@app.post("/execute-tests")
def execute_tests(request: TestRequest):
    problem = r.hgetall(
        f"problem:{request.problem_id}"
    )

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found",
        )

    examples = json.loads(problem["examples"])

    provider = JDoodleProvider()

    results = []

    for index, example in enumerate(examples):
        result = provider.execute(
            language=request.language,
            code=request.code,
            stdin=example["input"],
        )

        actual_output = (
            result.get("output") or ""
        ).strip()

        expected_output = example["output"].strip()

        results.append(
            {
                "test_case": index + 1,
                "input": example["input"],
                "expected_output": expected_output,
                "actual_output": actual_output,
                "passed": actual_output == expected_output,
            }
        )

    return {
        "problem_id": request.problem_id,
        "results": results,
    }


@app.post("/execute")
def execute_code(request: ExecuteRequest):
    problem = r.hgetall(
        f"problem:{request.problem_id}"
    )

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


# -------------------------------------------------------------------
# Problems
# -------------------------------------------------------------------

@app.get("/problems")
def get_problems(
    topic: str | None = Query(default=None),
    difficulty: str | None = Query(default=None),
):
    query_parts = []

    if topic:
        query_parts.append(
            f"@topic:{{{escape_tag(topic)}}}"
        )

    if difficulty:
        query_parts.append(
            f"@difficulty:{{{escape_tag(difficulty)}}}"
        )

    query = (
        " ".join(query_parts)
        if query_parts
        else "*"
    )

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

        problem["examples"] = json.loads(
            problem["examples"]
        )

        problem["hints"] = json.loads(
            problem["hints"]
        )

        problem["constraints"] = json.loads(
            problem["constraints"]
        )

        problem["tags"] = json.loads(
            problem["tags"]
        )

        problems.append(problem)

    return problems


@app.get("/problems/{problem_id}")
def get_problem(problem_id: str):
    problem = r.hgetall(
        f"problem:{problem_id}"
    )

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found",
        )

    problem["examples"] = json.loads(
        problem["examples"]
    )

    problem["hints"] = json.loads(
        problem["hints"]
    )

    problem["constraints"] = json.loads(
        problem["constraints"]
    )

    problem["tags"] = json.loads(
        problem["tags"]
    )

    return problem


# -------------------------------------------------------------------
# Authentication
# -------------------------------------------------------------------

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
def get_me(
    user_id: str = Depends(get_current_user_id),
):
    return {
        "user_id": user_id,
    }


# -------------------------------------------------------------------
# Normal practice sessions
# -------------------------------------------------------------------

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


# -------------------------------------------------------------------
# Temporary debug endpoint
# -------------------------------------------------------------------

@app.get("/debug/my-session-history")
def debug_my_session_history(
    user_id: str = Depends(get_current_user_id),
):
    session_service = SessionService(r)

    sessions = session_service.get_user_sessions(
        user_id=user_id
    )

    return {
        "user_id": user_id,
        "count": len(sessions),
        "sessions": sessions,
    }


# -------------------------------------------------------------------
# Adaptive practice
# -------------------------------------------------------------------

@app.post("/interactive/session")
def create_adaptive_session(
    user_id: str = Depends(get_current_user_id),
):
    adaptive_session_service = AdaptiveSessionService(r)

    try:
        # ---------------------------------------------------------
        # STEP 1: Create the adaptive session
        # ---------------------------------------------------------
        adaptive_session = (
            adaptive_session_service.create_adaptive_session(
                user_id=user_id,
            )
        )

        # ---------------------------------------------------------
        # STEP 2: Build the existing Adaptive Interviewer graph
        # ---------------------------------------------------------
        graph = build_adaptive_graph(r)

        # ---------------------------------------------------------
        # STEP 3: Run the graph for the initial recommendation
        # ---------------------------------------------------------
        graph_result = graph.invoke(
            {
                "user_id": user_id,
                "adaptive_session_id": adaptive_session[
                    "adaptive_session_id"
                ],
                "current_problem_id": "",
                "current_difficulty": "",
                "performance_history": [],
                "strengths": [],
                "weaknesses": [],
                "current_goal": "",
                "problem_candidates": [],
                "last_evaluation": {},
                "last_action": "session_started",
                "next_action": "start_problem",
            }
        )

        # ---------------------------------------------------------
        # STEP 4: Return the agent's initial recommendation
        # ---------------------------------------------------------
        return {
            "adaptive_session_id": adaptive_session[
                "adaptive_session_id"
            ],
            "user_id": user_id,
            "current_problem_id": graph_result[
                "current_problem_id"
            ],
            "current_difficulty": graph_result[
                "current_difficulty"
            ],
            "current_goal": graph_result[
                "current_goal"
            ],
            "next_action": graph_result[
                "next_action"
            ],
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
@app.post(
    "/interactive/session/{adaptive_session_id}/attach"
)
def attach_practice_session(
    adaptive_session_id: str,
    session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    adaptive_session_service = AdaptiveSessionService(r)

    try:
        return adaptive_session_service.attach_practice_session(
            adaptive_session_id=adaptive_session_id,
            user_id=user_id,
            session_id=session_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )


@app.post(
    "/interactive/session/{adaptive_session_id}/process"
)
def process_adaptive_session(
    adaptive_session_id: str,
    session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    adaptive_session_service = AdaptiveSessionService(r)

    try:
        result = (
            adaptive_session_service.process_completed_session(
                adaptive_session_id=adaptive_session_id,
                user_id=user_id,
                session_id=session_id,
            )
        )

        graph = build_adaptive_graph(r)

        graph_result = graph.invoke(
            {
                "user_id": user_id,
                "adaptive_session_id": adaptive_session_id,
                "current_problem_id": "",
                "current_difficulty": "",
                "performance_history": [],
                "strengths": [],
                "weaknesses": [],
                "current_goal": "",
                "problem_candidates": [],
                "last_evaluation": result[
                    "last_evaluation"
                ],
                "last_action": "session_completed",
                "next_action": "adapt",
            }
        )

        return {
            "adaptive_session_id": adaptive_session_id,
            "completed_session_id": session_id,
            "last_evaluation": result[
                "last_evaluation"
            ],
            "current_problem_id": graph_result[
                "current_problem_id"
            ],
            "current_difficulty": graph_result[
                "current_difficulty"
            ],
            "current_goal": graph_result[
                "current_goal"
            ],
            "next_action": graph_result[
                "next_action"
            ],
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


# -------------------------------------------------------------------
# Get individual session
# -------------------------------------------------------------------

@app.get("/sessions/{session_id}")
def get_session(
    session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    session = r.hgetall(
        f"session:{session_id}"
    )

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
        session.get(
            "execution_result",
            "{}",
        )
    )

    session["evaluation"] = json.loads(
        session.get(
            "evaluation",
            "{}",
        )
    )

    return session


# -------------------------------------------------------------------
# Delete session
# -------------------------------------------------------------------

@app.delete("/sessions/{session_id}")
def delete_session(
    session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    session_service = SessionService(r)

    try:
        return session_service.delete_session(
            session_id=session_id,
            user_id=user_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )


# -------------------------------------------------------------------
# Submit solution
# -------------------------------------------------------------------

@app.post("/sessions/{session_id}/submit")
def submit_session(
    session_id: str,
    request: SessionSubmitRequest,
    user_id: str = Depends(get_current_user_id),
):
    session = r.hgetall(
        f"session:{session_id}"
    )

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

    problem = r.hgetall(
        f"problem:{session['problem_id']}"
    )

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found",
        )

    execution_service = ExecutionService()

    try:
        result = execution_service.execute(
            language=session["language"],
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

    now = datetime.now(
        timezone.utc
    ).isoformat()

    r.hset(
        f"session:{session_id}",
        mapping={
            "code": request.code,
            "execution_result": json.dumps(
                result
            ),
            "status": "submitted",
            "updated_at": now,
        },
    )

    return {
        "session_id": session_id,
        "status": "submitted",
        "code": request.code,
        "execution_result": result,
    }


# -------------------------------------------------------------------
# Complete / evaluate session
# -------------------------------------------------------------------

@app.post("/sessions/{session_id}/complete")
def complete_session(
    session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    session = r.hgetall(
        f"session:{session_id}"
    )

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

    if session.get("status") != "submitted":
        raise HTTPException(
            status_code=400,
            detail=(
                "Session must be submitted "
                "before completion"
            ),
        )

    problem = r.hgetall(
        f"problem:{session.get('problem_id')}"
    )

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found",
        )

    try:
        evaluation = EvaluationService().evaluate(
            problem=problem,
            code=session.get("code", ""),
            execution_result=json.loads(
                session.get(
                    "execution_result",
                    "{}",
                )
            ),
            transcript=session.get(
                "transcript",
                "",
            ),
        )

    except EvaluationError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        )

    now = datetime.now(
        timezone.utc
    ).isoformat()

    r.hset(
        f"session:{session_id}",
        mapping={
            "evaluation": json.dumps(
                evaluation
            ),
            "status": "completed",
            "updated_at": now,
        },
    )

    return {
        "session_id": session_id,
        "status": "completed",
        "evaluation": evaluation,
    }


# -------------------------------------------------------------------
# Transcription
# -------------------------------------------------------------------

@app.post(
    "/sessions/{session_id}/transcript"
)
def transcribe_session(
    session_id: str,
    audio: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
):
    session = r.hgetall(
        f"session:{session_id}"
    )

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

    suffix = (
        os.path.splitext(
            audio.filename or ""
        )[1]
        or ".tmp"
    )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_path = temp_file.name

            temp_file.write(
                audio.file.read()
            )

        result = TranscriptionService().transcribe(
            temp_path
        )

        now = datetime.now(
            timezone.utc
        ).isoformat()

        r.hset(
            f"session:{session_id}",
            mapping={
                "transcript": result["text"],
                "updated_at": now,
            },
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        )

    finally:
        if (
            temp_path
            and os.path.exists(temp_path)
        ):
            os.remove(temp_path)

    return {
        "session_id": session_id,
        "transcript": result["text"],
        "transcript_id": result[
            "transcript_id"
        ],
        "status": result["status"],
    }


# -------------------------------------------------------------------
# Session history
# -------------------------------------------------------------------

@app.get("/sessions")
def get_user_sessions(
    user_id: str = Depends(get_current_user_id),
):
    session_keys = r.scan_iter(
        match="session:*"
    )

    sessions = []

    for key in session_keys:
        session = r.hgetall(key)

        if not session:
            continue

        if session.get("user_id") != user_id:
            continue

        session["execution_result"] = json.loads(
            session.get(
                "execution_result",
                "{}",
            )
        )

        session["evaluation"] = json.loads(
            session.get(
                "evaluation",
                "{}",
            )
        )

        sessions.append(session)

    sessions.sort(
        key=lambda session: session.get(
            "updated_at",
            "",
        ),
        reverse=True,
    )

    return sessions


@app.get(
    "/interactive/session/{adaptive_session_id}"
)
def get_adaptive_session(
    adaptive_session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    adaptive_session_service = AdaptiveSessionService(r)

    try:
        return adaptive_session_service.get_adaptive_session(
            adaptive_session_id=adaptive_session_id,
            user_id=user_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

@app.post(
    "/interactive/session/{adaptive_session_id}/end"
)
def end_adaptive_session(
    adaptive_session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    adaptive_session_service = AdaptiveSessionService(r)

    try:
        return adaptive_session_service.end_adaptive_session(
            adaptive_session_id=adaptive_session_id,
            user_id=user_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@app.get("/interactive/sessions")
def get_adaptive_sessions(
    user_id: str = Depends(get_current_user_id),
):
    adaptive_session_service = AdaptiveSessionService(r)

    try:
        return {
            "sessions": adaptive_session_service.get_user_adaptive_sessions(
                user_id=user_id
            )
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@app.delete("/interactive/session/{adaptive_session_id}")
def delete_adaptive_session(
    adaptive_session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    adaptive_session_service = AdaptiveSessionService(r)

    try:
        return adaptive_session_service.delete_adaptive_session(
            adaptive_session_id=adaptive_session_id,
            user_id=user_id,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )
