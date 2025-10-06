'use client';
import { useCallback, useEffect, useState } from "react";
import { LedStrip } from "../../utils/types";
import { useIsMobile } from "./useIsMobile";
import Error from "next/error";
import Footer from "./footer";
import LedStripsPage from "./LedStripsPage";
import AnimationsPage from "./animations/AnimationsPage";
import { createDefaultLedStrip } from "../../utils/defaults";
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

export default function Home() {
    const [ledStrips, setLedStrips] = useState<LedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLedStrip, setSelectedLedStrip] = useState<LedStrip | null>(null);

    const [footer, setFooter] = useState<'leds' | 'animations'>('leds');

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


                    <Footer options={[
                        { name: "LED", isSelected: footer === 'leds', onClick: () => { setFooter("leds") } },
                        { name: "Animations", isSelected: footer === 'animations', onClick: () => { setFooter("animations") } },
                        { name: "Save", isSelected: false, onClick: () => { console.log("Save data"); save(ledStrips) }, isActionButton: true }
                    ]} />
                </div>
            </div>
        </div>
    );
}