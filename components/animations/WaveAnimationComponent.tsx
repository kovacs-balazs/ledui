import { WaveAnimation } from "../../utils/types";
import ColorPickerSwitcher from "../colors/ColorPickerSwitcher";
import NumberInputBox from "../NumberInputBox";
import PremiumCheckBox from "../PremiumCheckBox";
import Slider from "../Slider";


interface WaveAnimationComponentProps {
    // ledStrip: LedStrip;
    animation: WaveAnimation;
    onChange: (animation: WaveAnimation) => void;
}

export default function WaveAnimationComponent({
    // ledStrip,
    animation,
    onChange,
}: WaveAnimationComponentProps) {
    return (
        <div className="flex flex-col w-full items-center gap-6 mt-4">
            <div className="flex flex-row gap-16 justify-center items-center h-full w-full">
                <div className="flex w-fit">
                    <NumberInputBox label="Length" value={animation.length} onSubmit={(value) => animation.length = value} />
                </div>
                <div className="flex flex-col w-fit items-center">
                    <label className="text-neutral-200 text-lg italic mb-1">Distance</label>

                    <PremiumCheckBox size={0} isChecked={animation.distance} onClick={() => {
                        animation.distance = !animation.distance;
                        onChange(animation);
                    }} />
                </div>
            </div>
            <div className="flex w-[75%]">
                <Slider label="Speed" min={0} max={100} value={animation.speed} onChange={(value) => animation.speed = value} />
            </div>

            <div className="flex w-[85%] justify-center">
                {/* <BottomMenu>
                    <ColorPickerSwitcher background={false} animation={animation} />
                </BottomMenu> */}
                <ColorPickerSwitcher background={false} animation={animation} />
            </div>
        </div>
    )
}