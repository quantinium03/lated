import "./App.css";
import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

function App() {
    const [latexContent, setLatexContent] = useState(
        "\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}"
    );
    const [pdfUrl, setPdfUrl] = useState("");
    const [isCompiling, setIsCompiling] = useState(false);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    const compileLatex = async () => {
        try {
            setIsCompiling(true);
            setError(null);
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);

            const formData = new URLSearchParams();
            formData.append('content', latexContent);

            const credentials = btoa(`${import.meta.env.VITE_USERNAME}:${import.meta.env.VITE_PASSWORD}`);
            formData.append("key", "value");

            const response = await fetch("https://lated.quantinium.dev/compile", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Compilation failed');
            }

            const pdfBlob = await response.blob();
            if (pdfBlob.size === 0) throw new Error('Generated PDF is empty');

            setPdfUrl(URL.createObjectURL(pdfBlob));
            setError(null);
        } catch (error: any) {
            setPdfUrl("");
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsCompiling(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-gray-50">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-xl font-bold">LaTeX Editor</h1>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 border-r flex flex-col">
                    <Editor
                        height="calc(100vh - 8rem)"
                        defaultLanguage="latex"
                        value={latexContent}
                        theme="vs-dark"
                        onChange={value => setLatexContent(value || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: "on",
                            lineNumbers: "on",
                        }}
                    />
                    <div className="p-4 border-t">
                        <button
                            className={`w-full py-2 text-white rounded ${isCompiling ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            onClick={compileLatex}
                            disabled={isCompiling}
                        >
                            {isCompiling ? 'Compiling...' : 'Compile'}
                        </button>
                        {error && (
                            <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-1/2 bg-gray-100">
                    {pdfUrl ? (
                        <embed
                            src={pdfUrl}
                            type="application/pdf"
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            {isCompiling ? 'Compiling PDF...' : 'No PDF generated yet'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
