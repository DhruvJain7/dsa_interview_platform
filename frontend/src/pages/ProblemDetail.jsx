import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL = "/api";

function ProblemDetail() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const response = await fetch(
          `${API_BASE_URL}/problems/${problemId}`
        );

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }

        const data = await response.json();
        setProblem(data);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  /* ---------------------------------------------
     Loading
  --------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#222222]">
        <Navbar />

        <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-28 sm:px-8 md:px-12 lg:px-16">
          <p className="text-sm text-black/50 dark:text-white/50">
            Loading problem...
          </p>
        </main>

        <Footer variant="minimal" />
      </div>
    );
  }

  /* ---------------------------------------------
     Not Found
  --------------------------------------------- */

  if (notFound || !problem) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#222222]">
        <Navbar />

        <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-28 sm:px-8 md:px-12 lg:px-16">
          <p className="text-sm text-black/50 dark:text-white/50">
            Problem not found.
          </p>

          <button
            onClick={() => navigate("/problems")}
            className="mt-5 text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
          >
            ← Back to Problems
          </button>
        </main>

        <Footer variant="minimal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#222222]">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-28 sm:px-8 md:px-12 lg:px-16">
        {/* ---------------------------------------------
            Back
        --------------------------------------------- */}

        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate("/problems")}
          className="group mb-10 text-sm text-black/45 transition-colors hover:text-indigo-500 dark:text-white/45 dark:hover:text-indigo-300"
        >
          <span className="mr-2 inline-block transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          Back to Problems
        </motion.button>

        {/* ---------------------------------------------
            Header
        --------------------------------------------- */}

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="border-b border-black/10 pb-9 dark:border-white/10"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
                {problem.topic}
              </p>

              <h1 className="mt-3 max-w-4xl font-display text-3xl leading-[1.08] tracking-[-0.03em] text-black dark:text-[#F5F5F5] sm:text-4xl md:text-5xl">
                {problem.title}
              </h1>
            </div>

            <span
              className={`shrink-0 text-xs font-medium uppercase tracking-[0.18em] ${
                problem.difficulty === "easy"
                  ? "text-black/45 dark:text-white/45"
                  : problem.difficulty === "medium"
                  ? "text-black/60 dark:text-white/60"
                  : "text-black dark:text-white"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        </motion.header>

        {/* ---------------------------------------------
            Problem Description
        --------------------------------------------- */}

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="border-b border-black/10 py-10 dark:border-white/10 sm:py-11"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/35 dark:text-white/30">
            Problem
          </p>

          <p className="mt-4 max-w-4xl text-[15px] leading-7 text-black/65 dark:text-white/65 sm:text-base sm:leading-8">
            {problem.description}
          </p>
        </motion.section>

        {/* ---------------------------------------------
            Examples
        --------------------------------------------- */}

        {problem.examples?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-b border-black/10 py-10 dark:border-white/10 sm:py-11"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/35 dark:text-white/30">
              Examples
            </p>

            <div className="mt-6 space-y-3">
              {problem.examples.map((example, index) => (
                <div
                  key={index}
                  className="border border-black/10 bg-[#fafaf8] p-5 dark:border-white/10 dark:bg-white/[0.025] sm:p-6"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/35">
                    Example {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-black/40 dark:text-white/35">
                        Input
                      </p>

                      <p className="mt-2 break-words font-mono text-sm text-black/75 dark:text-white/70">
                        {example.input}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-black/40 dark:text-white/35">
                        Output
                      </p>

                      <p className="mt-2 break-words font-mono text-sm text-black/75 dark:text-white/70">
                        {example.output}
                      </p>
                    </div>
                  </div>

                  {example.explanation && (
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-black/55 dark:text-white/50">
                      {example.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ---------------------------------------------
            Constraints
        --------------------------------------------- */}

        {problem.constraints?.filter(
          (constraint) =>
            !/^Constraint \d+$/i.test(constraint.trim())
        ).length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-b border-black/10 py-10 dark:border-white/10 sm:py-11"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/35 dark:text-white/30">
              Constraints
            </p>

            <ul className="mt-5 max-w-3xl space-y-2.5">
              {problem.constraints
                .filter(
                  (constraint) =>
                    !/^Constraint \d+$/i.test(
                      constraint.trim()
                    )
                )
                .map((constraint, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-6 text-black/60 dark:text-white/55"
                  >
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-black/30 dark:bg-white/30" />

                    <span>{constraint}</span>
                  </li>
                ))}
            </ul>
          </motion.section>
        )}

        {/* ---------------------------------------------
            Tags
        --------------------------------------------- */}

        {problem.tags?.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.24,
            }}
            className="border-b border-black/10 py-8 dark:border-white/10"
          >
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-black/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-black/45 transition-colors hover:border-indigo-500/40 hover:text-indigo-500 dark:border-white/10 dark:text-white/40 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* ---------------------------------------------
            Before You Code
        --------------------------------------------- */}

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.28,
          }}
          className="py-14 sm:py-16"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
            Before you code
          </p>

          <h2 className="mt-3 max-w-2xl font-display text-2xl leading-tight tracking-[-0.025em] text-black dark:text-[#F5F5F5] sm:text-3xl">
            Think first. Then articulate.
          </h2>

          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-black/55 dark:text-white/50 sm:text-base">
            Explain how you would approach this problem. Focus on
            your reasoning, edge cases, and complexity before writing
            the solution.
          </p>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              navigate(`/problems/${problem.id}/practice`)
            }
            className="mt-7 inline-flex items-center gap-3 bg-black px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 dark:bg-white dark:text-black dark:hover:bg-indigo-300"
          >
            Start Practice

            <span>→</span>
          </motion.button>
        </motion.section>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}

export default ProblemDetail;