import CodeMirror from "@uiw/react-codemirror"
import { StreamLanguage } from "@codemirror/language"
import { stex } from "@codemirror/legacy-modes/mode/stex"
import { ArrowsClockwise } from "@phosphor-icons/react"

interface LatexEditorProps {
  content: string
  onChange: (value: string) => void
  onCompile: () => void
  isCompiling: boolean
}

function LatexEditor({ content, onChange, onCompile, isCompiling }: LatexEditorProps) {
  return (
    <div className="h-full border-r border-slate-200 flex flex-col">
      <div className="flex justify-between border-b border-yellow-500 p-2 bg-[#1d2021]">
        <div className="flex self-center">
          <span className="text-yellow-500 font-bold underline">editor</span>
        </div>
        <div>
          <button
            className="text-yellow-500 font-bold border border-yellow-500 rounded-lg px-2 py-1 hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={onCompile}
            disabled={isCompiling}
          >
            {isCompiling && <ArrowsClockwise className="animate-spin" size={16} />}
            compile
          </button>
        </div>
      </div>
      <CodeMirror
        value={content}
        height="100%"
        extensions={[StreamLanguage.define(stex)]}
        onChange={onChange}
        theme="dark"
        className="text-sm md:text-base flex-grow overflow-auto"
        basicSetup={{
          lineNumbers: true,
          bracketMatching: true,
          closeBrackets: true,
        }}
        indentWithTab={true}
      />
    </div>
  )
}

export default LatexEditor

