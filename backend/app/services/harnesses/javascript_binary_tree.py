import json


def generate_javascript_binary_tree_harness(
    user_code: str,
    execution: dict,
    test_cases: list,
) -> str:
    if execution["type"] != "binary_tree":
        raise ValueError(
            f"Unsupported execution type: {execution['type']}"
        )

    function_name = execution["function_name"]
    parameters = execution.get("parameters", [])

    if parameters != ["root"]:
        raise ValueError(
            f"Unsupported binary-tree parameters: {parameters}"
        )

    test_lines = []

    for test_case in test_cases:
        values = test_case["input"][0]

        test_lines.append(
            "{"
        )
        test_lines.append(
            f"    const root = buildBinaryTree({json.dumps(values)});"
        )
        test_lines.append(
            f"    const result = {function_name}(root);"
        )
        test_lines.append(
            "    results.push(result);"
        )
        test_lines.append(
            "}"
        )

    harness = f"""
class TreeNode {{
    constructor(val = 0, left = null, right = null) {{
        this.val = val;
        this.left = left;
        this.right = right;
    }}
}}


function buildBinaryTree(values) {{
    if (!values || values.length === 0 || values[0] === null) {{
        return null;
    }}

    const nodes = values.map(
        value => value === null ? null : new TreeNode(value)
    );

    let childIndex = 1;

    for (const node of nodes) {{
        if (node === null) {{
            continue;
        }}

        if (childIndex < nodes.length) {{
            node.left = nodes[childIndex];
            childIndex++;
        }}

        if (childIndex < nodes.length) {{
            node.right = nodes[childIndex];
            childIndex++;
        }}
    }}

    return nodes[0];
}}


{user_code}


const results = [];

{chr(10).join(test_lines)}

console.log(JSON.stringify(results));
"""

    return harness
