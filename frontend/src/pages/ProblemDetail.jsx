import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
          `http://127.0.0.1:8000/problems/${problemId}`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#222222]">
        <Navbar />

        <main className="mx-auto max-w-[1350px] px-6 pb-24 pt-32 md:px-16">
          <p className="text-sm text-black/50 dark:text-white/50">
            Loading problem...
          </p>
        </main>

        <Footer variant="minimal" />
      </div>
    );
  }

  if (notFound || !problem) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#222222]">
        <Navbar />

        <main className="mx-auto max-w-[1350px] px-6 pb-24 pt-32 md:px-16">
          <p className="text-sm text-black/50 dark:text-white/50">
            Problem not found.
          </p>

          <button
            onClick={() => navigate("/problems")}
            className="mt-6 text-sm font-medium text-black transition-opacity hover:opacity-50 dark:text-white"
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

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-32 md:px-16">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate("/problems")}
          className="group mb-12 text-sm text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
        >
          <span className="mr-2 inline-block transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          Back to Problems
        </motion.button>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="border-b border-black/10 pb-10 dark:border-white/10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/35">
                {problem.topic}
              </p>

              <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] tracking-[-0.035em] text-black dark:text-[#F5F5F5] md:text-6xl">
                {problem.title}
              </h1>
            </div>

            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-black/50 dark:text-white/45">
              {problem.difficulty}
            </span>
          </div>
        </motion.header>

        {/* Problem */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="border-b border-black/10 py-12 dark:border-white/10"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/35 dark:text-white/30">
            Problem
          </p>

          <p className="mt-5 max-w-4xl text-base leading-8 text-black/65 dark:text-white/65 md:text-lg">
            {problem.description}
          </p>
        </motion.section>

        {/* Examples */}
        {problem.examples?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-b border-black/10 py-12 dark:border-white/10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/35 dark:text-white/30">
              Examples
            </p>

            <div className="mt-7 space-y-4">
              {problem.examples.map((example, index) => (
                <div
                  key={index}
                  className="border border-black/10 bg-[#fafaf8] p-6 dark:border-white/10 dark:bg-white/[0.025]"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/35">
                    Example {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/40 dark:text-white/35">
                        Input
                      </p>

                      <p className="mt-2 font-mono text-sm text-black/75 dark:text-white/70">
                        {example.input}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/40 dark:text-white/35">
                        Output
                      </p>

                      <p className="mt-2 font-mono text-sm text-black/75 dark:text-white/70">
                        {example.output}
                      </p>
                    </div>
                  </div>

                  {example.explanation && (
                    <p className="mt-5 max-w-3xl text-sm leading-7 text-black/55 dark:text-white/50">
                      {example.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Constraints */}
        {problem.constraints?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-b border-black/10 py-12 dark:border-white/10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/35 dark:text-white/30">
              Constraints
            </p>

            <ul className="mt-6 max-w-3xl space-y-3">
              {problem.constraints.map((constraint, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm leading-7 text-black/60 dark:text-white/55"
                >
                  <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-black/30 dark:bg-white/30" />
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Tags */}
        {problem.tags?.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="border-b border-black/10 py-10 dark:border-white/10"
          >
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-black/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-black/45 dark:border-white/10 dark:text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Before you code */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.28,
          }}
          className="py-16"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/35 dark:text-white/30">
            Before you code
          </p>

          <h2 className="mt-4 max-w-2xl font-display text-3xl tracking-[-0.025em] text-black dark:text-[#F5F5F5] md:text-4xl">
            Think first. Then articulate.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/55 dark:text-white/50">
            Explain how you would approach this problem. Focus on your
            reasoning, edge cases, and complexity before writing the solution.
          </p>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              navigate(`/problems/${problem.id}/practice`)
            }
            className="mt-8 inline-flex items-center gap-3 bg-black px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
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
