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

    test_lines = []

    for test_case in test_cases:
        operations = test_case["input"]["operations"]
        arguments = test_case["input"]["arguments"]

        for operation, args in zip(operations, arguments):
            if operation == class_name:
                test_lines.append(
                    f"obj = {class_name}()"
                )
                test_lines.append(
                    "results.append(None)"
                )
            else:
                test_lines.append(
                    f"result = obj.{operation}(*{args!r})"
                )

                test_lines.append(
                    "results.append(result)"
                )

    harness = f"""
import json


{user_code}


results = []

{chr(10).join(test_lines)}

print(json.dumps(results))
"""

    return harness
