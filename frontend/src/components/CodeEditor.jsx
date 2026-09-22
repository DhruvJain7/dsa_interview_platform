import Editor from "@monaco-editor/react";

function CodeEditor({
  language,
  onLanguageChange,
  value,
  onChange,
}) {
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
    </div>
  );
}

export default CodeEditor;
