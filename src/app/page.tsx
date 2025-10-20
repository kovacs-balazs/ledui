'use client';
import { useCallback, useEffect, useState } from "react";
import { LedStrip } from "../../utils/types";
import { useIsMobile } from "./useIsMobile";
import Error from "next/error";
import Footer from "./footer";
import LedStripsPage from "./LedStripsPage";
import AnimationsPage from "./animations/AnimationsPage";
import { createDefaultLedStrip } from "../../utils/defaults";
import SettingsPage from "./settings/SettingsPage";
import { useNotification } from "@/hooks/useNotification";
import NotificationPopup from "../../components/NotificationPopup";
/*

text: -neutral-200
textSecondary: -neutral-300
line: -blue-800

footer:
    - ledstrips
        navbar:
            - ledstrip box (title, list, add/remove buttons)
            - ledstrip properties (name, pin, led count)
    - animations:
        navbar:
            - animation box (name)
            - animation settings (settings)
    - save button

page:
    - navbar
        - current page
    - footer

ToDo:
    - error on save button (duplicated name or smth)

*/
const SELECT_NEW_LEDSTRIP = true;

async function getLedStrips(): Promise<LedStrip[]> {
    const response = await fetch('/api/ledstrips');
    if (!response.ok) {
        const errorData = await response.json();
        throw { error: errorData.error || 'Unknown Error', message: errorData.message || 'An unknown error occurred.' };
    }
    return await response.json();
}

async function save(ledStrips: LedStrip[]): Promise<void> {
    console.log("Saving data: " + JSON.stringify(ledStrips))
    fetch("/api/ledstrips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ledStrips)
    });
}
interface SettingsIconProps {
    isSelected: boolean;
}

