import json
import os

import redis
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query


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


@app.get("/problems")
def get_problems(
    topic: str | None = Query(default=None),
    difficulty: str | None = Query(default=None),
):
    problems = []

    for key in r.scan_iter(match="problem:*"):
        problem = r.hgetall(key)

        if not problem:
            continue

        # Backend-side filtering
        if topic and problem["topic"] != topic:
            continue

        if difficulty and problem["difficulty"] != difficulty:
            continue

        problem["examples"] = json.loads(problem["examples"])
        problem["hints"] = json.loads(problem["hints"])
        problem["constraints"] = json.loads(problem["constraints"])
        problem["tags"] = json.loads(problem["tags"])

        problems.append(problem)

    return problems
