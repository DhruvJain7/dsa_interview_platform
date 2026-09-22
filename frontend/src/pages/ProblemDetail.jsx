import Navbar from "../components/Navbar";

function ProblemDetail({ problem, onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f3f3f1] p-5">
      <div className="min-h-[calc(100vh-2.5rem)] bg-white">

        <Navbar
          activePage="problems"
          onNavigate={onNavigate}
        />

        <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">

          <button
            onClick={() => onNavigate("problems")}
            className="mb-10 text-sm text-gray-500 transition-colors hover:text-black"
          >
            ← Back to Problems
          </button>

          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                {problem.topic}
              </p>

              <h1 className="mt-4 font-display text-5xl tracking-tight md:text-6xl">
                {problem.title}
              </h1>
            </div>

            <span className="mt-2 text-sm uppercase tracking-wider text-gray-500">
              {problem.difficulty}
            </span>
          </div>

          <div className="mt-12 border-t border-black/10 pt-10">
            <h2 className="font-display text-3xl">
              Problem
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-700">
              {problem.description}
            </p>
          </div>

          <div className="mt-12 border-t border-black/10 pt-10">
            <h2 className="font-display text-3xl">
              Examples
            </h2>

            <div className="mt-6 space-y-5">
              {problem.examples.map((example, index) => (
                <div
                  key={index}
                  className="border border-black/10 bg-[#fafaf8] p-5"
                >
                  <p className="text-sm font-medium">
                    Example {index + 1}
                  </p>

                  <p className="mt-3 text-sm text-gray-600">
                    <span className="font-medium text-black">Input:</span>{" "}
                    {example.input}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-black">Output:</span>{" "}
                    {example.output}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {example.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 border-t border-black/10 pt-10">
            <h2 className="font-display text-3xl">
              Before you code
            </h2>

            <p className="mt-4 text-gray-600">
              Explain how you would approach this problem.
              Focus on your reasoning, edge cases, and complexity.
            </p>

            <button
              className="mt-6 border border-black bg-black px-6 py-3 text-sm text-white transition-opacity hover:opacity-80"
            >
              Start Practice →
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}

export default ProblemDetail;
