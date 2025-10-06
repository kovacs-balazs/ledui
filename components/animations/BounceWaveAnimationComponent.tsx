import { BounceWaveAnimation } from "../../utils/types";
import ColorPickerSwitcher from "../colors/ColorPickerSwitcher";
import NumberInputBox from "../NumberInputBox";
import Slider from "../Slider";


interface BounceWaveAnimationComponentProps {
    // ledStrip: LedStrip;
    animation: BounceWaveAnimation;
    onChange: (animation: BounceWaveAnimation) => void;
}

export default function BounceWaveAnimationComponent({
    // ledStrip,
    animation,
    onChange,
}: BounceWaveAnimationComponentProps) {
    return (
        <div className="flex flex-col w-full items-center gap-6 mt-4">
            <div className="flex flex-row gap-16 justify-center items-center h-full w-full">
                <div className="flex w-fit">
                    <NumberInputBox label="Length" value={animation.length} onSubmit={(value) => animation.length = value} />
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