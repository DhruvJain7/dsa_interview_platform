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

            # -----------------------------------------------------
            # Adaptive session journey
            # -----------------------------------------------------
            # This stores the completed practice sessions that
            # belong to THIS adaptive session.
            "journey": json.dumps([]),

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
        adaptive_session_id,
        user_id,
        session_id,
    ):
        adaptive_key = (
            f"adaptive_session:{adaptive_session_id}"
        )

        adaptive_session = self.redis.hgetall(
            adaptive_key
        )

        if not adaptive_session:
            raise ValueError(
                "Adaptive session not found"
            )

        if adaptive_session.get("user_id") != user_id:
            raise ValueError(
                "Adaptive session not found"
            )

        session = self.redis.hgetall(
            f"session:{session_id}"
        )

        if not session:
            raise ValueError(
                "Practice session not found"
            )

        if session.get("user_id") != user_id:
            raise ValueError(
                "Practice session not found"
            )

        now = datetime.now(
            timezone.utc
        ).isoformat()

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
        adaptive_session_id,
        user_id,
        session_id,
    ):
        adaptive_key = (
            f"adaptive_session:{adaptive_session_id}"
        )

        adaptive_session = self.redis.hgetall(
            adaptive_key
        )

        if not adaptive_session:
            raise ValueError(
                "Adaptive session not found"
            )

        if adaptive_session.get("user_id") != user_id:
            raise ValueError(
                "Adaptive session not found"
            )

        session = self.redis.hgetall(
            f"session:{session_id}"
        )

        if not session:
            raise ValueError(
                "Practice session not found"
            )

        if session.get("user_id") != user_id:
            raise ValueError(
                "Practice session not found"
            )

        if session.get("status") != "completed":
            raise ValueError(
                "Practice session must be completed first"
            )

        evaluation = session.get(
            "evaluation"
        )

        if not evaluation:
            raise ValueError(
                "Practice session has no evaluation"
            )

        if isinstance(evaluation, str):
            evaluation = json.loads(
                evaluation
            )

        # ---------------------------------------------------------
        # Load existing adaptive journey
        # ---------------------------------------------------------
        journey_raw = adaptive_session.get(
            "journey",
            "[]",
        )

        if isinstance(journey_raw, str):
            journey = json.loads(
                journey_raw
            )
        else:
            journey = journey_raw

        # ---------------------------------------------------------
        # Prevent the same practice session from being added
        # twice to the adaptive journey.
        # ---------------------------------------------------------
        already_recorded = any(
            item.get("session_id") == session_id
            for item in journey
        )

        if not already_recorded:
            journey_entry = {
                "session_id": session_id,
                "problem_id": session.get(
                    "problem_id"
                ),
                "evaluation": evaluation,
                "completed_at": session.get(
                    "updated_at"
                ),
            }

            journey.append(
                journey_entry
            )

        now = datetime.now(
            timezone.utc
        ).isoformat()

        # ---------------------------------------------------------
        # Persist adaptive-session state
        # ---------------------------------------------------------
        self.redis.hset(
            adaptive_key,
            mapping={
                "current_session_id": session_id,

                "last_evaluation": json.dumps(
                    evaluation
                ),

                "last_action": "session_completed",

                "next_action": "adapt",

                "journey": json.dumps(
                    journey
                ),

                "updated_at": now,
            },
        )

        return {
            "adaptive_session_id": adaptive_session_id,
            "current_session_id": session_id,

            "last_evaluation": evaluation,

            "last_action": "session_completed",

            "next_action": "adapt",

            "journey": journey,
        }

    def get_adaptive_session(
        self,
        adaptive_session_id,
        user_id,
    ):
        adaptive_key = (
            f"adaptive_session:{adaptive_session_id}"
        )

        adaptive_session = self.redis.hgetall(
            adaptive_key
        )

        if not adaptive_session:
            raise ValueError(
                "Adaptive session not found"
            )

        if adaptive_session.get("user_id") != user_id:
            raise ValueError(
                "Adaptive session not found"
            )

        # ---------------------------------------------------------
        # Deserialize JSON fields
        # ---------------------------------------------------------

        for field in [
            "performance_history",
            "strengths",
            "weaknesses",
            "last_evaluation",
            "journey",
        ]:
            raw_value = adaptive_session.get(
                field
            )

            if raw_value:
                try:
                    adaptive_session[field] = json.loads(
                        raw_value
                    )
                except json.JSONDecodeError:
                    adaptive_session[field] = []

            else:
                adaptive_session[field] = (
                    [] if field != "last_evaluation"
                    else {}
                )

        return adaptive_session

    def end_adaptive_session(
        self,
        adaptive_session_id,
        user_id,
    ):
        adaptive_key = f"adaptive_session:{adaptive_session_id}"

        adaptive_session = self.redis.hgetall(
            adaptive_key
        )

        if not adaptive_session:
            raise ValueError(
                "Adaptive session not found"
            )

        if adaptive_session.get("user_id") != user_id:
            raise ValueError(
                "Adaptive session not found"
            )

        if adaptive_session.get("status") == "completed":
            raise ValueError(
                "Adaptive session is already completed"
            )

        now = datetime.now(
            timezone.utc
        ).isoformat()

        self.redis.hset(
            adaptive_key,
            mapping={
                "status": "completed",
                "ended_at": now,
                "last_action": "session_ended",
                "next_action": "session_completed",
                "updated_at": now,
            },
        )

        return self.get_adaptive_session(
            adaptive_session_id=adaptive_session_id,
            user_id=user_id,
        )

    def get_user_adaptive_sessions(self, user_id: str):
        sessions = []

        for key in self.redis.scan_iter(match="adaptive_session:*"):
            adaptive_session = self.redis.hgetall(key)

            if not adaptive_session:
                continue

            if adaptive_session.get("user_id") != user_id:
                continue

            for field in [
                "performance_history",
                "strengths",
                "weaknesses",
                "last_evaluation",
                "journey",
            ]:
                raw_value = adaptive_session.get(field)

                if raw_value:
                    try:
                        adaptive_session[field] = json.loads(raw_value)
                    except json.JSONDecodeError:
                        adaptive_session[field] = []
                else:
                    adaptive_session[field] = (
                        {} if field == "last_evaluation" else []
                    )

            sessions.append(adaptive_session)

        sessions.sort(
            key=lambda session: session.get("updated_at", ""),
            reverse=True,
        )

        return sessions

    def delete_adaptive_session(
        self,
        adaptive_session_id: str,
        user_id: str,
    ):
        adaptive_key = f"adaptive_session:{adaptive_session_id}"

        adaptive_session = self.redis.hgetall(adaptive_key)

        if not adaptive_session:
            raise ValueError("Adaptive session not found")

        if adaptive_session.get("user_id") != user_id:
            raise ValueError("Adaptive session not found")

        self.redis.delete(adaptive_key)

        return {
            "adaptive_session_id": adaptive_session_id,
            "message": "Adaptive session deleted successfully",
        }
