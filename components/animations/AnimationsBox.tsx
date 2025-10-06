import AnimationComponent from "./AnimationComponent"
import { Animation, LedStrip } from "../../utils/types";

interface AnimationsBoxProps {
    selectedLedStrip: LedStrip | null;
    animations: Record<number, string>;
    onSelect: (animation: Animation) => void;
    className?: string;
}

export default function AnimationsBox({
    selectedLedStrip,
    animations,
    onSelect,
    className
}: AnimationsBoxProps) {
    // const idleAnimations: Record<number, string> = getIdleAnimations();

    return (
        <div className={`w-full h-full overflow-hidden sm:rounded-3xl ${className}`}>
            {/* Content Area — responsive padding p-4 sm:p-6 */}
            <div className="relative p-4 sm:p-6 flex flex-col">
                {/* Scrollable area */}
                <div className="relative overflow-y-auto hide-scrollbar h-[calc(100dvh-17.5rem)]">
                    <div className="flex flex-col gap-4">
                        {Object.keys(animations).map(k => (<AnimationComponent
                            key={k}
                            animation={{ "id": parseInt(k) }}
                            selected={selectedLedStrip !== null && selectedLedStrip.animation === parseInt(k)}
                            onClick={(animation) => { onSelect(animation) }}
                        />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}