import os
from datetime import datetime, timedelta, timezone

from jose import jwt
from dotenv import load_dotenv

load_dotenv()


class AuthService:

    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY")

        if not self.secret_key:
            raise RuntimeError(
                "JWT_SECRET_KEY must be set"
            )

    def create_access_token(self, user_id: str):
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(
            minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES
        )

        payload = {
            "sub": user_id,
            "iat": now,
            "exp": expires_at,
        }

        return jwt.encode(
            payload,
            self.secret_key,
            algorithm=self.ALGORITHM,
        )

    def decode_access_token(self, token: str):
        return jwt.decode(
            token,
            self.secret_key,
            algorithms=[self.ALGORITHM],
        )
