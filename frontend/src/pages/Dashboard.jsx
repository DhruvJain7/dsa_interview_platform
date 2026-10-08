import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL = "http://127.0.0.1:8000";

/* =========================================================
   CONSTANTS
========================================================= */

const SKILL_KEYS = [
  {
    key: "problem_understanding",
    label: "Problem Understanding",
    shortLabel: "Understanding",
  },
  {
    key: "approach",
    label: "Approach / Logic",
    shortLabel: "Approach",
  },
  {
    key: "complexity",
    label: "Complexity",
    shortLabel: "Complexity",
  },
  {
    key: "clarity_and_articulation",
    label: "Clarity & Articulation",
    shortLabel: "Clarity",
  },
  {
    key: "optimization",
    label: "Optimization",
    shortLabel: "Optimization",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getTestSummary(session) {
  const results = session?.execution_result?.results || [];

  if (!results.length) {
    return {
      passed: 0,
      total: 0,
      label: "No execution data",
    };
  }

  const passed = results.filter((test) => test.passed).length;
  const total = results.length;

  return {
    passed,
    total,
    label: `${passed}/${total} tests passed`,
  };
}

function getOverallScore(session) {
  const evaluation = session?.evaluation;

  if (!evaluation) {
    return null;
  }

  const scores = SKILL_KEYS.map(({ key }) => {
    return evaluation[key]?.score;
  }).filter((score) => score != null);

  if (!scores.length) {
    return null;
  }

  return (
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatProblemName(problemId) {
  if (!problemId) {
    return "Untitled Problem";
  }

  return problemId
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSkillScore(session, key) {
  const score = session?.evaluation?.[key]?.score;

  return score != null ? score : null;
}

function getSkillFeedback(session, key) {
  return session?.evaluation?.[key]?.feedback || "";
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteSessionId, setDeleteSessionId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("articula_access_token");

  /* =======================================================
     FETCH SESSIONS
  ======================================================= */

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load sessions.");
        }

        const data = await response.json();

        setSessions(
          Array.isArray(data) ? data : data.sessions || []
        );
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  /* =======================================================
     DELETE SESSION
  ======================================================= */

  const handleDeleteSession = async () => {
    if (!deleteSessionId || deleting) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${deleteSessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.detail || "Failed to delete session."
        );
      }

      setSessions((currentSessions) =>
        currentSessions.filter(
          (session) =>
            session.session_id !== deleteSessionId
        )
      );

      setDeleteSessionId(null);
    } catch (err) {
      setError(err.message || "Failed to delete session.");
      setDeleteSessionId(null);
    } finally {
      setDeleting(false);
    }
  };

  /* =======================================================
     AUTH REDIRECT
  ======================================================= */

  if (!token && !loading) {
    return <Navigate to="/auth" replace />;
  }

  /* =======================================================
     DASHBOARD METRICS
  ======================================================= */

  const getDashboardMetrics = () => {
    const completedSessions = sessions.filter(
      (session) =>
        session.status === "completed" &&
        session.evaluation
    );

    const scores = completedSessions
      .map((session) => getOverallScore(session))
      .filter((score) => score !== null);

    const averageScore =
      scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) /
          scores.length
        : null;

    let passedTests = 0;
    let totalTests = 0;

    sessions.forEach((session) => {
      const results =
        session.execution_result?.results || [];

      results.forEach((test) => {
        totalTests += 1;

        if (test.passed) {
          passedTests += 1;
        }
      });
    });

    const testPassRate =
      totalTests > 0
        ? Math.round((passedTests / totalTests) * 100)
        : null;

    const uniqueProblems = new Set(
      sessions.map((session) => session.problem_id)
    );

    return {
      sessions: sessions.length,
      averageScore,
      testPassRate,
      problems: uniqueProblems.size,
    };
  };

  const metrics = getDashboardMetrics();

  /* =======================================================
     COMPLETED SCORED SESSIONS
  ======================================================= */

  const completedScoredSessions = sessions
    .filter(
      (session) =>
        session.status === "completed" &&
        getOverallScore(session) !== null
    )
    .slice()
    .reverse();

  /* =======================================================
     SKILL BREAKDOWN
  ======================================================= */

  const getSkillBreakdown = () => {
    return SKILL_KEYS.map((dimension) => {
      const scores = sessions
        .filter(
          (session) =>
            session.status === "completed" &&
            session.evaluation?.[dimension.key]?.score != null
        )
        .map(
          (session) =>
            session.evaluation[dimension.key].score
        );

      const average =
        scores.length > 0
          ? scores.reduce((sum, score) => sum + score, 0) /
            scores.length
          : null;

      return {
        ...dimension,
        score: average,
      };
    });
  };

  const skillBreakdown = getSkillBreakdown();

  /* =======================================================
     FOCUS AREAS
  ======================================================= */

  const focusAreas = skillBreakdown
    .filter((skill) => skill.score !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((skill) => {
      const feedback = sessions
        .filter(
          (session) =>
            session.status === "completed" &&
            session.evaluation?.[skill.key]?.score != null &&
            session.evaluation?.[skill.key]?.feedback
        )
        .sort(
          (a, b) =>
            new Date(b.updated_at || b.created_at) -
            new Date(a.updated_at || a.created_at)
        )
        .map(
          (session) =>
            session.evaluation[skill.key].feedback
        )
        .filter(Boolean);

      return {
        ...skill,
        feedback: feedback[0] || "",
      };
    });

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">

        {/* =================================================
            HEADER
        ================================================== */}

        <section>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Dashboard
          </p>

          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">
            Your progress.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            See how your problem solving and articulation improve
            over time.
          </p>
        </section>

        {/* =================================================
            OVERVIEW METRICS
        ================================================== */}

        <section className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 dark:border-[#3a3a3a] dark:bg-[#3a3a3a] md:grid-cols-4">

          <div className="bg-white p-6 dark:bg-[#222222]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sessions
            </p>

            <p className="mt-2 text-2xl font-medium tracking-tight">
              {metrics.sessions}
            </p>
          </div>

          <div className="bg-white p-6 dark:bg-[#222222]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Avg. Score
            </p>

            <p className="mt-2 text-2xl font-medium tracking-tight">
              {metrics.averageScore !== null
                ? `${metrics.averageScore.toFixed(1)}/5`
                : "—"}
            </p>
          </div>

          <div className="bg-white p-6 dark:bg-[#222222]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Test Pass
            </p>

            <p className="mt-2 text-2xl font-medium tracking-tight">
              {metrics.testPassRate !== null
                ? `${metrics.testPassRate}%`
                : "—"}
            </p>
          </div>

          <div className="bg-white p-6 dark:bg-[#222222]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Problems
            </p>

            <p className="mt-2 text-2xl font-medium tracking-tight">
              {metrics.problems}
            </p>
          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* =================================================
            PERFORMANCE
        ================================================== */}

        <section className="mt-16">

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Performance
            </p>

            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
              Articulation over time
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your overall articulation score across completed
              sessions.
            </p>
          </div>

          {completedScoredSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">

                <svg
                  viewBox="0 0 760 220"
                  className="h-[220px] w-full"
                  role="img"
                  aria-label="Articulation score over time"
                >

                  {/* -----------------------------------------
                      Y AXIS / GRID
                  ------------------------------------------ */}

                  {[1, 2, 3, 4, 5].map((score) => {
                    const y =
                      190 - ((score - 1) / 4) * 150;

                    return (
                      <g key={score}>
                        <line
                          x1="45"
                          x2="735"
                          y1={y}
                          y2={y}
                          stroke="currentColor"
                          strokeOpacity="0.08"
                        />

                        <text
                          x="0"
                          y={y + 4}
                          fontSize="11"
                          fill="currentColor"
                          opacity="0.45"
                        >
                          {score}
                        </text>
                      </g>
                    );
                  })}

                  {/* -----------------------------------------
                      DATA / LINE
                  ------------------------------------------ */}

                  {(() => {
                    const width = 690;
                    const startX = 45;
                    const count =
                      completedScoredSessions.length;

                    const getX = (index) => {
                      if (count === 1) {
                        return startX + width / 2;
                      }

                      return (
                        startX +
                        (index / (count - 1)) * width
                      );
                    };

                    const getY = (score) =>
                      190 - ((score - 1) / 4) * 150;

                    const points =
                      completedScoredSessions.map(
                        (session, index) => {
                          const score =
                            getOverallScore(session);

                          return {
                            x: getX(index),
                            y: getY(score),
                            score,
                            date: formatDate(
                              session.updated_at ||
                                session.created_at
                            ),
                          };
                        }
                      );

                    const path = points
                      .map(
                        (point, index) =>
                          `${index === 0 ? "M" : "L"} ${
                            point.x
                          } ${point.y}`
                      )
                      .join(" ");

                    return (
                      <g>

                        {/* Trend line */}
                        <path
                          d={path}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />

                        {/* Points + scores + dates */}
                        {points.map((point, index) => (
                          <g key={index}>

                            {/* Point */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill="currentColor"
                            />

                            {/* SCORE ABOVE POINT */}
                            <text
                              x={point.x}
                              y={point.y - 12}
                              textAnchor="middle"
                              fontSize="11"
                              fill="currentColor"
                              opacity="0.65"
                            >
                              {point.score.toFixed(1)}
                            </text>

                            {/* DATE BELOW */}
                            <text
                              x={point.x}
                              y="215"
                              textAnchor="middle"
                              fontSize="10"
                              fill="currentColor"
                              opacity="0.4"
                            >
                              {point.date}
                            </text>

                          </g>
                        ))}

                      </g>
                    );
                  })()}

                </svg>

              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 p-8 text-sm text-gray-500 dark:border-[#3a3a3a] dark:text-gray-400">
              Complete an articulation to start tracking your
              progress.
            </div>
          )}

        </section>

        {/* =================================================
            SKILL BREAKDOWN
        ================================================== */}

        <section className="mt-16">

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Skill breakdown
            </p>

            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
              Where you’re strongest.
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Average scores across your completed articulations.
            </p>
          </div>

          <div className="space-y-6">

            {skillBreakdown.map((skill) => {
              const percentage = skill.score
                ? (skill.score / 5) * 100
                : 0;

              return (
                <div key={skill.key}>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-medium">
                      {skill.label}
                    </span>

                    <span className="text-sm tabular-nums text-gray-500 dark:text-gray-400">
                      {skill.score !== null
                        ? `${skill.score.toFixed(1)} / 5`
                        : "—"}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-[#333333]">

                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* =================================================
            FOCUS AREAS
        ================================================== */}

        <section className="mt-16">

          <div className="mb-8">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Focus areas
            </p>

            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
              What to improve next.
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Based on your lowest-scoring articulation skills.
            </p>

          </div>

          {focusAreas.length > 0 ? (
            <div className="grid gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 dark:border-[#3a3a3a] dark:bg-[#3a3a3a] md:grid-cols-2">

              {focusAreas.map((area) => (

                <div
                  key={area.key}
                  className="bg-white p-6 dark:bg-[#222222]"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.14em] text-indigo-500">
                        Focus
                      </p>

                      <h3 className="font-serif text-lg font-medium">
                        {area.label}
                      </h3>
                    </div>

                    <span className="shrink-0 text-sm tabular-nums text-gray-500 dark:text-gray-400">
                      {area.score.toFixed(1)}/5
                    </span>

                  </div>

                  {area.feedback && (
                    <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {area.feedback}
                    </p>
                  )}

                </div>

              ))}

            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 p-8 text-sm text-gray-500 dark:border-[#3a3a3a] dark:text-gray-400">
              Complete an articulation to identify areas for
              improvement.
            </div>
          )}

        </section>

        {/* =================================================
            HISTORY
        ================================================== */}

        <section className="mt-16">

          <div className="mb-8 flex items-end justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                History
              </p>

              <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
                Recent sessions
              </h2>
            </div>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sessions.length}{" "}
              {sessions.length === 1 ? "session" : "sessions"}
            </span>

          </div>

          {loading ? (

            <div className="rounded-xl border border-gray-200 p-8 text-sm text-gray-500 dark:border-[#3a3a3a] dark:text-gray-400">
              Loading sessions...
            </div>

          ) : error ? (

            <div className="rounded-xl border border-gray-200 p-8 text-sm text-gray-500 dark:border-[#3a3a3a] dark:text-gray-400">
              {error}
            </div>

          ) : sessions.length === 0 ? (

            <div className="rounded-xl border border-gray-200 p-8 dark:border-[#3a3a3a]">

              <p className="text-sm text-gray-500 dark:text-gray-400">
                No sessions yet.
              </p>

              <button
                onClick={() => navigate("/problems")}
                className="mt-4 text-sm font-medium text-indigo-500 underline underline-offset-4 transition-colors hover:text-indigo-600"
              >
                Start practicing
              </button>

            </div>

          ) : (

            <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-[#3a3a3a] dark:border-[#3a3a3a]">

              {sessions.map((session) => {

                const testSummary =
                  getTestSummary(session);

                const overallScore =
                  getOverallScore(session);

                return (

                  <div
                    key={session.session_id}
                    className="group flex w-full items-center justify-between gap-6 py-5"
                  >

                    <button
                      onClick={() =>
                        navigate(
                          `/sessions/${session.session_id}`
                        )
                      }
                      className="min-w-0 flex-1 text-left transition-opacity hover:opacity-70"
                    >

                      <div className="flex items-center gap-3">

                        <h3 className="truncate font-serif text-lg font-medium">
                          {formatProblemName(
                            session.problem_id
                          )}
                        </h3>

                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {session.language}
                        </span>

                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">

                        <span>
                          {testSummary.label}
                        </span>

                        <span>•</span>

                        <span>
                          {formatDate(
                            session.updated_at ||
                              session.created_at
                          )}
                        </span>

                      </div>

                    </button>

                    <div className="flex shrink-0 items-center gap-4">

                      {overallScore !== null && (
                        <span className="text-sm tabular-nums text-gray-500 dark:text-gray-400">
                          {overallScore.toFixed(1)}/5
                        </span>
                      )}

                      <span
                        className={`text-xs ${
                          session.status === "completed"
                            ? "text-indigo-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {session.status}
                      </span>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteSessionId(
                            session.session_id
                          );
                        }}
                        className="rounded-md px-2 py-1 text-xs text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-500"
                      >
                        Delete
                      </button>

                      <span className="text-gray-400 dark:text-gray-500">
                        →
                      </span>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      </main>

      <Footer variant="minimal" />

      {/* =================================================
          DELETE CONFIRMATION
      ================================================== */}

      {deleteSessionId && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">

          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-[#3a3a3a] dark:bg-[#222222]">

            <h2 className="font-serif text-xl font-medium">
              Delete this session?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              This will permanently remove the code, transcript,
              execution results, and articulation evaluation.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setDeleteSessionId(null)}
                disabled={deleting}
                className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-[#333333]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteSession}
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

export default Dashboard;