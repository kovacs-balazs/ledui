import React from "react";
import { isContext } from "vm";
import { BluetoothIcon } from "./page";

interface FooterOption {
    name?: string;
    icon?: React.ReactNode;
    isSelected?: boolean;
    onClick: () => void;
    isActionButton?: boolean; // New prop to identify action buttons like Save
}

interface FooterProps {
    options: FooterOption[];
}

function RealFooter({ options }: FooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 z-50 px-4 pb-2">
            <div className="flex items-center h-full bg-gray-800/40 rounded-2xl border border-gray-600/30 shadow-2xl shadow-black/30 px-2 justify-center max-w-[600px] mx-auto w-full">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center h-full">
                        {option.isActionButton ? (
                            // Save Button - Minimal Action Style
                            <button
                                onClick={option.onClick}
                                className="relative flex items-center justify-center h-full transition-all duration-300 ease-out group uppercase tracking-wider px-6 min-w-[100px]"
                            >
                                {/* Simple background on hover/active */}
                                <div className="absolute inset-3 rounded-xl transition-all duration-300 ease-out bg-transparent md:group-hover:bg-green-600/20 group-active:bg-green-600/30" />

                                {/* Text with save-specific styling */}
                                <span className="relative z-10 font-semibold text-lg text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text transition-all duration-300 group-hover:scale-105 group-active:scale-95">
                                    {option.name}
                                </span>

                                {/* Subtle glow on hover */}
                                <div className="absolute inset-0 rounded-xl bg-green-400/0 transition-all duration-300 group-hover:bg-green-400/5 blur" />
                            </button>
                        ) : (
                            // Normal Selectable Buttons
                            <button
                                onClick={option.onClick}
                                className={`relative flex items-center justify-center h-full transition-all duration-300 ease-out group uppercase tracking-wider px-6 min-w-[80px]
                                    ${option.isSelected
                                        ? 'text-neutral-200'
                                        : 'text-neutral-400 sm:hover:text-neutral-200'
                                    }`}
                            >
                                {/* Animated background for selected state */}
                                <div className={`absolute inset-y-3 left-1/2 transform -translate-x-1/2 w-[max(80px,calc(100%-24px))] rounded-xl transition-all duration-300 ease-out
                                    ${option.isSelected
                                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-inner shadow-blue-400/10'
                                        : 'sm:group-hover:bg-gray-700/30 group-active:bg-gray-700/30'
                                    }`}
                                />

                                {/* Animated top line effect - now full width */}
                                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400
                                    transition-all duration-300 transform origin-center
                                    ${option.isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0 sm:group-hover:scale-100 sm:group-hover:opacity-50 group-active:scale-100 group-active:opacity-50'}`}
                                />

                                {/* Text with glow effect */}
                                <span className={`relative z-10 font-semibold text-lg transition-all duration-300 text-neutral-400
                                    ${option.isSelected
                                        ? 'text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text drop-shadow-lg'
                                        : 'text-transparent bg-gradient-to-r from-neutral-400 to-neutral-400 bg-clip-text sm:group-hover:bg-gradient-to-r sm:group-hover:from-neutral-200 sm:group-hover:to-neutral-200 group-active:bg-gradient-to-r group-active:from-neutral-200 group-active:to-neutral-200 sm:group-hover:scale-105 group-active:scale-95'
                                    }`}>
                                    {option.name ? option.name : option.icon}
                                </span>

                                {/* Subtle glow behind selected item */}
                                {option.isSelected && (
                                    <div className="absolute inset-0 rounded-xl bg-blue-400/5 blur-sm" />
                                )}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const Footer = React.memo(RealFooter);

export default Footer;