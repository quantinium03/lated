import { Editor } from "@monaco-editor/react";
import "katex/dist/katex.min.css";

const LatexEditor = ({ onContentChange }) => {
  const handleEditorChange = (value) => {
    if (value !== undefined) {
      onContentChange(value);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full border-r">
      <Editor
        height="100%"
        defaultLanguage="latex"
        defaultValue="\\documentclass{article}\n\\begin{document}\n\n% Start typing your LaTeX here\n\n\\end{document}"
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          lineNumbers: "on",
          renderControlCharacters: true,
        }}
      />
    </div>
  );
};

export default LatexEditor;
