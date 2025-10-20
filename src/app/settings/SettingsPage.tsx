import Navbar from "../navbar";
import KobaHorizontalLine from "../../../components/KobaHorizontalLine";
import { useCallback, useEffect, useState } from "react";
import { formatName } from "../../../utils/utils";
import { stringify } from "querystring";

interface HeaderTitleProps {
    title: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title }) => {
    return (
        <div className="flex flex-col w-full h-full bg-gray-800/40 rounded-2xl border border-gray-600/30 shadow-2xl shadow-black/30">
            {/* Background */}
            <div className="flex m-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-inner shadow-blue-400/10 h-full rounded-xl justify-center items-center">
                <div className="font-semibold uppercase tracking-wider text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text drop-shadow-lg text-lg">
                    {title}
                </div>
            </div>

            {/* Underline */}
            <div className="flex h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 duration-300 transform origin-center scale-100 opacity-100 mx-4" />
        </div>
    )
};

interface HamburgerMenuProps {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
    children,
    isOpen,
    setIsOpen,
}) => {
    const [isMenuNarrowerThanScreen, setIsMenuNarrowerThanScreen] = useState(false);

    // Check if menu is narrower than screen
    useEffect(() => {
        const checkMenuWidth = () => {
            if (isOpen) {
                const menu = document.getElementById('hamburger-menu');
                if (menu) {
                    const menuRect = menu.getBoundingClientRect();
                    setIsMenuNarrowerThanScreen(menuRect.width < window.innerWidth);
                }
            }
        };

        checkMenuWidth();
        window.addEventListener('resize', checkMenuWidth);

        return () => {
            window.removeEventListener('resize', checkMenuWidth);
        };
    }, [isOpen]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Hamburger Button - mindig látható */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative z-65 p-4 transition-all duration-300 hover:bg-gray-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                bg-gray-800/40 rounded-2xl border border-gray-600/30"
                aria-label="Menu"
            >
                <div className="w-6 h-6 flex flex-col justify-between">
                    <div className={`w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400`} />
                    <div className={`w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400`} />
                    <div className={`w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400`} />
                </div>
            </button>

            {/* Backdrop és Menu */}
            <div className={`fixed inset-0 z-65 transition-all duration-300 ${isOpen
                ? (isMenuNarrowerThanScreen ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent')
                : 'pointer-events-none'
                }`}
                onClick={handleBackdropClick}
            >
                {/* Menu - Full screen on mobile, dynamic width on desktop */}
                <div
                    id="hamburger-menu"
                    className={`fixed left-0 top-0 h-full bg-gray-800 rounded-r-2xl shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        } w-[75%]`}
                >
                    {/* Close Button */}
                    <div className="flex flex-row p-4 border-b border-gray-400 items-center gap-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg transition-all duration-300 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            aria-label="Close menu"
                        >
                            <div className="w-6 h-6 mx-2 relative">
                                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-400 transform -rotate-45" />
                                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-400 transform rotate-45" />
                            </div>
                        </button>
                        <div className="text-xl text-neutral-400">
                            Settings
                        </div>
                    </div>

                    {/* Menu Content */}
                    <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default function SettingsPage() {
    const [menu, setMenu] = useState<'hotspot' | 'bluetooth'>('hotspot');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuChange = (newMenu: 'hotspot' | 'bluetooth') => {
        setMenu(newMenu);
        setIsMenuOpen(false); // Egyszerű bezárás
    };


    return (
        <div className="w-full">
            <div className="flex flex-row relative top-0 left-0 right-0 h-16 z-50 px-4 pt-2 mb-4 gap-4">
                <div className="flex h-full">
                    <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
                        <div className="p-4 flex gap-2 flex-col text-lg">
                            <div className={`${menu === "hotspot" ? "text-neutral-200" : "text-neutral-400"} p-2`} onClick={() => handleMenuChange("hotspot")}>Hotspot</div>
                            <div className={`${menu === "bluetooth" ? "text-neutral-200" : "text-neutral-400"} p-2`} onClick={() => handleMenuChange("bluetooth")}>Bluetooth</div>
                        </div>
                    </HamburgerMenu>
                </div>
                <div className="flex w-full h-full">
                    <HeaderTitle title={formatName(menu)} />
                </div>
            </div>
            <KobaHorizontalLine />

            <div className="fixed bottom-[6rem] max-w-150 w-full">
                <KobaHorizontalLine />
            </div>
        </div>
    );
}