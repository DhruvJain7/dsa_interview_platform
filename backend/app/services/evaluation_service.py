import os
from typing import Optional

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from app.services.exceptions import EvaluationError


load_dotenv()


class EvaluationDimension(BaseModel):
    score: Optional[int] = Field(
        default=None,
        ge=1,
        le=5,
    )
    feedback: str = ""


class EvaluationResult(BaseModel):
    overall_feedback: str = ""

    problem_understanding: EvaluationDimension
    approach: EvaluationDimension
    complexity: EvaluationDimension
    clarity_and_articulation: EvaluationDimension
    optimization: EvaluationDimension

    strengths: list[str] = []
    improvements: list[str] = []


class EvaluationService:
    SCORE_MIN = 1
    SCORE_MAX = 5

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise RuntimeError("OPENAI_API_KEY must be set")

        self.llm = ChatOpenAI(
            model="gpt-5.5",
            temperature=0,
        ).with_structured_output(EvaluationResult)

    def _build_prompt(
        self,
        problem: dict,
        code: str,
        execution_result: dict,
        transcript: str,
    ) -> str:
        return f"""
You are an AI reasoning and articulation evaluator for Articula,
a platform designed to help people improve how clearly they
think through and explain DSA solutions.

Evaluate the candidate based only on the information provided.

PROBLEM:
{problem}

CANDIDATE CODE:
{code}

EXECUTION RESULT:
{execution_result}

CANDIDATE'S ARTICULATION:
{transcript}

Evaluate these five dimensions:

1. Problem Understanding
2. Approach / Logic
3. Complexity
4. Clarity & Articulation
5. Optimization

Use a 1–5 scale:

1 = Very weak
2 = Needs significant improvement
3 = Adequate
4 = Strong
5 = Excellent

IMPORTANT RULES:

- Treat the execution result as authoritative.
- Do not independently determine whether the code passed or failed.
- Do not award a high reasoning score simply because the code passes.
- Evaluate the candidate's reasoning separately from code correctness.
- Compare the stated complexity with the actual submitted implementation.
- Do not invent information that is not present in the problem,
  code, execution result, or articulation transcript.
- Give specific and actionable feedback.
- Evaluate how clearly the candidate explains their reasoning.
- Consider whether the candidate explains their approach,
  edge cases, complexity, and relevant trade-offs.
- Do not judge accent, pronunciation, or transcription imperfections.
- If the articulation transcript is empty, set
  clarity_and_articulation.score to null and explain that no
  spoken explanation was provided.
- Keep feedback concise and useful for improving DSA reasoning
  and articulation.
- Do not evaluate the candidate as if they are participating
  in a simulated job interview.
- Focus on the quality of their reasoning and their ability
  to articulate the solution clearly.

Return the evaluation using the required structured format.
"""

    def evaluate(
        self,
        problem: dict,
        code: str,
        execution_result: dict,
        transcript: str,
    ):
        if not problem:
            raise ValueError("Problem is required")

        if not code.strip():
            raise ValueError("Code is required")

        if not isinstance(execution_result, dict):
            raise ValueError(
                "Execution result must be a dictionary"
            )

        if not isinstance(transcript, str):
            raise ValueError(
                "Transcript must be a string"
            )

        prompt = self._build_prompt(
            problem=problem,
            code=code,
            execution_result=execution_result,
            transcript=transcript,
        )

        try:
            result = self.llm.invoke(prompt)
        except Exception as error:
            raise EvaluationError(
                f"Evaluation provider error: {error}"
            ) from error

        return result.model_dump()
