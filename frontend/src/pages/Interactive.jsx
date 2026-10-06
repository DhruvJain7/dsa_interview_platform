import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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

function formatProblemTitle(problemId = "") {
  if (!problemId) {
    return "Practice Problem";
  }

  return problemId
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function Interactive() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [adaptiveSession, setAdaptiveSession] =
    useState(null);
  const [adaptiveSessions, setAdaptiveSessions] =
    useState([]);
  const [loadingSessions, setLoadingSessions] =
    useState(true);
  const [error, setError] = useState("");

  /*
   * ============================================================
   * DELETE ADAPTIVE SESSION STATE
   * ============================================================
   */

  const [deleteSessionId, setDeleteSessionId] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  /*
   * ============================================================
   * LOAD EXISTING ADAPTIVE SESSIONS
   * ============================================================
   */

  useEffect(() => {
    const loadAdaptiveSessions = async () => {
      const token = localStorage.getItem(
        "articula_access_token"
      );

      if (!token) {
        setLoadingSessions(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/interactive/sessions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              "Failed to load adaptive sessions"
          );
        }

        setAdaptiveSessions(data.sessions || []);
      } catch (error) {
        console.error(
          "Failed to load adaptive sessions:",
          error
        );
      } finally {
        setLoadingSessions(false);
      }
    };

    loadAdaptiveSessions();
  }, []);

  /*
   * ============================================================
   * START ADAPTIVE PRACTICE
   * ============================================================
   */

  const startInteractivePractice = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem(
        "articula_access_token"
      );

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to start interactive practice"
        );
      }

      setAdaptiveSession(data);

      /*
       * Add the newly created session to the
       * existing session history immediately.
       */
      setAdaptiveSessions((previousSessions) => {
        const alreadyExists = previousSessions.some(
          (session) =>
            session.adaptive_session_id ===
            data.adaptive_session_id
        );

        if (alreadyExists) {
          return previousSessions;
        }

        return [data, ...previousSessions];
      });
    } catch (error) {
      console.error(
        "Failed to start adaptive practice:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while starting adaptive practice."
      );
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
    if (
      !adaptiveSession?.current_problem_id ||
      !adaptiveSession?.adaptive_session_id
    ) {
      return;
    }

    navigate(
      `/problems/${adaptiveSession.current_problem_id}/practice?adaptive_session=${adaptiveSession.adaptive_session_id}`
    );
  };

  /*
   * ============================================================
   * VIEW CURRENT ADAPTIVE SESSION
   * ============================================================
   */

  const handleViewJourney = () => {
    if (!adaptiveSession?.adaptive_session_id) {
      return;
    }

    navigate(
      `/interactive/session/${adaptiveSession.adaptive_session_id}`
    );
  };

  /*
   * ============================================================
   * VIEW EXISTING ADAPTIVE SESSION
   * ============================================================
   */

  const handleViewExistingJourney = (
    adaptiveSessionId
  ) => {
    if (!adaptiveSessionId) {
      return;
    }

    navigate(
      `/interactive/session/${adaptiveSessionId}`
    );
  };

  /*
   * ============================================================
   * DELETE ADAPTIVE SESSION
   * ============================================================
   */

  const handleDeleteAdaptiveSession = async () => {
    if (!deleteSessionId) {
      return;
    }

    const token = localStorage.getItem(
      "articula_access_token"
    );

    if (!token) {
      setError(
        "Please log in to delete this session."
      );
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/interactive/session/${deleteSessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to delete adaptive session"
        );
      }

      /*
       * Remove the deleted adaptive session
       * from the visible history immediately.
       */
      setAdaptiveSessions((currentSessions) =>
        currentSessions.filter(
          (session) =>
            session.adaptive_session_id !==
            deleteSessionId
        )
      );

      /*
       * If the deleted session is currently selected,
       * clear the selected session.
       */
      if (
        adaptiveSession?.adaptive_session_id ===
        deleteSessionId
      ) {
        setAdaptiveSession(null);
      }

      /*
       * Close the confirmation modal.
       */
      setDeleteSessionId(null);
    } catch (error) {
      console.error(
        "Failed to delete adaptive session:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while deleting the adaptive session."
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
   * ============================================================
   * SHARED DATA
   * ============================================================
   */

  const hasSession =
    Boolean(adaptiveSession);

  const currentProblem =
    adaptiveSession?.current_problem_id
      ? formatProblemTitle(
          adaptiveSession.current_problem_id
        )
      : "";

  const currentDifficulty =
    adaptiveSession?.current_difficulty
      ? adaptiveSession.current_difficulty
      : "";

  const currentGoal =
    adaptiveSession?.current_goal ||
    "Articula will determine your practice focus from your performance.";

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
            Solve a problem, explain your reasoning,
            and get better at articulating your
            solutions. Articula adapts your practice
            based on how you learn.
          </p>
        </motion.section>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <motion.div
            {...fadeUp}
            transition={{
              ...transition,
              delay: 0.05,
            }}
            className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.03] p-4"
          >
            <p className="text-sm text-red-500">
              {error}
            </p>
          </motion.div>
        )}

        {/* =====================================================
            STATE 1 — NO CURRENT SESSION
        ====================================================== */}

        {!hasSession && (
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
                  Articula looks at how you understand
                  problems, build solutions, explain
                  your reasoning, and communicate
                  complexity. Your next practice adapts
                  based on that progress.
                </p>

                {/* Learning loop */}

                <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-4">
                  {[
                    [
                      "01",
                      "Solve",
                      "Work through the problem.",
                    ],
                    [
                      "02",
                      "Explain",
                      "Articulate your reasoning.",
                    ],
                    [
                      "03",
                      "Analyze",
                      "Understand your strengths.",
                    ],
                    [
                      "04",
                      "Adapt",
                      "Practice what needs work.",
                    ],
                  ].map(
                    ([
                      number,
                      title,
                      description,
                    ]) => (
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
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    startInteractivePractice
                  }
                  disabled={loading}
                  className="mt-9 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                >
                  {loading
                    ? "Preparing your practice..."
                    : "Start adaptive practice →"}
                </button>
              </div>
            </div>

            {/* =================================================
                ADAPTIVE SESSION HISTORY
            ================================================== */}

            <div className="mt-14">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                Adaptive Sessions
              </p>

              {loadingSessions ? (
                <div className="mt-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
                  <p className="text-sm text-black/45 dark:text-white/45">
                    Loading your adaptive sessions...
                  </p>
                </div>
              ) : adaptiveSessions.length === 0 ? (
                <div className="mt-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
                  <p className="text-sm font-medium">
                    No adaptive sessions yet.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-black/45 dark:text-white/45">
                    Start adaptive practice to create
                    your first learning journey.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {adaptiveSessions.map(
                    (session) => {
                      const isCompleted =
                        session.next_action ===
                          "session_completed" ||
                        session.status ===
                          "completed";

                      return (
                        <div
                          key={
                            session.adaptive_session_id
                          }
                          className="group rounded-xl border border-black/10 p-5 transition hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.02]"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <button
                              type="button"
                              onClick={() =>
                                handleViewExistingJourney(
                                  session.adaptive_session_id
                                )
                              }
                              className="min-w-0 flex-1 text-left"
                            >
                              <p className="text-sm font-medium">
                                {formatProblemTitle(
                                  session.current_problem_id
                                )}
                              </p>

                              <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                                {session.current_difficulty
                                  ? `${session.current_difficulty} · `
                                  : ""}
                                {isCompleted
                                  ? "Completed"
                                  : "In Progress"}
                              </p>

                              {session.current_goal && (
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 dark:text-white/50">
                                  {session.current_goal}
                                </p>
                              )}
                            </button>

                            <div className="flex shrink-0 items-center gap-4">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  setDeleteSessionId(
                                    session.adaptive_session_id
                                  );
                                }}
                                disabled={deleting}
                                className="rounded-md px-2 py-1 text-xs text-gray-400 opacity-0 transition-opacity hover:text-black group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500 dark:hover:text-white"
                              >
                                Delete
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewExistingJourney(
                                    session.adaptive_session_id
                                  )
                                }
                                className="text-gray-400 transition-transform hover:translate-x-1 dark:text-gray-500"
                                aria-label="View learning journey"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* =====================================================
            STATE 2 — SESSION READY
        ====================================================== */}

        {hasSession && (
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
                  {currentGoal}
                </h2>

                <p className="mt-4 text-sm leading-7 text-black/50 dark:text-white/50">
                  Articula has analyzed your current
                  profile and selected the next practice
                  problem around your current learning
                  goal.
                </p>
              </div>

              {/* =================================================
                  NEXT PRACTICE
              ================================================== */}

              <div className="mt-9 rounded-xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                      Your next practice
                    </p>

                    <h3 className="mt-3 text-2xl font-medium">
                      {currentProblem}
                    </h3>

                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/35 dark:text-white/35">
                      {currentDifficulty}
                    </p>
                  </div>

                  <div className="sm:max-w-sm">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                      Practice focus
                    </p>

                    <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
                      {currentGoal}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleStartPractice
                  }
                  disabled={
                    !adaptiveSession?.current_problem_id
                  }
                  className="mt-8 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                >
                  Start Practice →
                </button>
              </div>

              {/* =================================================
                  SESSION DETAILS
              ================================================== */}

              <div className="mt-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                      Adaptive session
                    </p>

                    <p className="mt-2 text-xs text-black/35 dark:text-white/35">
                      {
                        adaptiveSession.adaptive_session_id
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleViewJourney
                    }
                    className="self-start rounded-md border border-black/10 px-4 py-2 text-xs font-medium transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 sm:self-auto"
                  >
                    View Learning Journey →
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================
                ADAPTIVE SESSION HISTORY
            ================================================== */}

            <div className="mt-14">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                Adaptive Sessions
              </p>

              {loadingSessions ? (
                <div className="mt-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
                  <p className="text-sm text-black/45 dark:text-white/45">
                    Loading your adaptive sessions...
                  </p>
                </div>
              ) : adaptiveSessions.length === 0 ? (
                <div className="mt-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
                  <p className="text-sm font-medium">
                    No adaptive sessions yet.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-black/45 dark:text-white/45">
                    Start adaptive practice to create
                    your first learning journey.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {adaptiveSessions.map(
                    (session) => {
                      const isCompleted =
                        session.next_action ===
                          "session_completed" ||
                        session.status ===
                          "completed";

                      return (
                        <div
                          key={
                            session.adaptive_session_id
                          }
                          className="group rounded-xl border border-black/10 p-5 transition hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.02]"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <button
                              type="button"
                              onClick={() =>
                                handleViewExistingJourney(
                                  session.adaptive_session_id
                                )
                              }
                              className="min-w-0 flex-1 text-left"
                            >
                              <p className="text-sm font-medium">
                                {formatProblemTitle(
                                  session.current_problem_id
                                )}
                              </p>

                              <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                                {session.current_difficulty
                                  ? `${session.current_difficulty} · `
                                  : ""}
                                {isCompleted
                                  ? "Completed"
                                  : "In Progress"}
                              </p>

                              {session.current_goal && (
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 dark:text-white/50">
                                  {session.current_goal}
                                </p>
                              )}
                            </button>

                            <div className="flex shrink-0 items-center gap-4">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  setDeleteSessionId(
                                    session.adaptive_session_id
                                  );
                                }}
                                disabled={deleting}
                                className="rounded-md px-2 py-1 text-xs text-gray-400 opacity-0 transition-opacity hover:text-black group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500 dark:hover:text-white"
                              >
                                Delete
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewExistingJourney(
                                    session.adaptive_session_id
                                  )
                                }
                                className="text-gray-400 transition-transform hover:translate-x-1 dark:text-gray-500"
                                aria-label="View learning journey"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                WHAT HAPPENS NEXT
            ================================================== */}

            <div className="mt-14">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                How adaptive practice works
              </p>

              <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-3">
                {[
                  [
                    "01",
                    "Practice",
                    "Solve the selected problem and explain your reasoning.",
                  ],
                  [
                    "02",
                    "Evaluate",
                    "Your solution is evaluated across five dimensions.",
                  ],
                  [
                    "03",
                    "Adapt",
                    "Articula uses the result to decide what you should practice next.",
                  ],
                ].map(
                  ([
                    number,
                    title,
                    description,
                  ]) => (
                    <div
                      key={title}
                      className="bg-white p-6 dark:bg-[#292929]"
                    >
                      <p className="text-[10px] tracking-[0.16em] text-black/30 dark:text-white/30">
                        {number}
                      </p>

                      <p className="mt-4 text-sm font-medium">
                        {title}
                      </p>

                      <p className="mt-2 text-xs leading-6 text-black/45 dark:text-white/45">
                        {description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.section>
        )}
      </main>

      <Footer variant="minimal" />

      {/* =======================================================
          DELETE CONFIRMATION MODAL
      ======================================================== */}

      {deleteSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-[#3a3a3a] dark:bg-[#222222]">
            <h2 className="font-serif text-xl font-medium">
              Delete this session?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              This will permanently remove this
              adaptive learning journey and its
              session history.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteSessionId(null)
                }
                disabled={deleting}
                className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-[#333333]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteAdaptiveSession
                }
                disabled={deleting}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interactive;
