import { GithubLogo } from "@phosphor-icons/react";

const Header = () => {
    return (
        <div className="flex justify-between border-b border-[#d79921] py-2 px-3">
            <div>
                <span className="text-xl md:text-3xl font-bold text-[#d79921]">LaTed</span>
            </div>
            <div>
                <a
                    href="https://github.com/quantinium03/lated"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-md aspect-square flex items-center justify-center p-2 text-[#d79921] hover:bg-[#d79921] hover:text-white transition"
                >
                    <GithubLogo size={20} className="md:w-6 md:h-6" />
                </a>
            </div>
        </div>
    );
};

export default Header;
