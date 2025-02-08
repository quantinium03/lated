import { useEffect, useState } from "react"
import Header from "./components/Header"
import LatexEditor from "./components/LatexEditor"
import PdfOutput from "./components/PdfOutput"

function App() {
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [content, setContent] = useState(`\\documentclass{article}
\\begin{document}
Hello, World!
\\end{document}
`);
    const [isCompiling, setIsCompiling] = useState(false);
    const [error, setError] = useState<string>("");

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
        <>
            <div>
                <Header />
            </div>
            <div className="flex h-[100vh]">
                <div className="flex-1">
                    <LatexEditor
                        content={content}
                        onChange={setContent}
                        onCompile={handleCompile}
                        isCompiling={isCompiling}
                    />
                </div>
                <div className="flex-1">
                    <PdfOutput
                        pdfUrl={pdfUrl}
                        isCompiling={isCompiling}
                        error={error}
                    />
                </div>
            </div>
        </>
    )
}

export default App
