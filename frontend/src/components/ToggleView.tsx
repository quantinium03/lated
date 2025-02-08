import type React from "react"

interface ToggleViewProps {
  activeView: "editor" | "output"
  setActiveView: (view: "editor" | "output") => void
}

const ToggleView: React.FC<ToggleViewProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="flex border-b border-yellow-500">
      <button
        className={`flex-1 py-2 text-center ${activeView === "editor" ? "bg-yellow-500 text-black" : "bg-[#1d2021] text-yellow-500"}`}
        onClick={() => setActiveView("editor")}
      >
        Editor
      </button>
      <button
        className={`flex-1 py-2 text-center ${activeView === "output" ? "bg-yellow-500 text-black" : "bg-[#1d2021] text-yellow-500"}`}
        onClick={() => setActiveView("output")}
      >
        Output
      </button>
    </div>
  )
}

export default ToggleView
