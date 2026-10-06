import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/*
 * ============================================================
 * TEMPORARY UI PREVIEW
 * ============================================================
 *
 * true  -> use mock data and preview all UI states
 * false -> use the real backend adaptive-session flow
 *
 * Keep this true while designing/testing the UI.
 */
const MOCK_UI = true;

const MOCK_STATES = {
  empty: {
    type: "empty",
  },

  ready: {
    type: "ready",
    adaptive_session_id: "demo-session-001",
    current_problem_id: "three_sum",
    current_difficulty: "medium",
    current_goal:
      "Explain your approach clearly and connect it to its time and space complexity.",
  },

  progress: {
    type: "progress",
    adaptive_session_id: "demo-session-001",
    current_problem_id: "course_schedule",
    current_difficulty: "medium",
    current_goal:
      "Make your complexity reasoning more precise and explain why your approach is efficient.",

    previous_problem: "Three Sum",
    previous_focus: "Problem Understanding",

    progress: {
      problem_understanding: "Strong",
      approach: "Strong",
      complexity: "Developing",
      clarity: "Good",
      optimization: "Good",
    },
  },

  completed: {
    type: "completed",
    adaptive_session_id: "demo-session-001",
    focus: "Complexity & Optimization",
    problems_completed: 3,

    progress: {
      complexity: "Improving",
      clarity: "Good",
      approach: "Strong",
    },
  },
};

const DIMENSIONS = [
  {
    key: "problem_understanding",
    label: "Problem Understanding",
    value: "Strong",
    percentage: 92,
  },
  {
    key: "approach",
    label: "Approach & Logic",
    value: "Strong",
    percentage: 88,
  },
  {
    key: "complexity",
    label: "Complexity",
    value: "Developing",
    percentage: 62,
  },
  {
    key: "clarity",
    label: "Clarity & Articulation",
    value: "Good",
    percentage: 80,
  },
  {
    key: "optimization",
    label: "Optimization",
    value: "Good",
    percentage: 76,
  },
];

const fadeUp = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const transition = {
  duration: 0.4,
  ease: "easeOut",
};

