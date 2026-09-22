import json


def generate_python_class_harness(
    user_code: str,
    execution: dict,
    test_cases: list,
) -> str:
    if execution["type"] != "class":
        raise ValueError(
            f"Unsupported execution type: {execution['type']}"
        )

    class_name = execution["class_name"]
    test_functions = []

    for index, test_case in enumerate(test_cases):
        operations = test_case["input"]["operations"]
        arguments = test_case["input"]["arguments"]

        operation_lines = [
            f"def run_test_case_{index}():",
            "    case_results = []",
        ]

        for operation, args in zip(operations, arguments):
            if operation == class_name:
                operation_lines.append(
                    f"    obj = {class_name}()"
                )
                operation_lines.append(
                    "    case_results.append(None)"
                )
            else:
                operation_lines.append(
                    f"    result = obj.{operation}(*{args!r})"
                )
                operation_lines.append(
                    "    case_results.append(result)"
                )

        operation_lines.append("    return case_results")

        test_functions.append(
            "\n".join(operation_lines)
        )

    calls = "\n".join(
        f"results.append(run_test_case_{index}())"
        for index in range(len(test_cases))
    )

    harness = f"""
import json

{user_code}

{chr(10).join(test_functions)}

results = []

{calls}

print(json.dumps(results))
"""

    return harness
