import json

from app.services.harness_generator import generate_harness
from app.services.jdoodle_provider import JDoodleProvider
from app.services.test_runner import TestRunner


class ExecutionService:

    def __init__(self):
        self.provider = JDoodleProvider()
        self.runner = TestRunner()

    def execute(
        self,
        language: str,
        code: str,
        problem: dict,
    ):
        if not problem.get("test_cases"):
            raise ValueError(
                "This problem does not have test cases yet"
            )

        test_cases = self.runner.get_test_cases(problem)

        execution = json.loads(problem["execution"])

        harness = generate_harness(
            user_code=code,
            execution=execution,
            test_cases=test_cases,
            language=language,
        )

        execution_result = self.provider.execute(
            language=language,
            code=harness,
        )

        return self.runner.evaluate_execution(
            execution_result,
            test_cases,
            execution,
        )