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

    def create_session(self, user_id: str, problem_id: str, language: str):
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

    def get_user_sessions(self, user_id: str):
        session_ids = self.redis.smembers(
            f"user:{user_id}:sessions"
        )

        sessions = []

        for session_id in session_ids:
            session = self.redis.hgetall(
                f"session:{session_id}"
            )

            if not session:
                continue

            sessions.append(session)

        sessions.sort(
            key=lambda session: session.get("updated_at", ""),
            reverse=True,
        )

        return sessions

    def delete_session(self, session_id: str, user_id: str):
        session_key = f"session:{session_id}"

        session = self.redis.hgetall(session_key)

        if not session:
            raise ValueError("Session not found")

        if session.get("user_id") != user_id:
            raise ValueError("Session not found")

        self.redis.delete(session_key)

        return {
            "session_id": session_id,
            "status": "deleted",
        }
