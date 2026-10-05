import json
import uuid
from datetime import datetime, timezone


class AdaptiveSessionService:
    def __init__(self, redis_client):
        self.redis = redis_client

    def create_adaptive_session(self, user_id: str):
        user_key = f"user:{user_id}"

        if not self.redis.exists(user_key):
            raise ValueError("User not found")

        adaptive_session_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        adaptive_session = {
            "adaptive_session_id": adaptive_session_id,
            "user_id": user_id,
            "current_problem_id": "",
            "current_difficulty": "",
            "current_session_id": "",
            "performance_history": json.dumps([]),
            "strengths": json.dumps([]),
            "weaknesses": json.dumps([]),
            "current_goal": "",
            "last_evaluation": json.dumps({}),
            "last_action": "",
            "next_action": "start_problem",
            "created_at": now,
            "updated_at": now,
        }

        self.redis.hset(
            f"adaptive_session:{adaptive_session_id}",
            mapping=adaptive_session,
        )

        return adaptive_session

    def attach_practice_session(
        self,
        adaptive_session_id: str,
        user_id: str,
        session_id: str,
    ):
        adaptive_key = f"adaptive_session:{adaptive_session_id}"

        adaptive_session = self.redis.hgetall(adaptive_key)

        if not adaptive_session:
            raise ValueError("Adaptive session not found")

        if adaptive_session.get("user_id") != user_id:
            raise ValueError("Adaptive session not found")

        session = self.redis.hgetall(
            f"session:{session_id}"
        )

        if not session:
            raise ValueError("Practice session not found")

        if session.get("user_id") != user_id:
            raise ValueError("Practice session not found")

        now = datetime.now(timezone.utc).isoformat()

        self.redis.hset(
            adaptive_key,
            mapping={
                "current_session_id": session_id,
                "updated_at": now,
            },
        )

        return {
            "adaptive_session_id": adaptive_session_id,
            "current_session_id": session_id,
        }

    def process_completed_session(
        self,
        adaptive_session_id: str,
        user_id: str,
        session_id: str,
    ):
        adaptive_key = f"adaptive_session:{adaptive_session_id}"

        adaptive_session = self.redis.hgetall(adaptive_key)

        if not adaptive_session:
            raise ValueError("Adaptive session not found")

        if adaptive_session.get("user_id") != user_id:
            raise ValueError("Adaptive session not found")

        session = self.redis.hgetall(
            f"session:{session_id}"
        )

        if not session:
            raise ValueError("Practice session not found")

        if session.get("user_id") != user_id:
            raise ValueError("Practice session not found")

        if session.get("status") != "completed":
            raise ValueError(
                "Practice session must be completed first"
            )

        evaluation = session.get("evaluation")

        if not evaluation:
            raise ValueError(
                "Practice session has no evaluation"
            )

        if isinstance(evaluation, str):
            evaluation = json.loads(evaluation)

        now = datetime.now(timezone.utc).isoformat()

        self.redis.hset(
            adaptive_key,
            mapping={
                "current_session_id": session_id,
                "last_evaluation": json.dumps(evaluation),
                "last_action": "session_completed",
                "next_action": "adapt",
                "updated_at": now,
            },
        )

        return {
            "adaptive_session_id": adaptive_session_id,
            "current_session_id": session_id,
            "last_evaluation": evaluation,
            "last_action": "session_completed",
            "next_action": "adapt",
        }