function Interactive() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [adaptiveSession, setAdaptiveSession] = useState(null);
  const [error, setError] = useState("");

  // Temporary preview state
  const [mockState, setMockState] = useState("empty");

  const currentMockState = MOCK_STATES[mockState];

  /*
   * ============================================================
   * START ADAPTIVE PRACTICE
   * ============================================================
   */

  const startInteractivePractice = async () => {
    setLoading(true);
    setError("");

    /*
     * MOCK MODE
     */

    if (MOCK_UI) {
      setTimeout(() => {
        setAdaptiveSession(MOCK_STATES.ready);
        setMockState("ready");
        setLoading(false);
      }, 500);

      return;
    }

    /*
     * REAL BACKEND
     */

    try {
      const token = localStorage.getItem("articula_access_token");

      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/interactive/session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.detail || "Failed to start interactive practice"
        );
      }

      const data = await response.json();

      setAdaptiveSession(data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * START CURRENT PRACTICE
   * ============================================================
   */

  const handleStartPractice = () => {
    if (MOCK_UI) {
      navigate(
        `/problems/${currentMockState.current_problem_id}/practice?adaptive_session=${currentMockState.adaptive_session_id}`
      );

      return;
    }

    if (!adaptiveSession?.current_problem_id) {
      return;
    }

    navigate(
      `/problems/${adaptiveSession.current_problem_id}/practice?adaptive_session=${adaptiveSession.adaptive_session_id}`
    );
  };

  /*
   * ============================================================
   * MOCK STATE PREVIEW
   * ============================================================
   */

  const handleMockState = (state) => {
    setMockState(state);

    if (state === "empty") {
      setAdaptiveSession(null);
    } else {
      setAdaptiveSession(MOCK_STATES[state]);
    }

    setError("");
  };

  /*
   * ============================================================
   * SHARED SESSION DATA
   * ============================================================
   */

  const session = MOCK_UI ? currentMockState : adaptiveSession;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:px-10">
        {/* =====================================================
            DEVELOPMENT PREVIEW
        ====================================================== */}

        {MOCK_UI && (
          <motion.div
            {...fadeUp}
            transition={transition}
            className="mb-12 rounded-xl border border-dashed border-black/20 bg-black/[0.02] p-4 dark:border-white/20 dark:bg-white/[0.02]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                  Development Preview
                </p>

                <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                  Mock data is enabled so you can preview the adaptive
                  experience without code execution.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ["empty", "No Session"],
                  ["ready", "Ready"],
                  ["progress", "In Progress"],
                  ["completed", "Completed"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleMockState(value)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                      mockState === value
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-black/10 bg-white text-black/60 hover:bg-black/5 dark:border-white/10 dark:bg-[#292929] dark:text-white/60 dark:hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <motion.section
          {...fadeUp}
          transition={transition}
          className="max-w-3xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
            Interactive Practice
          </p>

          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Practice how you think.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-black/50 dark:text-white/50">
            Solve a problem, explain your reasoning, and get better at
            articulating your solutions. Articula adapts your practice based on
            how you learn.
          </p>
        </motion.section>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <motion.p
            {...fadeUp}
            transition={{
              ...transition,
              delay: 0.05,
            }}
            className="mt-6 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}

        {/* =====================================================
            STATE 1 — NO SESSION
        ====================================================== */}

        {session?.type === "empty" && (
          <motion.section
            {...fadeUp}
            transition={{
              ...transition,
              delay: 0.08,
            }}
            className="mt-14"
          >
            <div className="rounded-2xl border border-black/10 p-8 dark:border-white/10 md:p-10">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                  Adaptive Practice
                </p>

                <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight">
                  Start your practice journey.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-black/50 dark:text-white/50">
                  Articula looks at how you understand problems, build
                  solutions, explain your reasoning, and communicate
                  complexity. Your next practice adapts based on that
                  progress.
                </p>

                {/* Learning loop */}

                <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-4">
                  {[
                    ["01", "Solve", "Work through the problem."],
                    ["02", "Explain", "Articulate your reasoning."],
                    ["03", "Analyze", "Understand your strengths."],
                    ["04", "Adapt", "Practice what needs work."],
                  ].map(([number, title, description]) => (
                    <div
                      key={title}
                      className="bg-white p-5 dark:bg-[#292929]"
                    >
                      <p className="text-[10px] tracking-[0.16em] text-black/30 dark:text-white/30">
                        {number}
                      </p>

                      <p className="mt-4 text-sm font-medium">
                        {title}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-black/45 dark:text-white/45">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={startInteractivePractice}
                  disabled={loading}
                  className="mt-9 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                >
                  {loading
                    ? "Preparing your practice..."
                    : "Start adaptive practice →"}
                </button>
              </div>
            </div>

            {/* Empty history */}

            <div className="mt-14">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                Adaptive Sessions
              </p>

              <div className="mt-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
                <p className="text-sm font-medium">
                  No adaptive sessions yet.
                </p>

                <p className="mt-2 text-sm leading-6 text-black/45 dark:text-white/45">
                  Your learning journeys will appear here as you practice.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            STATE 2 — SESSION READY
        ====================================================== */}

        {session?.type === "ready" && (
          <motion.section
            {...fadeUp}
            transition={{
              ...transition,
              delay: 0.08,
            }}
            className="mt-14"
          >
            <div className="mb-5 flex items-center gap-3">
              <motion.span
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-2 w-2 rounded-full bg-black dark:bg-white"
              />

              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                Adaptive Practice · Ready
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 p-8 dark:border-white/10 md:p-10">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                  Your practice focus
                </p>

                <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight">
                  Build a clear explanation.
                </h2>

                <p className="mt-4 text-sm leading-7 text-black/50 dark:text-white/50">
                  This first practice gives Articula a baseline for how you
                  approach and explain problems. Your responses will shape what
                  you practice next.
                </p>
              </div>

              {/* Next Practice */}

              <div className="mt-9 rounded-xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                      Your next practice
                    </p>

                    <h3 className="mt-3 text-2xl font-medium">
                      Three Sum
                    </h3>

                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/35 dark:text-white/35">
                      Medium
                    </p>
                  </div>

                  <div className="sm:max-w-sm">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                      Practice focus
                    </p>

                    <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
                      {session.current_goal}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartPractice}
                  className="mt-8 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-75 dark:bg-white dark:text-black"
                >
                  Start Practice →
                </button>
              </div>

              {/* Learning Journey */}

              <div className="mt-10">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                  Learning journey
                </p>

                <div className="mt-5">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-medium text-white dark:bg-white dark:text-black">
                      1
                    </div>

                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-xs text-black/30 dark:border-white/10 dark:text-white/30">
                      2
                    </div>

                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-xs text-black/30 dark:border-white/10 dark:text-white/30">
                      3
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between text-[11px] text-black/35 dark:text-white/35">
                    <span>Current</span>
                    <span>Next</span>
                    <span>Later</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            STATE 3 — SESSION IN PROGRESS
        ====================================================== */}

        {session?.type === "progress" && (
          <motion.section
            {...fadeUp}
            transition={{
              ...transition,
              delay: 0.08,
            }}
            className="mt-14"
          >
            <div className="mb-5 flex items-center gap-3">
              <motion.span
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-2 w-2 rounded-full bg-black dark:bg-white"
              />

              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                Adaptive Practice · In Progress
              </p>
            </div>

            {/* =================================================
                ADAPTIVE MOMENT
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.45,
              }}
              className="mb-6 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
            >
              <div className="border-b border-black/10 px-6 py-4 dark:border-white/10">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                  Adaptive Moment
                </p>
              </div>

              <div className="grid gap-px bg-black/10 dark:bg-white/10 md:grid-cols-3">
                {/* Noticed */}

                <div className="bg-white p-6 dark:bg-[#292929]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/30 dark:text-white/30">
                    Articula noticed
                  </p>

                  <p className="mt-3 text-sm leading-6 text-black/65 dark:text-white/65">
                    Your problem-solving approach is strong, but your
                    complexity explanation can be more precise.
                  </p>
                </div>

                {/* Focus */}

                <div className="bg-white p-6 dark:bg-[#292929]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/30 dark:text-white/30">
                    Practice focus
                  </p>

                  <p className="mt-3 text-sm font-medium">
                    Complexity & Optimization
                  </p>

                  <p className="mt-2 text-xs leading-5 text-black/45 dark:text-white/45">
                    Keep strengthening this skill.
                  </p>
                </div>

                {/* Adapted */}

                <div className="bg-white p-6 dark:bg-[#292929]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/30 dark:text-white/30">
                    Articula adapted
                  </p>

                  <p className="mt-3 text-sm leading-6 text-black/65 dark:text-white/65">
                    Your next problem gives you another opportunity to explain
                    why your solution is efficient.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                MAIN CONTENT
            ================================================== */}

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              {/* Next Practice */}

              <motion.div
                {...fadeUp}
                transition={{
                  ...transition,
                  delay: 0.12,
                }}
                className="rounded-2xl border border-black/10 p-8 dark:border-white/10"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                  Your next practice
                </p>

                <h2 className="mt-4 font-serif text-3xl font-medium">
                  Course Schedule
                </h2>

                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-black/35 dark:text-white/35">
                  Medium
                </p>

                <div className="mt-8 border-l border-black/20 pl-5 dark:border-white/20">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                    Practice focus
                  </p>

                  <p className="mt-2 text-sm leading-7 text-black/60 dark:text-white/60">
                    {session.current_goal}
                  </p>
                </div>

                <div className="mt-8 rounded-xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                    Why this practice?
                  </p>

                  <p className="mt-3 text-sm leading-7 text-black/55 dark:text-white/55">
                    Your previous response showed strong problem understanding
                    and approach. This practice gives you another opportunity
                    to make your complexity explanation more precise.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartPractice}
                  className="mt-8 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-75 dark:bg-white dark:text-black"
                >
                  Continue Practice →
                </button>
              </motion.div>

              {/* Progress */}

              <motion.div
                {...fadeUp}
                transition={{
                  ...transition,
                  delay: 0.16,
                }}
                className="rounded-2xl border border-black/10 p-6 dark:border-white/10"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                  Your progress
                </p>

                <div className="mt-7 space-y-6">
                  {DIMENSIONS.map((dimension, index) => (
                    <div key={dimension.key}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-black/50 dark:text-white/50">
                          {dimension.label}
                        </span>

                        <span className="text-xs font-medium">
                          {dimension.value}
                        </span>
                      </div>

                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${dimension.percentage}%`,
                          }}
                          transition={{
                            duration: 0.7,
                            delay: 0.2 + index * 0.08,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full bg-black/70 dark:bg-white/70"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* =================================================
                LEARNING JOURNEY
            ================================================== */}

            <motion.div
              {...fadeUp}
              transition={{
                ...transition,
                delay: 0.2,
              }}
              className="mt-8 rounded-2xl border border-black/10 p-6 dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                    Learning journey
                  </p>

                  <p className="mt-2 text-sm text-black/45 dark:text-white/45">
                    Your practice is evolving with you.
                  </p>
                </div>

                <span className="text-xs text-black/35 dark:text-white/35">
                  2 / 3
                </span>
              </div>

              <div className="mt-7 flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black">
                  ✓
                </div>

                <div className="h-px flex-1 bg-black dark:bg-white" />

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black">
                  2
                </div>

                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-xs text-black/30 dark:border-white/10 dark:text-white/30">
                  3
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 text-xs">
                <div>
                  <p className="font-medium">Three Sum</p>

                  <p className="mt-1 text-black/35 dark:text-white/35">
                    Completed
                  </p>
                </div>

                <div className="text-center">
                  <p className="font-medium">Course Schedule</p>

                  <p className="mt-1 text-black/35 dark:text-white/35">
                    Next
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-black/30 dark:text-white/30">
                    Upcoming
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* =====================================================
            STATE 4 — COMPLETED
        ====================================================== */}

        {session?.type === "completed" && (
          <motion.section
            {...fadeUp}
            transition={{
              ...transition,
              delay: 0.08,
            }}
            className="mt-14"
          >
            <div className="rounded-2xl border border-black/10 p-8 dark:border-white/10 md:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                Adaptive Practice · Completed
              </p>

              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight">
                Practice journey complete.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50 dark:text-white/50">
                You completed this learning journey focused on{" "}
                <span className="font-medium text-black dark:text-white">
                  {session.focus}
                </span>
                . Your performance gives Articula a clearer picture of how you
                approach and communicate solutions.
              </p>

              {/* Outcome */}

              <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-3">
                <div className="bg-white p-6 dark:bg-[#292929]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                    Problems
                  </p>

                  <p className="mt-3 text-3xl font-medium">
                    {session.problems_completed}
                  </p>
                </div>

                <div className="bg-white p-6 dark:bg-[#292929]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                    Complexity
                  </p>

                  <p className="mt-3 text-sm font-medium">
                    {session.progress.complexity}
                  </p>
                </div>

                <div className="bg-white p-6 dark:bg-[#292929]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                    Clarity
                  </p>

                  <p className="mt-3 text-sm font-medium">
                    {session.progress.clarity}
                  </p>
                </div>
              </div>

              {/* Improvement */}

              <div className="mt-8 rounded-xl border border-black/10 p-6 dark:border-white/10">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                  What improved
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">
                      Complexity reasoning
                    </p>

                    <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/50">
                      Your explanations became more precise when connecting
                      implementation choices to complexity.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Solution articulation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/50">
                      You became more consistent in explaining the reasoning
                      behind your approach.
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Next */}

              <div className="mt-8 rounded-xl border border-black/10 p-6 dark:border-white/10">
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                  What's next?
                </p>

                <h3 className="mt-3 text-lg font-medium">
                  Continue improving your articulation.
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-black/50 dark:text-white/50">
                  Start another adaptive practice journey and let Articula
                  identify the next area worth working on.
                </p>

                <button
                  type="button"
                  onClick={startInteractivePractice}
                  className="mt-6 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-75 dark:bg-white dark:text-black"
                >
                  Start New Practice →
                </button>
              </div>
            </div>

            {/* Adaptive Session History */}

            <div className="mt-14">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                Adaptive Sessions
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/interactive/session/${session.adaptive_session_id}`
                  )
                }
                className="mt-4 w-full rounded-xl border border-black/10 p-5 text-left transition hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.02]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {session.focus}
                    </p>

                    <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                      {session.problems_completed} problems · Completed
                    </p>
                  </div>

                  <span className="text-xs text-black/35 dark:text-white/35">
                    View journey →
                  </span>
                </div>
              </button>
            </div>
          </motion.section>
        )}
      </main>

      <Footer variant="minimal" />
    </div>
  );
}

export default Interactive;