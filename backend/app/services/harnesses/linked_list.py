import json


def generate_python_linked_list_harness(
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

        if parameters == ["head"]:
            test_lines.append(
                f"head = build_linked_list({inputs[0]!r})"
            )
            test_lines.append(
                f"result = {function_name}(head)"
            )

        elif parameters == ["head", "n"]:
            test_lines.append(
                f"head = build_linked_list({inputs[0]!r})"
            )
            test_lines.append(
                f"result = {function_name}(head, {inputs[1]!r})"
            )

        elif parameters == ["lists"]:
            test_lines.append(
                f"lists = build_linked_lists({inputs[0]!r})"
            )
            test_lines.append(
                f"result = {function_name}(lists)"
            )

        else:
            raise ValueError(
                f"Unsupported linked-list parameters: {parameters}"
            )

        test_lines.append(
            "results.append(linked_list_to_list(result))"
        )

    harness = f"""
import json

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build_linked_list(values):
    if not values:
        return None

    dummy = ListNode()
    current = dummy

    for value in values:
        current.next = ListNode(value)
        current = current.next

    return dummy.next


def build_linked_lists(list_values):
    return [
        build_linked_list(values)
        for values in list_values
    ]


def linked_list_to_list(head):
    values = []
    current = head

    while current:
        values.append(current.val)
        current = current.next

    return values


{user_code}

results = []

{chr(10).join(test_lines)}

print(json.dumps(results))
"""

    return harness
