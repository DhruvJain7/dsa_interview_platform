import json
import uuid
from datetime import datetime, timezone


class SessionService:

    SUPPORTED_LANGUAGES = {
        "python",
        "javascript",
    }

    def __init__(self, redis_client):
        self.redis = redis_client

    def create_session(self,  user_id: str,problem_id: str, language: str):
        if language not in self.SUPPORTED_LANGUAGES:
            raise ValueError(
                f"Unsupported language: {language}"
            )
        user_key = f"user:{user_id}"

        if not self.redis.exists(user_key):
            raise ValueError("User not found")

        problem_key = f"problem:{problem_id}"

        if not self.redis.exists(problem_key):
            raise ValueError(
                "Problem not found"
            )

        session_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        session = {
            "session_id": session_id,
            "user_id": user_id,
            "problem_id": problem_id,
            "status": "created",
            "language": language,
            "code": "",
            "execution_result": json.dumps({}),
            "transcript": "",
            "evaluation": json.dumps({}),
            "created_at": now,
            "updated_at": now,
        }

        self.redis.hset(
            f"session:{session_id}",
            mapping=session,
        )

        return session
