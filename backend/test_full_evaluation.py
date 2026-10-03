import json
import uuid

import redis
import requests

from app.services.auth_service import AuthService
from app.services.user_service import UserService


BASE_URL = "http://127.0.0.1:8000"


# Use the same Redis URL as backend/.env
redis_client = redis.from_url(
    "redis://default:9Hrt0cx3TYhp0fztY0zfHC89VqpOGOh6@sunnyday-steel-tangerine-18158.db.redis.io:11281",
    decode_responses=True,
)


user_service = UserService(redis_client)

email = f"eval-{uuid.uuid4().hex[:8]}@example.com"

user = user_service.create_user(
    name="Evaluation Test",
    email=email,
    password="TestPassword123!",
)

token = AuthService().create_access_token(
    user["user_id"]
)

headers = {
    "Authorization": f"Bearer {token}",
}


# --------------------------------------------------
# 1. Create session
# --------------------------------------------------

response = requests.post(
    f"{BASE_URL}/sessions",
    headers=headers,
    json={
        "problem_id": "two_sum",
        "language": "python",
    },
)

print("\nCREATE SESSION")
print("Status:", response.status_code)
print(response.json())

response.raise_for_status()

session_id = response.json()["session_id"]


# --------------------------------------------------
# 2. Submit code -> JDoodle
# --------------------------------------------------

code = """def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i
"""

response = requests.post(
    f"{BASE_URL}/sessions/{session_id}/submit",
    headers=headers,
    json={
        "code": code,
    },
)

print("\nSUBMIT -> JDOODLE")
print("Status:", response.status_code)
print(json.dumps(response.json(), indent=2))

response.raise_for_status()


# --------------------------------------------------
# 3. Add transcript directly to Redis
# --------------------------------------------------

transcript = (
    "I would solve this problem using a hash map. "
    "I iterate through the array and calculate the complement "
    "of the current number. If that complement already exists "
    "in the hash map, I return the stored index and current index. "
    "Otherwise, I store the current number and its index. "
    "This gives O(n) time complexity and O(n) space complexity."
)

redis_client.hset(
    f"session:{session_id}",
    mapping={
        "transcript": transcript,
    },
)


# --------------------------------------------------
# 4. Complete session -> OpenAI evaluation
# --------------------------------------------------

response = requests.post(
    f"{BASE_URL}/sessions/{session_id}/complete",
    headers=headers,
)

print("\nCOMPLETE -> OPENAI")
print("Status:", response.status_code)
print(json.dumps(response.json(), indent=2))

response.raise_for_status()


# --------------------------------------------------
# 5. Verify Redis persistence
# --------------------------------------------------

session = redis_client.hgetall(
    f"session:{session_id}"
)

print("\nREDIS VERIFICATION")
print("Status:", session.get("status"))

evaluation = json.loads(
    session.get("evaluation", "{}")
)

print("Evaluation stored:", bool(evaluation))

print("\nEvaluation:")
print(json.dumps(evaluation, indent=2))


# --------------------------------------------------
# 6. Cleanup
# --------------------------------------------------

redis_client.delete(
    f"session:{session_id}"
)

redis_client.delete(
    f"user:{user['user_id']}"
)

redis_client.delete(
    f"user:email:{email}"
)

print("\nCleanup complete")
