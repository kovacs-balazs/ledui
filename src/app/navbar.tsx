import React from "react";

interface NavbarOptions {
    name: string;
    isSelected: boolean;
    onClick: () => void;
}

interface NavbarProps {
    options: NavbarOptions[];
}

// bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md border-b border-gray-700/50
function RealNavbar({ options }: NavbarProps) {
    return (
        <div className="relative top-0 left-0 right-0 h-16 z-50 px-4 pt-2 mb-4">
            <div className="grid grid-flow-col auto-cols-fr items-center h-full bg-gray-800/40 rounded-2xl border border-gray-600/30 shadow-2xl shadow-black/30">
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
        </div>
    )
}

const Navbar = React.memo(RealNavbar);

export default Navbar;