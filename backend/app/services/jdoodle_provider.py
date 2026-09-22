import os

import httpx
from dotenv import load_dotenv

load_dotenv()


class JDoodleProvider:

    LANGUAGE_MAP = {
        "python": "python3",
        "javascript": "nodejs",
        "java": "java",
        "cpp": "cpp17",
    }

    def __init__(self):
        self.client_id = os.getenv("JDOODLE_CLIENT_ID")
        self.client_secret = os.getenv("JDOODLE_CLIENT_SECRET")

        if not self.client_id or not self.client_secret:
            raise RuntimeError(
                "JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET must be set"
            )

    def execute(self, language: str, code: str, stdin: str = ""):
        if language not in self.LANGUAGE_MAP:
            raise ValueError(f"Unsupported language: {language}")

        payload = {
            "clientId": self.client_id,
            "clientSecret": self.client_secret,
            "script": code,
            "language": self.LANGUAGE_MAP[language],
            "versionIndex": "0",
            "stdin": stdin,
        }

        response = httpx.post(
            "https://api.jdoodle.com/v1/execute",
            json=payload,
            timeout=30,
        )

        response.raise_for_status()

        return response.json()
