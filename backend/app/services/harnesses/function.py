def generate_python_harness(
    user_code: str,
    execution: dict,
    test_cases: list,
) -> str:
    if execution["type"] != "function":
        raise ValueError(
            f"Unsupported execution type: {execution['type']}"
        )

    function_name = execution["function_name"]

    test_lines = []

    for test_case in test_cases:
        arguments = test_case["input"]
        test_lines.append(
            f"results.append({function_name}(*{arguments!r}))"
        )

    harness = f"""
import json

{user_code}

results = []

{chr(10).join(test_lines)}

print(json.dumps(results))
"""

    return harness
