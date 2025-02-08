import { ArrowsClockwise } from "@phosphor-icons/react"
import { Document, Page, pdfjs } from "react-pdf"
import { useEffect, useState } from "react"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfOutputProps {
    pdfUrl: string
    isCompiling: boolean
    error: string
}

function PdfOutput({ pdfUrl, isCompiling, error }: PdfOutputProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageWidth, setPageWidth] = useState(Math.min(window.innerWidth * 0.9, 600));

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement("a")
            link.href = pdfUrl
            link.download = "output.pdf"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    useEffect(() => {
        const handleResize = () => {
            setPageWidth(Math.min(window.innerWidth * 0.9, 600));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="h-full flex flex-col bg-slate-100">
            <div className="flex justify-between border-b border-yellow-500 bg-[#1d2021] p-2">
                <div className="flex self-center">
                    <span className="text-yellow-500 font-bold underline">output</span>
                </div>
                <div>
                    <button
                        className="text-yellow-500 font-bold border border-yellow-500 rounded-lg px-2 py-1 hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDownload}
                        disabled={!pdfUrl || isCompiling}
                    >
                        download
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="flex flex-col items-center justify-center min-h-full p-4">
                    {isCompiling ? (
                        <div className="flex items-center justify-center p-8">
                            <ArrowsClockwise className="animate-spin" size={32} />
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 text-red-500">{error}</div>
                    ) : (
                        pdfUrl && (
                            <Document
                                file={pdfUrl}
                                loading={
                                    <div className="flex items-center justify-center p-8">
                                        <ArrowsClockwise className="animate-spin" size={32} />
                                    </div>
                                }
                                error={
                                    <div className="text-center p-8 text-red-500">Failed to load PDF. Please try compiling again.</div>
                                }
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                {Array.from(new Array(numPages), (_, index) => (
                                    <div key={`page_${index + 1}`} className="mb-4">
                                        <Page
                                            pageIndex={index}
                                            scale={1}
                                            className="shadow-lg max-w-full"
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            width={pageWidth}
                                        />
                                    </div>
                                ))}
                            </Document>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default PdfOutput
