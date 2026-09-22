import json


class TestRunner:
    def normalize_output(self, value, comparison="exact"):
        if comparison == "exact":
            return value

        if comparison == "unordered":
            if isinstance(value, list):
                return sorted(
                    self.normalize_output(item, "exact")
                    for item in value
                )

            return value

        raise ValueError(
            f"Unsupported comparison mode: {comparison}"
        )

    def get_test_cases(self, problem):
        return json.loads(problem["test_cases"])

    def evaluate_results(
        self,
        actual_results,
        test_cases,
        comparison="exact",
    ):
        results = []

        for index, test_case in enumerate(test_cases):
            expected = test_case["expected"]

            actual = (
                actual_results[index]
                if index < len(actual_results)
                else None
            )

            actual_normalized = self.normalize_output(
                actual,
                comparison,
            )

            expected_normalized = self.normalize_output(
                expected,
                comparison,
            )

            results.append({
                "test_case": index + 1,
                "expected": expected,
                "actual": actual,
                "passed": actual_normalized == expected_normalized,
            })

        return results

    def evaluate_execution(
        self,
        execution_result,
        test_cases,
        execution,
    ):
        if not execution_result.get("isExecutionSuccess"):
            return {
                "success": False,
                "error": (
                    execution_result.get("error")
                    or execution_result.get("compilationStatus")
                    or "Code execution failed"
                ),
                "results": [],
            }

        try:
            actual_results = json.loads(
                execution_result.get("output", "")
            )
        except json.JSONDecodeError:
            return {
                "success": False,
                "error": "Execution returned invalid JSON",
                "results": [],
            }

        comparison = execution.get(
            "comparison",
            "exact",
        )

        results = self.evaluate_results(
            actual_results,
            test_cases,
            comparison=comparison,
        )

        return {
            "success": True,
            "error": None,
            "results": results,
        }
