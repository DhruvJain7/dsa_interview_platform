import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

function CodeEditor({
  problemId,
  language,
  onLanguageChange,
  value,
  onChange,
}) {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  // Keep the editor in sync with the Navbar theme toggle.
  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setIsDark(root.classList.contains("dark"));
    };

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");

    try {
      const response = await fetch("/api/execute", {
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
    <div
      className={`overflow-hidden border ${
        isDark
          ? "border-white/10 bg-[#181818]"
          : "border-black/10 bg-white"
      }`}
    >
      {/* Editor Header */}
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${
          isDark
            ? "border-white/10 bg-[#181818]"
            : "border-black/10 bg-white"
        }`}
      >
        <span
          className={`text-xs uppercase tracking-[0.15em] ${
            isDark ? "text-white/50" : "text-black/50"
          }`}
        >
          Your Solution
        </span>

        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className={`border px-3 py-2 text-xs outline-none transition-colors ${
            isDark
              ? "border-white/10 bg-[#222222] text-white hover:border-white/20"
              : "border-black/10 bg-white text-black hover:border-black/20"
          }`}
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
        theme={isDark ? "vs-dark" : "vs"}
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

          renderLineHighlight: "line",

          cursorBlinking: "smooth",

          renderWhitespace: "none",

          tabSize: 4,

          suggest: {
            showMethods: true,
            showFunctions: true,
            showVariables: true,
          },
        }}
      />

      {/* Run Code */}
      <div
        className={`border-t px-4 py-4 ${
          isDark
            ? "border-white/10 bg-[#181818]"
            : "border-black/10 bg-white"
        }`}
      >
        <button
          onClick={runCode}
          disabled={isRunning}
          className={`border px-5 py-2 text-sm transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${
            isDark
              ? "border-white bg-white text-black"
              : "border-black bg-black text-white"
          }`}
        >
          {isRunning ? "Running..." : "Run Code →"}
        </button>
      </div>

      {/* Test Results */}
      {output && (
        <div
          className={`border-t px-4 py-5 ${
            isDark
              ? "border-white/10 bg-[#181818]"
              : "border-black/10 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <p
              className={`text-xs uppercase tracking-[0.15em] ${
                isDark ? "text-white/50" : "text-black/50"
              }`}
            >
              Test Results
            </p>

            {output.success && (
              <span
                className={`text-sm ${
                  isDark ? "text-white/60" : "text-black/60"
                }`}
              >
                {
                  output.results.filter(
                    (result) => result.passed
                  ).length
                }{" "}
                / {output.results.length} passed
              </span>
            )}
          </div>

          {output.success ? (
            <div className="mt-4 space-y-3">
              {output.results.map((result) => (
                <div
                  key={result.test_case}
                  className={`border px-4 py-4 ${
                    isDark
                      ? "border-white/10 bg-[#1d1d1d]"
                      : "border-black/10 bg-black/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isDark
                          ? "text-white/80"
                          : "text-black/80"
                      }`}
                    >
                      Test Case {result.test_case}
                    </span>

                    <span
                      className={`text-xs uppercase tracking-[0.12em] ${
                        result.passed
                          ? isDark
                            ? "text-white/70"
                            : "text-black/70"
                          : isDark
                            ? "text-white/40"
                            : "text-black/40"
                      }`}
                    >
                      {result.passed
                        ? "✓ Passed"
                        : "✕ Failed"}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <p
                        className={`text-xs uppercase tracking-[0.12em] ${
                          isDark
                            ? "text-white/30"
                            : "text-black/30"
                        }`}
                      >
                        Expected
                      </p>

                      <pre
                        className={`mt-1 font-mono ${
                          isDark
                            ? "text-white/70"
                            : "text-black/70"
                        }`}
                      >
                        {JSON.stringify(result.expected)}
                      </pre>
                    </div>

                    <div>
                      <p
                        className={`text-xs uppercase tracking-[0.12em] ${
                          isDark
                            ? "text-white/30"
                            : "text-black/30"
                        }`}
                      >
                        Your Output
                      </p>

                      <pre
                        className={`mt-1 font-mono ${
                          isDark
                            ? "text-white/70"
                            : "text-black/70"
                        }`}
                      >
                        {JSON.stringify(result.actual)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`mt-4 border px-4 py-4 ${
                isDark
                  ? "border-white/10 bg-[#1d1d1d]"
                  : "border-black/10 bg-black/[0.03]"
              }`}
            >
              <p
                className={`text-sm ${
                  isDark
                    ? "text-white/70"
                    : "text-black/70"
                }`}
              >
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
