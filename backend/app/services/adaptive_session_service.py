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
