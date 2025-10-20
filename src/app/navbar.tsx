import React from "react";

interface NavbarOptions {
    name: string;
    isSelected: boolean;
    onClick: () => void;
}

interface NavbarProps {
    options: NavbarOptions[];
}

const SaveButton = () => {
    return (
        <button
            className="relative z-65 p-4 transition-all duration-300 hover:bg-gray-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                bg-gray-800/40 rounded-2xl border border-gray-600/30"
            aria-label="Menu"
        >
            <div className="w-6 h-6 flex flex-col justify-between">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#0F0F0F"></path> </g></svg>
            </div>
        </button>
    )
}

// bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md border-b border-gray-700/50
function RealNavbar({ options }: NavbarProps) {
    return (
        <div className="relative top-0 left-0 right-0 h-16 z-50 px-4 pt-2 mb-4 w-full">
            <div className="flex flex-row gap-4 h-16">
                <div className="w-full grid grid-flow-col auto-cols-fr items-center h-full bg-gray-800/40 rounded-2xl border border-gray-600/30 shadow-2xl shadow-black/30">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={option.onClick}
                            className={`relative flex items-center justify-center h-full transition-all duration-300 ease-out group uppercase tracking-wider
                            ${option.isSelected
                                    ? 'text-neutral-200'
                                    : 'text-neutral-400 md:hover:text-neutral-200'
                                }`}
                        >
                            {/* Animated background for selected state */}
                            <div className={`absolute inset-2 rounded-xl transition-all duration-300 ease-out
                            ${option.isSelected
                                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-inner shadow-blue-400/10'
                                    : 'md:group-hover:bg-gray-700/30 group-active:bg-gray-700/30'
                                }`}
                            />

                            {/* Animated underline effect */}
                            <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 
                            transition-all duration-300 transform origin-center
                            ${option.isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0 md:group-hover:scale-100 md:group-hover:opacity-50 group-active:scale-100 group-active:opacity-50'}`}
                            />

                            {/* Text - ALWAYS use gradient to prevent blinking */}
                            <span className={`relative z-10 font-semibold text-lg transition-all duration-300
                            ${option.isSelected
                                    ? 'text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text drop-shadow-lg'
                                    : 'text-transparent bg-gradient-to-r from-neutral-400 to-neutral-400 bg-clip-text md:group-hover:bg-gradient-to-r md:group-hover:from-neutral-200 md:group-hover:to-neutral-200 group-active:bg-gradient-to-r group-active:from-neutral-200 group-active:to-neutral-200 md:group-hover:scale-105 group-active:scale-105'
                                }`}>
                                {option.name}
                            </span>

                            {/* Subtle glow behind selected item */}
                            {option.isSelected && (
                                <div className="absolute inset-0 rounded-xl bg-blue-400/5 blur-sm" />
                            )}
                        </button>
                    ))}
                </div>
                {/* <SaveButton /> */}
            </div>
        </div>
    )
}

const Navbar = React.memo(RealNavbar);

export default Navbar;