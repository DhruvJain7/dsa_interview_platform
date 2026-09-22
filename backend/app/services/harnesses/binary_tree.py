import json


def generate_python_binary_tree_harness(
    user_code: str,
    execution: dict,
    test_cases: list,
) -> str:
    if execution["type"] != "binary_tree":
        raise ValueError(
            f"Unsupported execution type: {execution['type']}"
        )

    function_name = execution["function_name"]

    test_lines = []

    for test_case in test_cases:
        values = test_case["input"][0]

        test_lines.append(
            f"root = build_binary_tree({values!r})"
        )

        test_lines.append(
            f"result = {function_name}(root)"
        )

        test_lines.append(
            "results.append(result)"
        )

    harness = f"""
import json


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def build_binary_tree(values):
    if not values or values[0] is None:
        return None

    nodes = [
        TreeNode(value) if value is not None else None
        for value in values
    ]

    child_index = 1

    for node in nodes:
        if node is None:
            continue

        if child_index < len(nodes):
            node.left = nodes[child_index]
            child_index += 1

        if child_index < len(nodes):
            node.right = nodes[child_index]
            child_index += 1

    return nodes[0]


{user_code}


results = []

{chr(10).join(test_lines)}

print(json.dumps(results))
"""

    return harness
