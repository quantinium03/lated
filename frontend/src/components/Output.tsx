import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

const Output = ({ content }: { content: string }) => {
    return (
        <div
            className="h-[calc(100vh-4rem)] w-full p-4 bg-white overflow-auto"
        >
            <Latex>{content}</Latex>
        </div>
    );
};

export default Output;
