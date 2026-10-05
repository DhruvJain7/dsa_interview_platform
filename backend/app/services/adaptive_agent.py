import json
from datetime import datetime, timezone
from typing import TypedDict

from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph

from app.services.session_service import SessionService


class AdaptiveState(TypedDict):
    user_id: str
    adaptive_session_id: str

    current_problem_id: str
    current_difficulty: str

    performance_history: list
    strengths: list
    weaknesses: list

    current_goal: str
    problem_candidates: list

    last_evaluation: dict
    last_action: str
    next_action: str


def load_user_history(
    state: AdaptiveState,
    redis_client,
):
    session_service = SessionService(redis_client)

    sessions = session_service.get_user_sessions(
        user_id=state["user_id"]
    )

    return {
        "performance_history": sessions
    }


def analyze_profile(state: AdaptiveState):
    history = state["performance_history"]

    dimension_scores = {
        "problem_understanding": [],
        "approach": [],
        "complexity": [],
        "clarity_and_articulation": [],
        "optimization": [],
    }

    for session in history:
        evaluation = session.get("evaluation")

        if not evaluation:
            continue

        if isinstance(evaluation, str):
            evaluation = json.loads(evaluation)

        for dimension in dimension_scores:
            dimension_data = evaluation.get(
                dimension,
                {},
            )

            score = dimension_data.get("score")

            if score is not None:
                dimension_scores[dimension].append(score)

    averages = {}

    for dimension, scores in dimension_scores.items():
        if scores:
            averages[dimension] = sum(scores) / len(scores)

    strengths = []
    weaknesses = []

    for dimension, average in averages.items():
        if average >= 4:
            strengths.append(dimension)

        if average <= 3:
            weaknesses.append(dimension)

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
    }


def set_goal(state: AdaptiveState):
    weaknesses = state["weaknesses"]

    goal_map = {
        "problem_understanding": (
            "Improve problem understanding by clearly identifying "
            "the requirements, constraints, and edge cases."
        ),
        "approach": (
            "Improve approach explanation by clearly explaining "
            "the reasoning and algorithm before coding."
        ),
        "complexity": (
            "Improve complexity analysis by clearly stating "
            "time and space complexity and connecting them to "
            "the implementation."
        ),
        "clarity_and_articulation": (
            "Improve articulation by explaining the reasoning "
            "clearly, concisely, and in a logical sequence."
        ),
        "optimization": (
            "Improve optimization by identifying better approaches "
            "and explaining the trade-offs between them."
        ),
    }

    if weaknesses:
        primary_weakness = weaknesses[0]

        return {
            "current_goal": goal_map[primary_weakness]
        }

    return {
        "current_goal": (
            "Maintain strong problem solving and articulation "
            "while continuing to improve consistency."
        )
    }


def get_problem_candidates(
    state: AdaptiveState,
    redis_client,
):
    previous_problem_ids = {
        session.get("problem_id")
        for session in state["performance_history"]
        if session.get("problem_id")
    }

    result = redis_client.execute_command(
        "FT.SEARCH",
        "idx:problems",
        "@difficulty:{medium}",
        "LIMIT",
        "0",
        "100",
    )

    candidates = []

    for item in result["results"]:
        problem = item["extra_attributes"]

        problem_id = problem.get("id")

        if not problem_id:
            continue

        if problem_id in previous_problem_ids:
            continue

        candidates.append(
            {
                "problem_id": problem_id,
                "title": problem.get("title", ""),
                "difficulty": problem.get(
                    "difficulty",
                    "",
                ),
                "topic": problem.get(
                    "topic",
                    "",
                ),
            }
        )

    return {
        "problem_candidates": candidates
    }


def adaptive_decision(state: AdaptiveState):
    candidates = state["problem_candidates"]

    if not candidates:
        return {
            "current_problem_id": "",
            "current_difficulty": "",
            "next_action": "complete",
        }

    llm = ChatOpenAI(
        model="gpt-5.5",
        temperature=0,
    )

    candidate_text = "\n".join(
        [
            (
                f"- {candidate['problem_id']} | "
                f"{candidate['title']} | "
                f"{candidate['difficulty']} | "
                f"{candidate['topic']}"
            )
            for candidate in candidates
        ]
    )

    prompt = f"""
You are the adaptive decision layer for Articula.

Articula helps users improve how they solve and articulate
DSA problems.

User strengths:
{state["strengths"]}

User weaknesses:
{state["weaknesses"]}

Current goal:
{state["current_goal"]}

Available problems:
{candidate_text}

Choose exactly ONE problem from the available problems.

Rules:
1. You MUST select a problem from the provided list.
2. NEVER invent a problem ID.
3. Prefer a problem that supports the user's current goal.
4. Consider the user's weaknesses and strengths.
5. Return only the problem_id.
"""

    response = llm.invoke(prompt)

    selected_problem_id = response.content.strip()

    valid_problem_ids = {
        candidate["problem_id"]
        for candidate in candidates
    }

    if selected_problem_id not in valid_problem_ids:
        fallback = candidates[0]

        return {
            "current_problem_id": fallback["problem_id"],
            "current_difficulty": fallback["difficulty"],
            "next_action": "start_problem",
        }

    selected_problem = next(
        candidate
        for candidate in candidates
        if candidate["problem_id"] == selected_problem_id
    )

    return {
        "current_problem_id": selected_problem["problem_id"],
        "current_difficulty": selected_problem["difficulty"],
        "next_action": "start_problem",
    }


def persist_adaptive_state(
    state: AdaptiveState,
    redis_client,
):
    now = datetime.now(timezone.utc).isoformat()

    redis_client.hset(
        f"adaptive_session:{state['adaptive_session_id']}",
        mapping={
            "current_problem_id": state["current_problem_id"],
            "current_difficulty": state["current_difficulty"],
            "performance_history": json.dumps(
                state["performance_history"]
            ),
            "strengths": json.dumps(
                state["strengths"]
            ),
            "weaknesses": json.dumps(
                state["weaknesses"]
            ),
            "current_goal": state["current_goal"],
            "last_evaluation": json.dumps(
                state["last_evaluation"]
            ),
            "last_action": "adaptive_decision",
            "next_action": state["next_action"],
            "updated_at": now,
        },
    )

    return {}


def build_adaptive_graph(redis_client):
    graph = StateGraph(AdaptiveState)

    graph.add_node(
        "load_history",
        lambda state: load_user_history(
            state,
            redis_client,
        ),
    )

    graph.add_node(
        "analyze_profile",
        analyze_profile,
    )

    graph.add_node(
        "set_goal",
        set_goal,
    )

    graph.add_node(
        "get_problem_candidates",
        lambda state: get_problem_candidates(
            state,
            redis_client,
        ),
    )

    graph.add_node(
        "adaptive_decision",
        adaptive_decision,
    )

    graph.add_node(
        "persist_state",
        lambda state: persist_adaptive_state(
            state,
            redis_client,
        ),
    )

    graph.add_edge(
        START,
        "load_history",
    )

    graph.add_edge(
        "load_history",
        "analyze_profile",
    )

    graph.add_edge(
        "analyze_profile",
        "set_goal",
    )

    graph.add_edge(
        "set_goal",
        "get_problem_candidates",
    )

    graph.add_edge(
        "get_problem_candidates",
        "adaptive_decision",
    )

    graph.add_edge(
        "adaptive_decision",
        "persist_state",
    )

    graph.add_edge(
        "persist_state",
        END,
    )

    return graph.compile()
