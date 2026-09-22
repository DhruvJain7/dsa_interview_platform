from app.services.harnesses.function import generate_python_harness
from app.services.harnesses.linked_list import (
    generate_python_linked_list_harness,
)
from app.services.harnesses.binary_tree import (
    generate_python_binary_tree_harness,
)
from app.services.harnesses.class_problem import (
    generate_python_class_harness,
)
from app.services.harnesses.javascript_function import (
    generate_javascript_function_harness,
)


def generate_harness(
    user_code: str,
    execution: dict,
    test_cases: list,
    language: str = "python",
) -> str:
    execution_type = execution["type"]

    if language == "python":
        if execution_type == "function":
            return generate_python_harness(
                user_code=user_code,
                execution=execution,
                test_cases=test_cases,
            )

        if execution_type == "linked_list":
            return generate_python_linked_list_harness(
                user_code=user_code,
                execution=execution,
                test_cases=test_cases,
            )

        if execution_type == "binary_tree":
            return generate_python_binary_tree_harness(
                user_code=user_code,
                execution=execution,
                test_cases=test_cases,
            )

        if execution_type == "class":
            return generate_python_class_harness(
                user_code=user_code,
                execution=execution,
                test_cases=test_cases,
            )

    if language == "javascript":
        if execution_type == "function":
            return generate_javascript_function_harness(
                user_code=user_code,
                execution=execution,
                test_cases=test_cases,
            )

    raise ValueError(
        f"Unsupported language/execution combination: "
        f"{language}/{execution_type}"
    )
