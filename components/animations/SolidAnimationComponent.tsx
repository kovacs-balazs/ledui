import { hexToHsv, hsvObjToHex } from "../../utils/colors";
import { SolidAnimation } from "../../utils/types";
import ColorPicker from "../colors/ColorPicker";
import ColorPickerSwitcher from "../colors/ColorPickerSwitcher";
import GradientPickerWithColorPicker from "../colors/GradientPickerWithColorPicker";


interface SolidAnimationComponentProps {
    animation: SolidAnimation;
    onChange: (animation: SolidAnimation) => void;
}

export default function SolidAnimationComponent({
    animation,
    onChange,
}: SolidAnimationComponentProps) {
    return (
        <div className="flex mt-4 w-full justify-center">
            <div className="w-[85%]">
                <ColorPickerSwitcher background={false} animation={animation} />
            </div>
        </div>
    )
}