import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

const API_BASE_URL = "http://127.0.0.1:8000";

function Dashboard() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("articula_access_token");

  const getToken = () => {
    return localStorage.getItem("articula_access_token");
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchSessions = async () => {
      const token = getToken();

      try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to fetch session history"
          );
        }

        setSessions(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  // Protect dashboard
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  const getTestSummary = (session) => {
    const results = session.execution_result?.results || [];

    if (!results.length) {
      return "No execution data";
    }

    const passed = results.filter(
      (result) => result.passed
    ).length;

    return `${passed}/${results.length} tests passed`;
  };

  const getOverallScore = (session) => {
    const evaluation = session.evaluation;

    if (!evaluation) {
      return null;
    }

    const dimensions = [
      evaluation.problem_understanding,
      evaluation.approach,
      evaluation.complexity,
      evaluation.clarity_and_articulation,
      evaluation.optimization,
    ];

    const scores = dimensions
      .map((dimension) => dimension?.score)
      .filter((score) => typeof score === "number");

    if (!scores.length) {
      return null;
    }

    const average =
      scores.reduce((sum, score) => sum + score, 0) /
      scores.length;

    return average.toFixed(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    return new Date(dateString).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">

        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
            Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Your sessions.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-black/50 dark:text-white/50">
            Review your previous solutions, execution results,
            and articulation evaluations.
          </p>
        </div>

        {/* History */}
        <section className="mt-12">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-black/40 dark:text-white/40">
                History
              </p>

              <h2 className="mt-2 text-xl font-medium">
                Recent sessions
              </h2>
            </div>

            <span className="text-sm text-black/40 dark:text-white/40">
              {sessions.length}{" "}
              {sessions.length === 1 ? "session" : "sessions"}
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-6 border border-black/10 bg-black/[0.03] px-5 py-8 dark:border-white/10 dark:bg-[#181818]">
              <p className="text-sm text-black/50 dark:text-white/50">
                Loading your sessions...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mt-6 border border-black/10 bg-black/[0.03] px-5 py-8 dark:border-white/10 dark:bg-[#181818]">
              <p className="text-sm text-black/60 dark:text-white/60">
                {error}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && sessions.length === 0 && (
            <div className="mt-6 border border-black/10 bg-black/[0.03] px-5 py-10 dark:border-white/10 dark:bg-[#181818]">
              <p className="text-sm text-black/50 dark:text-white/50">
                You haven't completed any sessions yet.
              </p>

              <button
                onClick={() => navigate("/problems")}
                className="mt-5 border border-black bg-black px-5 py-2 text-sm text-white transition-opacity hover:opacity-80 dark:border-white dark:bg-white dark:text-black"
              >
                Start Practicing →
              </button>
            </div>
          )}

          {/* Sessions */}
          {!loading && !error && sessions.length > 0 && (
            <div className="mt-6 space-y-3">

              {sessions.map((session) => {
                const score = getOverallScore(session);

                return (
                  <button
                    key={session.session_id}
                    onClick={() =>
                      navigate(
                        `/sessions/${session.session_id}`
                      )
                    }
                    className="group w-full border border-black/10 bg-black/[0.03] px-5 py-5 text-left transition-colors hover:border-black/20 hover:bg-black/[0.05] dark:border-white/10 dark:bg-[#181818] dark:hover:border-white/20 dark:hover:bg-[#1d1d1d]"
                  >

                    <div className="flex items-start justify-between gap-6">

                      <div className="min-w-0">

                        <div className="flex items-center gap-3">
                          <h3 className="truncate text-base font-medium">
                            {session.problem_id
                              ?.replaceAll("_", " ")
                              .replace(/\b\w/g, (char) =>
                                char.toUpperCase()
                              )}
                          </h3>

                          <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-black/40 dark:text-white/40">
                            {session.language}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/40 dark:text-white/40">
                          <span>
                            {getTestSummary(session)}
                          </span>

                          <span>
                            {formatDate(session.updated_at)}
                          </span>
                        </div>

                      </div>

                      <div className="flex shrink-0 items-center gap-5">

                        {score && (
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.12em] text-black/30 dark:text-white/30">
                              Score
                            </p>

                            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
                              {score}/5
                            </p>
                          </div>
                        )}

                        <span className="text-black/30 transition-transform group-hover:translate-x-1 dark:text-white/30">
                          →
                        </span>

                      </div>

                    </div>

                    <div className="mt-4 border-t border-black/5 pt-3 dark:border-white/5">
                      <span className="text-xs uppercase tracking-[0.12em] text-black/30 dark:text-white/30">
                        {session.status}
                      </span>
                    </div>

                  </button>
                );
              })}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
