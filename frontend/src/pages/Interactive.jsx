import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Interactive() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [adaptiveSession, setAdaptiveSession] = useState(null);
  const [error, setError] = useState("");

  const startInteractivePractice = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("articula_access_token");

      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/interactive/session",
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">
        <section className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Interactive
          </p>

          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">
            Adaptive practice.
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Articula adapts your practice based on how you
            solve problems, explain your reasoning, and
            articulate your approach.
          </p>

          {!adaptiveSession && (
            <button
              onClick={startInteractivePractice}
              disabled={loading}
              className="mt-8 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {loading
                ? "Creating your session..."
                : "Start interactive practice"}
            </button>
          )}

          {error && (
            <p className="mt-6 text-sm text-red-500">
              {error}
            </p>
          )}

          {adaptiveSession && (
            <div className="mt-10 rounded-xl border border-gray-200 p-6 dark:border-[#3a3a3a]">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Your next problem
              </p>

              <h2 className="mt-3 text-2xl font-medium">
                {adaptiveSession.current_problem_id}
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {adaptiveSession.current_difficulty}
              </p>

              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Current goal
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {adaptiveSession.current_goal}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/problems/${adaptiveSession.current_problem_id}/practice?adaptive_session=${adaptiveSession.adaptive_session_id}`
                  )
                }
                className="mt-6 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
              >
                Start Problem
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}

export default Interactive;
