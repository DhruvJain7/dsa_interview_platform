import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/*
 * ============================================================
 * TEMPORARY UI PREVIEW
 * ============================================================
 *
 * true  -> use mock data
 * false -> use real backend
 *
 * Keep true while designing the page.
 */
const MOCK_UI = true;

const MOCK_ADAPTIVE_SESSION = {
  adaptive_session_id: "demo-session-001",

  status: "in_progress",

  focus: "Complexity & Optimization",

  problems_completed: 2,

  total_problems: 3,

  current_problem_id: "course_schedule",

  current_problem_title: "Course Schedule",

  current_difficulty: "medium",

  current_goal:
    "Make your complexity reasoning more precise and explain why your approach is efficient.",

  progress: {
    problem_understanding: {
      score: 4.5,
      label: "Strong",
    },

    approach: {
      score: 4.3,
      label: "Strong",
    },

    complexity: {
      score: 3.1,
      label: "Developing",
    },

    clarity_and_articulation: {
      score: 4.0,
      label: "Good",
    },

    optimization: {
      score: 3.8,
      label: "Good",
    },
  },

  journey: [
    {
      problem_id: "three_sum",
      title: "Three Sum",
      difficulty: "medium",
      status: "completed",
      focus: "Problem Understanding",
    },

    {
      problem_id: "course_schedule",
      title: "Course Schedule",
      difficulty: "medium",
      status: "current",
      focus: "Complexity & Optimization",
    },

    {
      problem_id: "longest_substring",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      status: "upcoming",
      focus: "Clarity & Articulation",
    },
  ],

  adaptations: [
    {
      step: "Previous practice",
      title: "Strong problem-solving approach",
      description:
        "Your previous response showed that you can identify an effective approach and reason through the problem.",
    },

    {
      step: "Improvement opportunity",
      title: "Complexity explanation needs more precision",
      description:
        "The reasoning behind time and space complexity was less consistent than your approach.",
    },

    {
      step: "Articula adapted",
      title: "Keep complexity as the practice focus",
      description:
        "The next problem was selected to give you another opportunity to explain why your solution is efficient.",
    },
  ],
};

const DIMENSIONS = [
  {
    key: "problem_understanding",
    label: "Problem Understanding",
  },
  {
    key: "approach",
    label: "Approach & Logic",
  },
  {
    key: "complexity",
    label: "Complexity",
  },
  {
    key: "clarity_and_articulation",
    label: "Clarity & Articulation",
  },
  {
    key: "optimization",
    label: "Optimization",
  },
];

const fadeUp = {
  initial: {
    opacity: 0,
    y: 12,
  },

  animate: {
    opacity: 1,
    y: 0,
  },
};

