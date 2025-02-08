import { useEffect, useState } from "react"
import Header from "./components/Header"
import LatexEditor from "./components/LatexEditor"
import PdfOutput from "./components/PdfOutput"
import ToggleView from "./components/ToggleView";

function App() {
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [content, setContent] = useState(`\\documentclass{article}
\\begin{document}
Hello, World!
\\end{document}
`);
    const [isCompiling, setIsCompiling] = useState(false);
    const [error, setError] = useState<string>("");
    const [activeView, setActiveView] = useState<'editor' | 'output'>('editor');

    const handleCompile = async () => {
        setIsCompiling(true);
        setError("");

        try {
            const credentials = btoa(`${import.meta.env.VITE_USERNAME}:${import.meta.env.VITE_PASSWORD}`);

            const response = await fetch('https://lated.quantinium.dev/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                },
                body: new URLSearchParams({
                    content: content
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Compilation failed');
            }

            const pdfBlob = await response.blob();
            const pdfObjectUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfObjectUrl);
            setActiveView('output');
        } catch (error) {
            console.error('Error compiling LaTeX:', error);
            setError(error instanceof Error ? error.message : 'Failed to compile LaTeX');
        } finally {
            setIsCompiling(false);
        }
    };

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="md:hidden">
                <ToggleView activeView={activeView} setActiveView={setActiveView} />
            </div>
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                <div className={`w-full md:w-1/2 h-full ${activeView === 'editor' ? 'block' : 'hidden md:block'}`}>
                    <LatexEditor
                        content={content}
                        onChange={setContent}
                        onCompile={handleCompile}
                        isCompiling={isCompiling}
                    />
                </div>
                <div className={`w-full md:w-1/2 h-full ${activeView === 'output' ? 'block' : 'hidden md:block'}`}>
                    <PdfOutput
                        pdfUrl={pdfUrl}
                        isCompiling={isCompiling}
                        error={error}
                    />
                </div>
            </div>
        </div>
    )
}

export default App
