import json


def generate_javascript_class_harness(
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
        input_data = test_case["input"]

        operations = input_data["operations"]
        arguments = input_data["arguments"]

        case_lines = [
            "{",
            f"    const instance = new {class_name}();",
            "    const caseResults = [];",
        ]

        for operation, args in zip(operations, arguments):
            if operation == class_name:
                case_lines.append(
                    "    caseResults.push(null);"
                )
                continue

            args_json = json.dumps(args)

            case_lines.append(
                f"    caseResults.push(instance.{operation}(...{args_json}));"
            )

        case_lines.append(
            "    results.push(caseResults);"
        )
        case_lines.append("}")

        test_lines.append("\n".join(case_lines))

    harness = f"""
{user_code}


const results = [];

{chr(10).join(test_lines)}

console.log(JSON.stringify(results));
"""

    return harness
