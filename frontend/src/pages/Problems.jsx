import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Problems({ onNavigate, onSelectProblem }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/problems")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }

        return response.json();
      })
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f3f1] p-5">
      <div className="min-h-[calc(100vh-2.5rem)] bg-white">

        {/* Header */}
        <Navbar
          activePage="problems"
          onNavigate={onNavigate}
        />

        {/* Content */}
        <main className="mx-auto max-w-[1200px] px-8 pb-20 pt-24">

          <div className="mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Practice
            </p>

            <h1 className="mt-4 font-display text-5xl tracking-tight md:text-6xl">
              Choose a problem.
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-gray-600">
              Pick a problem and practice explaining your solution,
              not just writing it.
            </p>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading problems...</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {problems.map((problem, index) => (
                <button
                  key={problem.id}
                  onClick={() => onSelectProblem(problem)}
                  className="group border border-black/15 bg-[#fafaf8] p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-black/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-xs uppercase tracking-wider text-gray-500">
                      {problem.difficulty}
                    </span>
                  </div>

                  <h2 className="mt-8 font-display text-2xl">
                    {problem.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {problem.description}
                  </p>

                  <div className="mt-6 text-xs uppercase tracking-[0.15em] text-gray-400">
                    {problem.topic}
                  </div>

                  <div className="mt-6 text-sm opacity-0 transition-opacity group-hover:opacity-100">
                    Practice →
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Problems;
