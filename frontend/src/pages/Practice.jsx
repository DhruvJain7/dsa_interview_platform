import { useState } from "react";
import Navbar from "../components/Navbar";

import CodeEditor from "../components/CodeEditor";

function Practice({ problem, onNavigate }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [approach, setApproach] = useState("");
  const [edgeCases, setEdgeCases] = useState("");
  const [complexity, setComplexity] = useState("");

  return (
    <div className="min-h-screen bg-[#f3f3f1] p-5">
      <div className="min-h-[calc(100vh-2.5rem)] bg-white">

        <Navbar
          activePage="problems"
          onNavigate={onNavigate}
        />

        <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">

          <button
            onClick={() => onNavigate("problem-detail")}
            className="mb-10 text-sm text-gray-500 transition-colors hover:text-black"
          >
            ← Back to Problem
          </button>

          {/* Problem header */}
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              {problem.topic}
            </p>

            <div className="mt-4 flex items-start justify-between gap-6">
              <h1 className="font-display text-5xl tracking-tight md:text-6xl">
                {problem.title}
              </h1>

              <span className="mt-2 text-sm uppercase tracking-wider text-gray-500">
                {problem.difficulty}
              </span>
            </div>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
              {problem.description}
            </p>
          </div>
          {/* Code editor */}
          <section className="mt-16">
            <CodeEditor
              problemId={problem.id}
              language={language}
              onLanguageChange={setLanguage}
              value={code}
              onChange={setCode}
            />
          </section>

          {/* Practice questions */}
          <div className="mt-16 border-t border-black/10 pt-10">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Your reasoning
            </p>

            <h2 className="mt-4 font-display text-4xl">
              Explain your approach.
            </h2>

            <p className="mt-4 text-gray-600">
              Think like you're explaining your solution to an interviewer.
            </p>

            <textarea
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="Walk through your approach step by step..."
              className="mt-6 min-h-48 w-full resize-y border border-black/15 bg-[#fafaf8] p-5 text-sm leading-7 outline-none transition-colors focus:border-black/40"
            />

          </div>

          <div className="mt-12 border-t border-black/10 pt-10">

            <h2 className="font-display text-3xl">
              What are the edge cases?
            </h2>

            <p className="mt-3 text-gray-600">
              Think about unusual inputs or situations that could break your
              solution.
            </p>

            <textarea
              value={edgeCases}
              onChange={(e) => setEdgeCases(e.target.value)}
              placeholder="For example: empty input, duplicates, very large values..."
              className="mt-6 min-h-36 w-full resize-y border border-black/15 bg-[#fafaf8] p-5 text-sm leading-7 outline-none transition-colors focus:border-black/40"
            />

          </div>

          <div className="mt-12 border-t border-black/10 pt-10">

            <h2 className="font-display text-3xl">
              What's the complexity?
            </h2>

            <p className="mt-3 text-gray-600">
              Explain the expected time and space complexity of your approach.
            </p>

            <textarea
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              placeholder="Time: O(...), Space: O(...) — explain why..."
              className="mt-6 min-h-32 w-full resize-y border border-black/15 bg-[#fafaf8] p-5 text-sm leading-7 outline-none transition-colors focus:border-black/40"
            />

          </div>

          <div className="mt-12 flex justify-end border-t border-black/10 pt-8">

            <button
              className="border border-black bg-black px-6 py-3 text-sm text-white transition-opacity hover:opacity-80"
            >
              Submit Practice →
            </button>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Practice;
