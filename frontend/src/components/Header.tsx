import { Download, GithubLogo } from "@phosphor-icons/react"

const Header = () => {
  return (
    <div className="flex justify-between border-b-[#d79921] border py-2 px-3">
      <div>
        <span className="text-xl md:text-3xl font-bold text-[#d79921]">LaTed</span>
      </div>
      <div className="flex gap-2 md:gap-3">
        <button className="border rounded-md aspect-square self-center p-1 text-[#d79921] font-bold">
          <Download size={20} className="md:w-6 md:h-6" />
        </button>
        <button className="border rounded-md aspect-square self-center p-1 text-[#d79921] font-bold">
          <GithubLogo size={20} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  )
}

export default Header

