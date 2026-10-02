import uuid
from datetime import datetime, timezone

import bcrypt


class UserService:

    def __init__(self, redis_client):
        self.redis = redis_client

    def create_user(self, name: str, email: str, password: str):
        email = email.strip().lower()

        if self.redis.exists(f"user:email:{email}"):
            raise ValueError("Email already registered")

        user_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(),
        ).decode("utf-8")

        user = {
            "user_id": user_id,
            "name": name.strip(),
            "email": email,
            "password_hash": password_hash,
            "created_at": now,
        }

        self.redis.hset(
            f"user:{user_id}",
            mapping=user,
        )

        self.redis.set(
            f"user:email:{email}",
            user_id,
        )

        return {
            "user_id": user_id,
            "name": user["name"],
            "email": user["email"],
            "created_at": now,
        }

    def get_user_by_email(self, email: str):
        email = email.strip().lower()

        user_id = self.redis.get(
            f"user:email:{email}"
        )

        if not user_id:
            return None

        return self.redis.hgetall(
            f"user:{user_id}"
        )

    def verify_password(
        self,
        password: str,
        password_hash: str,
    ):
        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
