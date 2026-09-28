import json


def generate_javascript_linked_list_harness(
    user_code: str,
    execution: dict,
    test_cases: list,
) -> str:
    if execution["type"] != "linked_list":
        raise ValueError(
            f"Unsupported execution type: {execution['type']}"
        )

    function_name = execution["function_name"]
    parameters = execution.get("parameters", [])

    test_lines = []

    for test_case in test_cases:
        inputs = test_case["input"]
        case_lines = []

        if parameters == ["head"]:
            case_lines.append(
                f"let head = buildLinkedList({json.dumps(inputs[0])});"
            )
            case_lines.append(
                f"let result = {function_name}(head);"
            )

        elif parameters == ["head", "n"]:
            case_lines.append(
                f"let head = buildLinkedList({json.dumps(inputs[0])});"
            )
            case_lines.append(
                f"let result = {function_name}(head, {json.dumps(inputs[1])});"
            )

        elif parameters == ["lists"]:
            case_lines.append(
                f"let lists = buildLinkedLists({json.dumps(inputs[0])});"
            )
            case_lines.append(
                f"let result = {function_name}(lists);"
            )

        else:
            raise ValueError(
                f"Unsupported linked-list parameters: {parameters}"
            )

        case_lines.append(
            "results.push(linkedListToArray(result));"
        )

        test_lines.append(
            "{\n"
            + "\n".join(case_lines)
            + "\n}"
        )

    harness = f"""
class ListNode {{
    constructor(val = 0, next = null) {{
        this.val = val;
        this.next = next;
    }}
}}


function buildLinkedList(values) {{
    if (!values || values.length === 0) {{
        return null;
    }}

    const dummy = new ListNode();
    let current = dummy;

    for (const value of values) {{
        current.next = new ListNode(value);
        current = current.next;
    }}

    return dummy.next;
}}


function buildLinkedLists(listValues) {{
    return listValues.map(values => buildLinkedList(values));
}}


function linkedListToArray(head) {{
    const values = [];
    let current = head;

    while (current) {{
        values.push(current.val);
        current = current.next;
    }}

    return values;
}}


{user_code}


const results = [];

{chr(10).join(test_lines)}

console.log(JSON.stringify(results));
"""

    return harness
