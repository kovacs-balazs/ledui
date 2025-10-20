import { Animation, LedStrip } from "../../utils/types";
import SolidAnimationComponent from "./SolidAnimationComponent";
import WaveAnimationComponent from "./WaveAnimationComponent";
import ReverseWaveAnimationComponent from "./ReverseWaveAnimationComponent";
import BounceWaveAnimationComponent from "./BounceWaveAnimationComponent";

interface AnimationsSettingsProps {
    selectedLedStrip: LedStrip;
    onChange: (animation: Animation) => void;
    className?: string;
}

export default function AnimationsSettings({
    selectedLedStrip,
    onChange,
    className
}: AnimationsSettingsProps) {
    // console.log(selectedLedStrip.animations.length)
    const selectedAnimation: Animation | undefined = selectedLedStrip.animations.find(a => a.id === selectedLedStrip.animation);

    if (!selectedAnimation) {
        // selectedAnimation = createDefaultSolidAnimation();
        // selectedLedStrip.animations.push(selectedAnimation);
        // selectedLedStrip.animation = selectedAnimation.id;
        // onChange(selectedAnimation);
        return <div>Nincsen selected animation.</div>;
    }

    return (
        <div className={`w-[full] h-full overflow-hidden${className}`}>

            {/* Content Area — responsive padding p-4 sm:p-6 */}
            <div className="flex flex-col relative px-4 md:px-6 h-[calc(100dvh-11.7rem)] mx-auto w-[90%] overflow-scroll hide-scrollbar pb-4">
                {selectedAnimation.id === 0 && (
                    <SolidAnimationComponent animation={selectedAnimation} onChange={onChange} />
                )}
                {selectedAnimation.id === 1 && (
                    <WaveAnimationComponent animation={selectedAnimation} onChange={onChange} />
                )}
                {selectedAnimation.id === 2 && (
                    <ReverseWaveAnimationComponent animation={selectedAnimation} onChange={onChange} />
                )}
                {selectedAnimation.id === 3 && (
                    <BounceWaveAnimationComponent animation={selectedAnimation} onChange={onChange} />
                )}
            </div>
        </div>
    )
}