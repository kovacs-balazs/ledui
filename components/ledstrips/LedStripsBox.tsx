import KobaButton from "../KobaButton";
import LedStripComponent from "./LedStripComponent";
import { LedStrip } from "../../utils/types";
import { useIsMobile } from "@/app/useIsMobile";

interface LedStripBoxProps {
    ledStrips: LedStrip[];
    selectedLedStrip: LedStrip | null;
    onPowerToggle: (ledStrip: LedStrip) => void;
    onSelect: (ledStrip: LedStrip) => void;
    onAdd: () => void;
    onRemove: () => void;
    className?: string;
}

export default function LedStripBox({
    ledStrips,
    selectedLedStrip,
    onPowerToggle,
    onSelect,
    onAdd,
    onRemove,
    className
}: LedStripBoxProps) {
    const isMobile = useIsMobile();
    // md:bg-gradient-to-br from-neutral-800 to-slate-900 
    return (
        <div className={`relative overflow-hidden ${className} max-w-150 w-full`}>
            {/* Content Area — responsive padding p-4 sm:p-6 */}
            <div className="relative p-4 flex flex-col">
                {/* Scrollable area */}
                <div className="overflow-y-auto hide-scrollbar">
                    <div className="flex flex-col gap-4 h-[calc(100dvh-17.5rem)]">
                        {ledStrips.map((ledStrip, i) => (
                            <LedStripComponent
                                key={i}
                                onClick={() => onSelect(ledStrip)}
                                onPowerToggle={() => onPowerToggle(ledStrip)}
                                selected={selectedLedStrip !== null && ledStrip.id === selectedLedStrip.id}
                                ledStrip={ledStrip}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed flex bottom-[6rem] left-1/2 transform -translate-x-1/2 max-w-150 w-full justify-center">
                <div className="flex h-12 gap-6 sm:gap-12">
                    <div className="flex w-40 items-center justify-center">
                        <KobaButton label="Add" onClick={onAdd} />
                    </div>
                    <div className="flex w-40 items-center justify-center">
                        <KobaButton label="Remove" onClick={onRemove} />
                    </div>
                </div>
            </div>
        </div>
    )
}