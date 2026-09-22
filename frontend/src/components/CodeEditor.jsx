import Editor from "@monaco-editor/react";
import { useState } from "react";

function CodeEditor({
  problemId,
  language,
  onLanguageChange,
  value,
  onChange,
}) {

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem_id: problemId,
          language,
          code: value,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Execution failed");
      }

      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput({
        success: false,
        error: error.message,
        results: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="overflow-hidden border border-black/15 bg-[#fafaf8]">

      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
        <span className="text-xs uppercase tracking-[0.15em] text-gray-500">
          Your Solution
        </span>

        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="border border-black/10 bg-white px-3 py-2 text-xs outline-none"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <Editor
        height="500px"
        language={language}
        value={value}
        onChange={(value) => onChange(value ?? "")}
        theme="vs"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          padding: {
            top: 16,
            bottom: 16,
          },
          scrollBeyondLastLine: false,
        }}
      />


      <div className="border-t border-black/10 px-4 py-4">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="border border-black bg-black px-5 py-2 text-sm text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run Code →"}
        </button>
      </div>

      {output && (
        <div className="border-t border-black/10 bg-white px-4 py-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
              Test Results
            </p>

            {output.success && (
              <span className="text-sm text-gray-600">
                {output.results.filter((result) => result.passed).length} /{" "}
                {output.results.length} passed
              </span>
            )}
          </div>

          {output.success ? (
            <div className="mt-4 space-y-3">
              {output.results.map((result) => (
                <div
                  key={result.test_case}
                  className="border border-black/10 px-4 py-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Test Case {result.test_case}
                    </span>

                    <span
                      className={`text-xs uppercase tracking-[0.12em] ${
                        result.passed
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      {result.passed ? "✓ Passed" : "✕ Failed"}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-gray-400">
                        Expected
                      </p>

                      <pre className="mt-1 font-mono text-gray-700">
                        {JSON.stringify(result.expected)}
                      </pre>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-gray-400">
                        Your Output
                      </p>

                      <pre className="mt-1 font-mono text-gray-700">
                        {JSON.stringify(result.actual)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 border border-black/10 px-4 py-4">
              <p className="text-sm text-gray-700">
                {output.error || "Execution failed."}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default CodeEditor;