function AdaptiveSessionDetail() {
  const { adaptiveSessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(
    MOCK_UI ? MOCK_ADAPTIVE_SESSION : null
  );

  const [loading, setLoading] = useState(!MOCK_UI);
  const [error, setError] = useState("");

  /*
   * ============================================================
   * FETCH ADAPTIVE SESSION
   * ============================================================
   */

  useEffect(() => {
    if (MOCK_UI) {
      setSession(MOCK_ADAPTIVE_SESSION);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("articula_access_token");

    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchAdaptiveSession = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * IMPORTANT:
         *
         * This endpoint is intentionally isolated here.
         * Once we inspect the actual backend adaptive-session
         * service/schema, we will replace this with the exact
         * endpoint already supported by Articula.
         */

        const response = await fetch(
          `${API_BASE_URL}/interactive/session/${adaptiveSessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to fetch adaptive session"
          );
        }

        setSession(data);
      } catch (err) {
        console.error(err);

        setError(
          err.message || "Unable to load adaptive session"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdaptiveSession();
  }, [adaptiveSessionId, navigate]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6 pt-32">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-black/40 dark:text-white/40"
          >
            Loading adaptive practice...
          </motion.p>
        </main>
      </div>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (error || !session) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 pb-20 pt-32">
          <button
            type="button"
            onClick={() => navigate("/interactive")}
            className="mb-10 text-sm text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            ← Interactive Practice
          </button>

          <div className="rounded-2xl border border-black/10 p-8 dark:border-white/10">
            <h1 className="text-xl font-medium">
              Unable to load adaptive session
            </h1>

            <p className="mt-2 text-sm text-black/50 dark:text-white/50">
              {error || "Adaptive session not found."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const isCompleted = session.status === "completed";

  const completedCount = session.problems_completed || 0;

  const totalProblems =
    session.total_problems || session.journey?.length || 3;

  const progressPercentage = Math.min(
    100,
    Math.round((completedCount / totalProblems) * 100)
  );

  /*
   * ============================================================
   * START CURRENT PRACTICE
   * ============================================================
   */

  const handleContinuePractice = () => {
    if (!session.current_problem_id) {
      return;
    }

    navigate(
      `/problems/${session.current_problem_id}/practice?adaptive_session=${session.adaptive_session_id}`
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:px-10">
        {/* =====================================================
            BACK
        ====================================================== */}

        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          type="button"
          onClick={() => navigate("/interactive")}
          className="mb-10 text-sm text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
        >
          ← Interactive Practice
        </motion.button>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.header
          {...fadeUp}
          transition={{ duration: 0.45 }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                Adaptive Practice
              </p>

              <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
                {session.focus}
              </h1>

              <div className="mt-3 flex items-center gap-3 text-sm text-black/45 dark:text-white/45">
                <span>
                  {completedCount} of {totalProblems} problems
                </span>

                <span>·</span>

                <span>
                  {isCompleted ? "Completed" : "In Progress"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  isCompleted
                    ? "bg-black dark:bg-white"
                    : "bg-black/30 dark:bg-white/30"
                }`}
              />

              <span className="text-black/60 dark:text-white/60">
                {isCompleted ? "Completed" : "In progress"}
              </span>
            </div>
          </div>
        </motion.header>

        {/* =====================================================
            OVERALL PROGRESS
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.05,
          }}
          className="mt-12 border-b border-black/10 pb-10 dark:border-white/10"
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                Journey Progress
              </p>

              <p className="mt-2 text-sm text-black/50 dark:text-white/50">
                Your adaptive practice is building from one response to the
                next.
              </p>
            </div>

            <span className="text-sm text-black/45 dark:text-white/45">
              {progressPercentage}%
            </span>
          </div>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${progressPercentage}%`,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="h-full rounded-full bg-black/70 dark:bg-white/70"
            />
          </div>
        </motion.section>

        {/* =====================================================
            LEARNING FOCUS
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.1,
          }}
          className="mt-12"
        >
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
              Your Learning Focus
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              {session.focus}
            </h2>
          </div>

          <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <p className="max-w-3xl text-sm leading-7 text-black/60 dark:text-white/60">
              Articula identified this as an area worth strengthening and
              adapted your practice around it. The goal is not simply to solve
              more problems, but to become more precise in how you communicate
              your reasoning.
            </p>
          </div>
        </motion.section>

        {/* =====================================================
            LEARNING JOURNEY
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.15,
          }}
          className="mt-14"
        >
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
              Learning Journey
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              Your practice, step by step.
            </h2>
          </div>

          <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <div className="space-y-0">
              {session.journey?.map((item, index) => {
                const isLast =
                  index === session.journey.length - 1;

                const isCurrent = item.status === "current";

                const isDone = item.status === "completed";

                return (
                  <motion.div
                    key={`${item.problem_id}-${index}`}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.07,
                    }}
                    className="flex gap-5"
                  >
                    {/* Timeline */}

                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                          isDone || isCurrent
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "border border-black/10 text-black/30 dark:border-white/10 dark:text-white/30"
                        }`}
                      >
                        {isDone ? "✓" : index + 1}
                      </div>

                      {!isLast && (
                        <div
                          className={`my-2 w-px flex-1 ${
                            isDone
                              ? "bg-black/30 dark:bg-white/30"
                              : "bg-black/10 dark:bg-white/10"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}

                    <div
                      className={`pb-8 ${
                        isLast ? "pb-0" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <h3
                          className={`text-sm font-medium ${
                            item.status === "upcoming"
                              ? "text-black/35 dark:text-white/35"
                              : ""
                          }`}
                        >
                          {item.title}
                        </h3>

                        <span className="text-[10px] uppercase tracking-[0.14em] text-black/35 dark:text-white/35">
                          {item.difficulty}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                        {item.focus}
                      </p>

                      <p className="mt-2 text-xs text-black/35 dark:text-white/35">
                        {item.status === "completed"
                          ? "Completed"
                          : item.status === "current"
                            ? "Current practice"
                            : "Upcoming"}
                      </p>

                      {item.status === "completed" && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/problems/${item.problem_id}`
                            )
                          }
                          className="mt-3 text-xs font-medium text-black transition hover:opacity-50 dark:text-white"
                        >
                          View problem →
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            PROGRESS BREAKDOWN
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.2,
          }}
          className="mt-14"
        >
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
              Your Progress
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              How you're developing.
            </h2>

            <p className="mt-2 text-sm text-black/40 dark:text-white/40">
              Your current performance across the five articulation
              dimensions.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <div className="space-y-7">
              {DIMENSIONS.map((dimension, index) => {
                const data =
                  session.progress?.[dimension.key];

                if (!data) {
                  return null;
                }

                const score = Number(data.score || 0);

                const percentage = Math.min(
                  100,
                  Math.max(0, (score / 5) * 100)
                );

                return (
                  <motion.div
                    key={dimension.key}
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm">
                        {dimension.label}
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-black/45 dark:text-white/45">
                          {data.label}
                        </span>

                        <span className="text-xs text-black/35 dark:text-white/35">
                          {score.toFixed(1)}/5
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        whileInView={{
                          width: `${percentage}%`,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-black/70 dark:bg-white/70"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            HOW ARTICULA ADAPTED
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.25,
          }}
          className="mt-14"
        >
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
              Adaptation
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              How Articula adapted your practice.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/40 dark:text-white/40">
              The important part isn't just which problem came next. It's why
              your practice changed.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 dark:border-white/10">
            {session.adaptations?.map((adaptation, index) => (
              <motion.div
                key={adaptation.step}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.08,
                }}
                className={`p-6 ${
                  index !== session.adaptations.length - 1
                    ? "border-b border-black/10 dark:border-white/10"
                    : ""
                }`}
              >
                <div className="flex gap-5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-xs dark:border-white/10">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                      {adaptation.step}
                    </p>

                    <h3 className="mt-2 text-sm font-medium">
                      {adaptation.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/55">
                      {adaptation.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* =====================================================
            CURRENT PRACTICE
        ====================================================== */}

        {!isCompleted && session.current_problem_id && (
          <motion.section
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.3,
            }}
            className="mt-14"
          >
            <div className="rounded-2xl border border-black/10 p-7 dark:border-white/10 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                    Current Practice
                  </p>

                  <h2 className="mt-3 text-2xl font-medium">
                    {session.current_problem_title ||
                      session.current_problem_id}
                  </h2>

                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-black/35 dark:text-white/35">
                    {session.current_difficulty}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleContinuePractice}
                  className="shrink-0 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-75 dark:bg-white dark:text-black"
                >
                  Continue Practice →
                </button>
              </div>

              <div className="mt-7 border-l border-black/20 pl-5 dark:border-white/20">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                  Practice focus
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-black/60 dark:text-white/60">
                  {session.current_goal}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            COMPLETED OUTCOME
        ====================================================== */}

        {isCompleted && (
          <motion.section
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.3,
            }}
            className="mt-14"
          >
            <div className="rounded-2xl border border-black/10 p-7 dark:border-white/10 md:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                Journey Outcome
              </p>

              <h2 className="mt-3 font-serif text-2xl font-medium">
                Practice journey complete.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-black/50 dark:text-white/50">
                You completed this adaptive journey. The progress above
                captures how your articulation developed across the practice
                sequence.
              </p>

              <button
                type="button"
                onClick={() => navigate("/interactive")}
                className="mt-7 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-75 dark:bg-white dark:text-black"
              >
                Start Another Practice →
              </button>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            FOOTER NAVIGATION
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mt-16 border-t border-black/10 pt-8 dark:border-white/10"
        >
          <button
            type="button"
            onClick={() => navigate("/interactive")}
            className="text-sm font-medium text-black transition hover:opacity-50 dark:text-white"
          >
            ← Back to Adaptive Practice
          </button>
        </motion.div>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}

export default AdaptiveSessionDetail;