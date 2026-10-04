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
    <div className="overflow-hidden border border-white/10 bg-[#181818]">

      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#181818] px-4 py-3">
        <span className="text-xs uppercase tracking-[0.15em] text-white/50">
          Your Solution
        </span>

        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="border border-white/10 bg-[#222222] px-3 py-2 text-xs text-white outline-none transition-colors hover:border-white/20"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="500px"
        language={language}
        value={value}
        onChange={(value) => onChange(value ?? "")}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
          },

          fontSize: 14,

          lineNumbers: "on",

          wordWrap: "on",

          automaticLayout: true,

          scrollBeyondLastLine: false,

          padding: {
            top: 16,
            bottom: 16,
          },

          // Keep the editor clean and focused.
          renderLineHighlight: "line",

          // Better cursor visibility.
          cursorBlinking: "smooth",

          // Don't show unnecessary whitespace.
          renderWhitespace: "none",

          // Comfortable tab behavior.
          tabSize: 4,

          // Keep suggestions available.
          suggest: {
            showMethods: true,
            showFunctions: true,
            showVariables: true,
          },
        }}
      />

      {/* Run Code */}
      <div className="border-t border-white/10 bg-[#181818] px-4 py-4">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="border border-white bg-white px-5 py-2 text-sm text-black transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run Code →"}
        </button>
      </div>

      {/* Test Results */}
      {output && (
        <div className="border-t border-white/10 bg-[#181818] px-4 py-5">

          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.15em] text-white/50">
              Test Results
            </p>

            {output.success && (
              <span className="text-sm text-white/60">
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
                  className="border border-white/10 bg-[#1d1d1d] px-4 py-4"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-white/80">
                      Test Case {result.test_case}
                    </span>

                    <span
                      className={`text-xs uppercase tracking-[0.12em] ${
                        result.passed
                          ? "text-white/70"
                          : "text-white/40"
                      }`}
                    >
                      {result.passed ? "✓ Passed" : "✕ Failed"}
                    </span>

                  </div>

                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">

                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-white/30">
                        Expected
                      </p>

                      <pre className="mt-1 font-mono text-white/70">
                        {JSON.stringify(result.expected)}
                      </pre>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-white/30">
                        Your Output
                      </p>

                      <pre className="mt-1 font-mono text-white/70">
                        {JSON.stringify(result.actual)}
                      </pre>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="mt-4 border border-white/10 bg-[#1d1d1d] px-4 py-4">
              <p className="text-sm text-white/70">
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
