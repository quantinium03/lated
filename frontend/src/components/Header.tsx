import { Download, GithubLogo } from "@phosphor-icons/react"

const Header = () => {
    return (
        <div className="flex justify-between border-b-[#d79921] border py-2 mx-auto px-3">
            <div>
                <span className="text-3xl font-bold text-[#d79921]">LaTed</span>
            </div>
            <div className="flex gap-3">
                <button className="border rounded-md aspect-square self-center p-1 text-[#d79921] font-bold">
                    <Download size={24} />
                </button>
                <button className="border rounded-md aspect-square self-center p-1 text-[#d79921] font-bold">
                    <GithubLogo size={24} />
                </button>
            </div>
        </div>
    )
}

export default Header
