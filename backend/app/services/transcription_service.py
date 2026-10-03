import os

import assemblyai as aai
from dotenv import load_dotenv


load_dotenv()


class TranscriptionService:
    def __init__(self):
        api_key = os.getenv("ASSEMBLYAI_API_KEY")

        if not api_key:
            raise RuntimeError("ASSEMBLYAI_API_KEY must be set")

        self.transcriber = aai.Transcriber(
            api_key=api_key
        )

    def transcribe(self, audio_path: str):
        transcript = self.transcriber.transcribe(audio_path)

        if transcript.status == aai.TranscriptStatus.error:
            raise RuntimeError(
                f"Transcription failed: {transcript.error}"
            )

        return {
            "transcript_id": transcript.id,
            "text": transcript.text or "",
            "status": transcript.status.value,
        }
