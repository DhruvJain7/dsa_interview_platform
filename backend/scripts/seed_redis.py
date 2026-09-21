import json
import os
from pathlib import Path

import redis
from dotenv import load_dotenv


# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

PROBLEMS_FILE = BASE_DIR / "data" / "problems.json"


# Redis connection
redis_url = os.getenv("REDIS_URL")

if not redis_url:
    raise RuntimeError("REDIS_URL is not set in .env")

r = redis.from_url(
    redis_url,
    decode_responses=True,
)


# Test Redis connection
r.ping()
print("Connected to Redis Cloud")


# Load problems
with open(PROBLEMS_FILE, "r", encoding="utf-8") as file:
    problems = json.load(file)

print(f"Loaded {len(problems)} problems from JSON")


# Seed problems
for problem in problems:
    key = f"problem:{problem['id']}"

    r.hset(
        key,
        mapping={
            "id": problem["id"],
            "title": problem["title"],
            "description": problem["description"],
            "difficulty": problem["difficulty"],
            "topic": problem["topic"],
            "examples": json.dumps(problem["examples"]),
            "hints": json.dumps(problem["hints"]),
            "constraints": json.dumps(problem["constraints"]),
            "tags": json.dumps(problem["tags"]),
        },
    )

print(f"Seeded {len(problems)} problems into Redis")


# Store available topics
topics = sorted({problem["topic"] for problem in problems})

for topic in topics:
    r.sadd("topics", topic)


# Store available difficulties
difficulties = sorted({problem["difficulty"] for problem in problems})

for difficulty in difficulties:
    r.sadd("difficulties", difficulty)


print("Topics:", topics)
print("Difficulties:", difficulties)

print("Redis seeding complete!")


# Verify seeded data
print("Test key:", r.hgetall("problem:two_sum"))
print("Problem keys:", list(r.scan_iter(match="problem:*"))[:5])