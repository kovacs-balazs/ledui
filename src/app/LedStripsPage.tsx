import { useState } from "react";
import Navbar from "./navbar";
import LedStripBox from "../../components/ledstrips/LedStripsBox";
import LedStripProperties from "./LedStripsProperties";
import { LedStrip } from "../../utils/types";
import KobaHorizontalLine from "../../components/KobaHorizontalLine";


interface LedStripsPageProps {
    ledStrips: LedStrip[];
    selectedLedStrip: LedStrip | null;
    onPowerToggle: (ledStrip: LedStrip) => void;
    onSelect: (ledStrip: LedStrip) => void;
    onAdd: () => void;
    onRemove: () => void;
    onChange: (ledStrip: LedStrip) => void;
}

export default function LedStripsPage({
    ledStrips,
    selectedLedStrip,
    onPowerToggle,
    onSelect,
    onAdd,
    onRemove,
    onChange
}: LedStripsPageProps) {
    const [menu, setMenu] = useState<'ledstrips' | 'ledStripProperties'>('ledstrips');

    return (
        <div className="w-full">
            <Navbar options={[
                { name: "LED Strips", isSelected: menu === 'ledstrips', onClick: () => { setMenu('ledstrips') } },
                {
                    name: "Properties", isSelected: menu === 'ledStripProperties', onClick: () => {
                        if (selectedLedStrip) {
                            setMenu('ledStripProperties');
                        }
                    }
                },
            ]} />

            <KobaHorizontalLine />

            {menu === 'ledstrips' && (
                <div>
                    <LedStripBox
                        ledStrips={ledStrips}
                        selectedLedStrip={selectedLedStrip}
                        onPowerToggle={onPowerToggle}
                        onSelect={onSelect}
                        onAdd={onAdd}
                        onRemove={onRemove}
                    />
                    {/* fixed bottom-10rem] max-w-150 w-[90%] */}
                    <div className="max-w-150 w-full justify-center">
                        <KobaHorizontalLine />
                    </div>
                </div>
            )}

            {selectedLedStrip && menu === 'ledStripProperties' && (
                <div>
                    <LedStripProperties ledStrip={selectedLedStrip} onChange={onChange} className="mt-10" />
                    <div className="fixed bottom-[6rem] max-w-150 w-full">
                        <KobaHorizontalLine />
                    </div>
                </div>
            )}
        </div >
    );
}