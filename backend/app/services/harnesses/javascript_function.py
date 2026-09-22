import json


def generate_javascript_function_harness(
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
        arguments = json.dumps(test_case["input"])

        test_lines.append(
            f"results.push({function_name}(...{arguments}));"
        )

    harness = f"""
{user_code}

const results = [];

{chr(10).join(test_lines)}

console.log(JSON.stringify(results));
"""

    return harness
