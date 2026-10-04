import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function SessionDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("articula_access_token");

    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchSession = async () => {
      try {
        const sessionResponse = await fetch(
          `${API_BASE_URL}/sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sessionData = await sessionResponse.json();

        if (!sessionResponse.ok) {
          throw new Error(
            sessionData.detail || "Failed to fetch session"
          );
        }

        setSession(sessionData);

        const problemResponse = await fetch(
          `${API_BASE_URL}/problems/${sessionData.problem_id}`
        );

        const problemData = await problemResponse.json();

        if (!problemResponse.ok) {
          throw new Error(
            problemData.detail || "Failed to fetch problem"
          );
        }

        setProblem(problemData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6 pt-32">
          <p className="text-sm text-black/40 dark:text-white/40">
            Loading session...
          </p>
        </main>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 pb-20 pt-32">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-10 text-sm text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            ← Dashboard
          </button>

          <div className="rounded-2xl border border-black/10 p-8 dark:border-white/10">
            <h1 className="text-xl font-medium">
              Unable to load session
            </h1>

            <p className="mt-2 text-sm text-black/50 dark:text-white/50">
              {error || "Session not found."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  let executionResult = {};

  try {
    executionResult =
      typeof session.execution_result === "string"
        ? JSON.parse(session.execution_result)
        : session.execution_result || {};
  } catch {
    executionResult = {};
  }

  const tests = executionResult?.tests || [];

  const passedTests =
    executionResult?.passed ??
    tests.filter((test) => test.passed).length;

  const totalTests =
    executionResult?.total ??
    tests.length;

  const executionPassed =
    totalTests > 0 && passedTests === totalTests;

  const statusLabel =
    session.status === "completed"
      ? "Completed"
      : session.status === "submitted"
      ? "Submitted"
      : session.status;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:px-10">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => navigate("/dashboard")}
          className="mb-10 text-sm text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
        >
          ← Dashboard
        </motion.button>

        {/* Session Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
                {problem?.title || session.problem_id}
              </h1>

              <div className="mt-3 flex items-center gap-3 text-sm text-black/45 dark:text-white/45">
                <span className="capitalize">
                  {session.language}
                </span>

                {problem?.difficulty && (
                  <>
                    <span>·</span>

                    <span className="capitalize">
                      {problem.difficulty}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-2 w-2 rounded-full ${
                  session.status === "completed"
                    ? "bg-black dark:bg-white"
                    : "bg-black/30 dark:bg-white/30"
                }`}
              />

              <span className="capitalize text-black/60 dark:text-white/60">
                {statusLabel}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Problem Reference */}
        {problem && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-12 border-b border-black/10 pb-8 dark:border-white/10"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                  Problem
                </p>

                {problem.description && (
                  <p className="mt-3 text-sm leading-7 text-black/60 dark:text-white/60">
                    {problem.description}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  navigate(`/problems/${session.problem_id}`)
                }
                className="shrink-0 text-sm font-medium text-black transition hover:opacity-50 dark:text-white"
              >
                View problem →
              </button>
            </div>
          </motion.section>
        )}

        {/* Your Solution */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-10"
        >
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
              Your Solution
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-[#1b1b1b]">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-3 dark:border-white/10">
              <span className="text-xs text-black/40 dark:text-white/40">
                {session.language}
              </span>
            </div>

            <pre className="overflow-x-auto p-6 text-sm leading-7 text-black/80 dark:text-white/80">
              <code>{session.code || "No code submitted."}</code>
            </pre>
          </div>
        </motion.section>

        {/* Execution */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-12"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                Execution
              </p>

              <h2 className="mt-2 text-xl font-medium tracking-tight">
                {executionPassed
                  ? "All tests passed"
                  : "Tests need attention"}
              </h2>
            </div>

            <div className="text-sm text-black/50 dark:text-white/50">
              {passedTests} / {totalTests} passed
            </div>
          </div>

          {tests.length > 0 ? (
            <div className="space-y-3">
              {tests.map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.04,
                  }}
                  className="flex items-center justify-between rounded-xl border border-black/10 px-5 py-4 dark:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                        test.passed
                          ? "border-black/20 dark:border-white/20"
                          : "border-black/10 text-black/40 dark:border-white/10 dark:text-white/40"
                      }`}
                    >
                      {test.passed ? "✓" : "×"}
                    </span>

                    <span className="text-sm">
                      Test {index + 1}
                    </span>
                  </div>

                  <span className="text-xs text-black/40 dark:text-white/40">
                    {test.passed ? "Passed" : "Failed"}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-black/10 px-5 py-4 text-sm text-black/50 dark:border-white/10 dark:text-white/50">
              No test details available.
            </div>
          )}

          {executionResult?.error && (
            <div className="mt-4 rounded-xl border border-black/10 px-5 py-4 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
              {executionResult.error}
            </div>
          )}
        </motion.section>

        {/* Articulation */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-12"
        >
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
              Articulation
            </p>

            <h2 className="mt-2 text-xl font-medium tracking-tight">
              Your Explanation
            </h2>
          </div>

          <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            {session.transcript ? (
              <p className="text-sm leading-7 text-black/70 dark:text-white/70">
                {session.transcript}
              </p>
            ) : (
              <p className="text-sm text-black/40 dark:text-white/40">
                No explanation was recorded for this session.
              </p>
            )}
          </div>
        </motion.section>

        {/* Evaluation */}
        {session.evaluation && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="mt-16"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                Evaluation
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight">
                Your Articulation Review
              </h2>
            </div>

            {(() => {
              const dimensions = [
                ["Problem Understanding", "problem_understanding"],
                ["Approach / Logic", "approach"],
                ["Complexity", "complexity"],
                ["Clarity & Articulation", "clarity_and_articulation"],
                ["Optimization", "optimization"],
              ];

              const scoredDimensions = dimensions
                .map(([label, key]) => ({
                  label,
                  key,
                  dimension: session.evaluation[key],
                }))
                .filter(
                  ({ dimension }) =>
                    dimension && dimension.score != null
                );

              const overallScore =
                scoredDimensions.length > 0
                  ? scoredDimensions.reduce(
                      (sum, { dimension }) =>
                        sum + Number(dimension.score),
                      0
                    ) / scoredDimensions.length
                  : null;

              return (
                <>
                  {/* Overall Score */}
                  {overallScore != null && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="mt-7 rounded-2xl border border-black/10 p-6 dark:border-white/10"
                    >
                      <div className="flex items-end justify-between gap-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-black/35 dark:text-white/35">
                            Overall Score
                          </p>

                          <div className="mt-2 flex items-end gap-2">
                            <span className="text-5xl font-medium tracking-tight">
                              {overallScore.toFixed(1)}
                            </span>

                            <span className="mb-1 text-sm text-black/35 dark:text-white/35">
                              / 5
                            </span>
                          </div>
                        </div>

                        <span className="text-right text-sm text-black/50 dark:text-white/50">
                          {overallScore >= 4.5
                            ? "Excellent articulation"
                            : overallScore >= 4
                            ? "Strong articulation"
                            : overallScore >= 3
                            ? "Good foundation"
                            : "Needs improvement"}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Dimension Scores */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-6 rounded-2xl border border-black/10 p-6 dark:border-white/10"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Performance Breakdown
                      </p>

                      <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                        How your solution was articulated
                      </p>
                    </div>

                    <div className="mt-7 space-y-6">
                      {scoredDimensions.map(
                        ({ label, dimension }, index) => {
                          const score = Number(dimension.score);

                          const percentage = Math.min(
                            100,
                            Math.max(0, (score / 5) * 100)
                          );

                          return (
                            <motion.div
                              key={label}
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{
                                opacity: 1,
                                y: 0,
                              }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-sm">
                                  {label}
                                </span>

                                <span className="text-xs text-black/50 dark:text-white/50">
                                  {score}/5
                                </span>
                              </div>

                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{
                                    width: `${percentage}%`,
                                  }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.6,
                                    delay: index * 0.05,
                                    ease: "easeOut",
                                  }}
                                  className="h-full rounded-full bg-black/70 dark:bg-white/70"
                                />
                              </div>

                              {dimension.feedback && (
                                <p className="mt-2 text-xs leading-5 text-black/45 dark:text-white/45">
                                  {dimension.feedback}
                                </p>
                              )}
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                  </motion.div>

                  {/* Strengths / Focus Next */}
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {session.evaluation.strengths?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-black/10 p-6 dark:border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">✓</span>

                          <h3 className="text-sm font-medium">
                            Strengths
                          </h3>
                        </div>

                        <ul className="mt-5 space-y-3">
                          {session.evaluation.strengths
                            .slice(0, 3)
                            .map((strength, index) => (
                              <li
                                key={index}
                                className="text-sm leading-6 text-black/60 dark:text-white/60"
                              >
                                {strength}
                              </li>
                            ))}
                        </ul>
                      </motion.div>
                    )}

                    {session.evaluation.improvements?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="rounded-2xl border border-black/10 p-6 dark:border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">→</span>

                          <h3 className="text-sm font-medium">
                            Focus Next
                          </h3>
                        </div>

                        <ul className="mt-5 space-y-3">
                          {session.evaluation.improvements
                            .slice(0, 3)
                            .map((improvement, index) => (
                              <li
                                key={index}
                                className="text-sm leading-6 text-black/60 dark:text-white/60"
                              >
                                {improvement}
                              </li>
                            ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </>
              );
            })()}
          </motion.section>
        )}
      </main>
    </div>
  );
}

export default SessionDetail;
