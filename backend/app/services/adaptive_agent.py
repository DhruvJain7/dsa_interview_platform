from typing import TypedDict

from langgraph.graph import END, START, StateGraph


class AdaptiveState(TypedDict):
    user_id: str
    adaptive_session_id: str

    current_problem_id: str
    current_difficulty: str

    performance_history: list
    strengths: list
    weaknesses: list

    current_goal: str

    last_evaluation: dict
    last_action: str
    next_action: str


def build_adaptive_graph():
    graph = StateGraph(AdaptiveState)

    graph.add_node(
        "start",
        lambda state: state,
    )

    graph.add_edge(START, "start")
    graph.add_edge("start", END)

    return graph.compile()
