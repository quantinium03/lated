import { useState, useEffect } from 'react';
import { Editor } from "@monaco-editor/react";
import { Loader2, FileDown, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

function App() {
    const [latexContent, setLatexContent] = useState(
        "\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}"
    );
    const [pdfUrl, setPdfUrl] = useState("");
    const [isCompiling, setIsCompiling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);

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
        } catch (err) {
            setPdfUrl("");
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsCompiling(false);
        }
    };

    const toggleEditor = () => {
        setIsEditorCollapsed(!isEditorCollapsed);
    };

    return (
        <div className="flex h-screen w-full flex-col bg-slate-50">
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">LaTeX Editor</h1>
                        {pdfUrl && (
                            <a
                                href={pdfUrl}
                                download="document.pdf"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <FileDown size={20} />
                                <span className="hidden sm:inline">Download PDF</span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                <div className={`w-full md:w-1/2 flex flex-col border-b md:border-r border-slate-200 transition-all duration-300 ${isEditorCollapsed ? 'h-16' : 'flex-1'}`}>
                    <div className="bg-slate-100 p-2 flex items-center justify-between md:hidden">
                        <span className="font-medium text-slate-700">Editor</span>
                        <button
                            onClick={toggleEditor}
                            className="p-1 hover:bg-slate-200 rounded"
                        >
                            {isEditorCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                        </button>
                    </div>

                    {!isEditorCollapsed && (
                        <>
                            <div className="flex-1">
                                <Editor
                                    height="100%"
                                    defaultLanguage="latex"
                                    value={latexContent}
                                    theme="vs-dark"
                                    onChange={value => setLatexContent(value || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        wordWrap: "on",
                                        lineNumbers: "on",
                                        padding: { top: 16 },
                                    }}
                                    className="border-slate-200"
                                />
                            </div>
                            <div className="p-4 border-t border-slate-200 bg-white">
                                <button
                                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all
                                        ${isCompiling
                                            ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                                        }`}
                                    onClick={compileLatex}
                                    disabled={isCompiling}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {isCompiling && <Loader2 size={20} className="animate-spin" />}
                                        {isCompiling ? 'Compiling...' : 'Compile LaTeX'}
                                    </div>
                                </button>

                                {error && (
                                    <div className="mt-3 p-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="w-full md:w-1/2 flex-1 bg-slate-100">
                    {pdfUrl ? (
                        <embed
                            src={pdfUrl}
                            type="application/pdf"
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4 text-center">
                            {isCompiling ? (
                                <>
                                    <Loader2 size={40} className="animate-spin mb-3" />
                                    <p>Compiling your LaTeX document...</p>
                                </>
                            ) : (
                                <>
                                    <FileDown size={40} className="mb-3" />
                                    <p>Your compiled PDF will appear here</p>
                                    <p className="text-sm mt-2 text-slate-400">Write your LaTeX code in the editor and click Compile</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
