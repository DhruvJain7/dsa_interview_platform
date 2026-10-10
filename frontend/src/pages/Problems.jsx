import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL = "/api";

function Problems() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();

    if (topic) {
      params.append("topic", topic);
    }

    if (difficulty) {
      params.append("difficulty", difficulty);
    }

    const query = params.toString();

    setLoading(true);

    fetch(
      `${API_BASE_URL}/problems${query ? `?${query}` : ""}`
    )
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
        setProblems([]);
        setLoading(false);
      });
  }, [topic, difficulty]);

  const rowVariants = {
    hidden: {
      opacity: 0,
      y: 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#222222]">
      <div className="relative min-h-screen bg-white dark:bg-[#222222]">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="mx-auto max-w-[1350px] px-6 pb-24 pt-28 sm:px-8 md:px-12 lg:px-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-9 max-w-[650px]"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
              Practice
            </p>

            <h1 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] text-black dark:text-[#F5F5F5] sm:text-4xl">
              Choose a problem.
            </h1>

            <p className="mt-4 max-w-[600px] text-sm leading-7 text-black/55 dark:text-white/50 sm:text-base">
              Pick a problem and practice explaining your solution,
              not just writing it.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-10 flex flex-col gap-3 border-y border-black/10 py-5 dark:border-white/10 sm:flex-row sm:items-center"
          >
            {/* Topic */}
            <div className="relative w-full sm:w-auto">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full appearance-none rounded-full border bg-white px-5 py-3 pr-11 text-sm outline-none transition-all duration-200 dark:bg-[#222222] sm:w-auto ${
                  topic
                    ? "border-indigo-500/60 text-indigo-600 dark:border-indigo-400/60 dark:text-indigo-300"
                    : "border-black/15 text-black hover:border-black/30 focus:border-indigo-500/60 dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:focus:border-indigo-400/60"
                }`}
              >
                <option value="">All Topics</option>
                <option value="arrays">Arrays</option>
                <option value="strings">Strings</option>
                <option value="linked-lists">Linked Lists</option>
                <option value="trees">Trees</option>
                <option value="graphs">Graphs</option>
                <option value="dynamic-programming">
                  Dynamic Programming
                </option>
                <option value="stacks">Stacks</option>
                <option value="heaps">Heaps</option>
              </select>

              <span
                className={`pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs ${
                  topic
                    ? "text-indigo-500 dark:text-indigo-300"
                    : "text-black/40 dark:text-white/40"
                }`}
              >
                ↓
              </span>
            </div>

            {/* Difficulty */}
            <div className="relative w-full sm:w-auto">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={`w-full appearance-none rounded-full border bg-white px-5 py-3 pr-11 text-sm outline-none transition-all duration-200 dark:bg-[#222222] sm:w-auto ${
                  difficulty
                    ? "border-indigo-500/60 text-indigo-600 dark:border-indigo-400/60 dark:text-indigo-300"
                    : "border-black/15 text-black hover:border-black/30 focus:border-indigo-500/60 dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:focus:border-indigo-400/60"
                }`}
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <span
                className={`pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs ${
                  difficulty
                    ? "text-indigo-500 dark:text-indigo-300"
                    : "text-black/40 dark:text-white/40"
                }`}
              >
                ↓
              </span>
            </div>

            {/* Clear Filters */}
            {(topic || difficulty) && (
              <button
                onClick={() => {
                  setTopic("");
                  setDifficulty("");
                }}
                className="w-fit px-2 py-2 text-xs font-medium uppercase tracking-[0.14em] text-black/40 transition-colors hover:text-indigo-500 dark:text-white/35 dark:hover:text-indigo-300"
              >
                Clear filters
              </button>
            )}
          </motion.div>

          {/* Loading */}
          {loading ? (
            <div className="border-t border-black/10 py-20 text-center dark:border-white/10">
              <motion.p
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-sm text-black/40 dark:text-white/40"
              >
                Loading problems...
              </motion.p>
            </div>
          ) : problems.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-y border-black/10 py-20 text-center dark:border-white/10"
            >
              <p className="font-display text-2xl text-black dark:text-white">
                No problems found.
              </p>

              <p className="mt-3 text-sm text-black/50 dark:text-white/40">
                Try changing your filters.
              </p>

              {(topic || difficulty) && (
                <button
                  onClick={() => {
                    setTopic("");
                    setDifficulty("");
                  }}
                  className="mt-5 text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            /* Problem List */
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.06,
                  },
                },
              }}
              className="border-t border-black/10 dark:border-white/10"
            >
              {problems.map((problem, index) => (
                <motion.button
                  key={problem.id}
                  variants={rowVariants}
                  onClick={() =>
                    navigate(`/problems/${problem.id}`)
                  }
                  whileHover={{
                    x: 4,
                    transition: {
                      duration: 0.2,
                      ease: "easeOut",
                    },
                  }}
                  whileTap={{
                    scale: 0.995,
                  }}
                  className="group relative flex w-full items-center gap-4 border-b border-black/10 py-6 text-left transition-colors duration-200 hover:bg-black/[0.018] dark:border-white/10 dark:hover:bg-white/[0.018] sm:gap-5 md:gap-8 md:py-7"
                >
                  {/* Number */}
                  <span className="w-7 shrink-0 text-xs font-medium tracking-[0.15em] text-black/30 transition-colors duration-200 group-hover:text-indigo-500 dark:text-white/30 dark:group-hover:text-indigo-300 sm:w-8 md:w-10">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Problem Information */}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl leading-tight tracking-[-0.02em] text-black transition-colors duration-200 group-hover:text-black/65 dark:text-[#F5F5F5] dark:group-hover:text-white/70 md:text-2xl">
                      {problem.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium uppercase tracking-[0.16em] text-black/35 dark:text-white/30">
                      <span>{problem.topic}</span>

                      <span className="h-1 w-1 rounded-full bg-black/20 dark:bg-white/20" />

                      <span className="md:hidden">
                        {problem.difficulty}
                      </span>
                    </div>

                    <p className="mt-3 hidden max-w-[700px] truncate text-sm text-black/45 dark:text-white/40 md:block">
                      {problem.description}
                    </p>
                  </div>

                  {/* Difficulty */}
                  <span
                    className={`hidden shrink-0 text-xs font-medium uppercase tracking-[0.15em] md:block ${
                      problem.difficulty === "easy"
                        ? "text-black/45 dark:text-white/45"
                        : problem.difficulty === "medium"
                        ? "text-black/60 dark:text-white/60"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                  {/* Practice */}
                  <div className="flex w-8 shrink-0 items-center justify-end gap-2 text-sm font-medium text-transparent transition-colors duration-200 sm:w-24 dark:text-transparent">
                    <span className="hidden sm:inline group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
                      Practice
                    </span>

                    <span className="translate-x-[-6px] text-lg opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-indigo-500 group-hover:opacity-100 dark:group-hover:text-indigo-300">
                      →
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <Footer
          onNavigate={undefined}
          variant="minimal"
        />
      </div>
    </div>
  );
}

export default Problems;