export const SettingsIcon = ({ isSelected }: SettingsIconProps) => {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-[1.25em] h-[1.25em] text-[18px] `}
            fill="none"
        >
            {/* Define the gradient */}
            {isSelected && (
                <defs>
                    <linearGradient id="settingsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#51a2ff" /> {/* Blue color */}
                        <stop offset="100%" stopColor="#c27aff" /> {/* Purple color */}
                    </linearGradient>
                </defs>
            )}

            {/* Gear/cog icon */}
            <path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                stroke={isSelected ? "url(#settingsGradient)" : "#a1a1a1"}
                className="stroke-[1.75]"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                stroke={isSelected ? "url(#settingsGradient)" : "#a1a1a1"}
                className="stroke-[1.75]"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const SaveButton = () => {
    return (
        <div className="w-6 h-6 flex flex-col justify-between">
            <svg className="fill-neutral-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"></path> </g></svg>
        </div>
    )
}

interface BluetoothIconProps {
    isSelected: boolean;
}

export const BluetoothIcon = ({ isSelected }: BluetoothIconProps) => {
    return (
        <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={`űw-[1.25em] h-[1.25em] text-[18px]`}
            fill="none" // Changed to "none" since we want to show the stroke, not fill
        >
            {/* Define the gradient */}
            {isSelected && (
                <defs>
                    <linearGradient id="bluetoothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#51a2ff" /> {/* Blue color */}
                        <stop offset="100%" stopColor="#c27aff" /> {/* Purple color */}
                    </linearGradient>
                </defs>
            )}

            {/* Apply the gradient to the stroke when selected, otherwise use a solid color */}
            <path
                d="M33.452 31.244l15.114-13.604a1.002 1.002 0 0 0 .038-1.45L32.707.293a1.003 1.003 0 0 0-1.707.707v27.791L16.81 14.602a1 1 0 0 0-1.414 1.414l15.152 15.151-15.115 13.604a1 1 0 1 0 1.338 1.486l14.228-12.806v29.549a1.002 1.002 0 0 0 1.707.707l15.897-15.898a1.002 1.002 0 0 0 0-1.414L33.452 31.244zM33 3.414l13.445 13.445L33 28.96V3.414zM33 60.586V33.62l13.483 13.482L33 60.586z"
                stroke={isSelected ? "url(#bluetoothGradient)" : "#a1a1a1"} // Use gradient when selected, solid color otherwise
                className="stroke-[2.5] md:stroke-[3.5] lg:stroke-[4.5]"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Home() {
    const [ledStrips, setLedStrips] = useState<LedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLedStrip, setSelectedLedStrip] = useState<LedStrip | null>(null);

    const [footer, setFooter] = useState<'leds' | 'animations' | 'settings'>('leds');

    const { showNotification, notificationProps } = useNotification();

    function getNewLedStrip(): LedStrip {
        const highestId = ledStrips.length > 0
            ? Math.max(...ledStrips.map(strip => strip.id))
            : -1;
        return createDefaultLedStrip(highestId + 1);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ledStripsData = await getLedStrips();
                setLedStrips(ledStripsData);
                if (ledStripsData.length > 0) {
                    setSelectedLedStrip(ledStripsData[0]);
                }
                setError(null);
            } catch (err) {
                setError((err as Error).message);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleLedStripPower = (ledStrip: LedStrip) => {
        ledStrip.power = !ledStrip.power;
        changeProperty(ledStrip);
    };

    const changePropertyCallback = useCallback((ledStrip: LedStrip) => {
        //if (!selectedLedStrip) return;
        setLedStrips(prev =>
            prev.map(strip =>
                strip.id === ledStrip.id ? ledStrip : strip
            )
        );
    }, []);

    const changeProperty = (ledStrip: LedStrip) => {
        //if (!selectedLedStrip) return;
        setLedStrips(prev =>
            prev.map(strip =>
                strip.id === ledStrip.id ? ledStrip : strip
            )
        );
    };

    const addNewLedStrip = () => {
        const newLedStrip = getNewLedStrip();
        setLedStrips(prev => [...prev, newLedStrip]);
        if (!selectedLedStrip) {
            setSelectedLedStrip(newLedStrip);
        }
    }

    const removeSelectedLedStrip = () => {
        if (!selectedLedStrip) return;
        setLedStrips(prev => {
            let selectedIndex = 0;
            let counter = 0;
            const newList = prev.filter(strip => {
                if (strip.id !== selectedLedStrip.id) {
                    counter++;
                    return true;
                }
                selectedIndex = counter;
            });

            if (SELECT_NEW_LEDSTRIP) {
                if (newList.length > 0) {
                    setSelectedLedStrip(newList[Math.min(selectedIndex, newList.length - 1)]);
                } else {
                    setSelectedLedStrip(null);
                }
            } else {
                setSelectedLedStrip(null);
            }

            return newList;
        });
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // <div className="sm:flex gap-30 sm:ml-28 mt-14">
    //             {/* BAL PANEL - LED STRIP BOX */}
    //             <div className="">
    //                 <LedStripBox
    //                     ledStrips={ledStrips}
    //                     selectedLedStrip={selectedLedStrip}
    //                     onPowerToggle={toggleLedStripPower}
    //                     onSelect={setSelectedLedStrip}
    //                     onAdd={addNewLedStrip}
    //                     onRemove={removeSelectedLedStrip}
    //                     className="flex-shrink-0"
    //                 />
    //             </div>

    //             {/* KÖZÉPSŐ PANEL - PROPERTIES, SAVE */}
    //             {selectedLedStrip && (
    //                 <div className="">
    //                     <LedStripProperties ledStrip={selectedLedStrip} onChange={changeProperty} className="mt-10" />
    //                 </div>
    //             )}
    //             {!isMobile && (
    //                 <div className="">
    //                     <SaveButton onClick={() => console.log("Save data")} />
    //                 </div>
    //             )}

    //             {/* JOBB PANEL - ANIMÁCIÓK */}
    //             <div>
    //                 {selectedLedStrip && (
    //                     <div className="">
    //                         <AnimationBox ledStrip={selectedLedStrip} onChange={(animation) => console.log("Changed: " + animation.id)} className="mt-10 sm:mt-0" />
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //
    // md:bg-none md:bg-gray-950 

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-950 w-screen h-[100dvh] overflow-hidden">
            <div className="flex justify-center w-screen h-[calc(100dvh+1px)] overflow-y-auto overscroll-contain">
                <div className="flex max-w-150 w-full flex-col pb-20">
                    <Footer options={[
                        { name: "LED", isSelected: footer === 'leds', onClick: () => { setFooter("leds") } },
                        { name: "Animations", isSelected: footer === 'animations', onClick: () => { setFooter("animations") } },
                        {
                            icon: <SaveButton />, isSelected: false, onClick: () => {
                                save(ledStrips);
                                showNotification("KURVA", "success");
                            }
                        },
                        // {name: "S", isSelected: false, onClick: () => {console.log("Save data"); save(ledStrips) }, isActionButton: true }
                    ]} />

                    {notificationProps && <NotificationPopup {...notificationProps} />}

                    {footer === 'leds' && (
                        <LedStripsPage
                            ledStrips={ledStrips}
                            selectedLedStrip={selectedLedStrip}
                            onPowerToggle={toggleLedStripPower}
                            onSelect={setSelectedLedStrip}
                            onAdd={addNewLedStrip}
                            onRemove={removeSelectedLedStrip}
                            onChange={changeProperty}
                        />
                    )}

                    {selectedLedStrip && footer === 'animations' && (
                        <AnimationsPage
                            selectedLedStrip={selectedLedStrip}
                            onSelect={(animation) => {
                                selectedLedStrip.animation = animation.id
                                changeProperty(selectedLedStrip);
                            }}
                            onChange={(animation) => {
                                changePropertyCallback(selectedLedStrip);
                            }}
                        />
                    )}

                    {footer === 'settings' && (
                        <SettingsPage
                            onSelect={(animation) => {
                                selectedLedStrip.animation = animation.id
                                changeProperty(selectedLedStrip);
                            }}
                            onChange={(animation) => {
                                changePropertyCallback(selectedLedStrip);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}