import { useCallback, useEffect, useState } from "react";
import { GradientStop } from "../../utils/types";
import GradientPickerWithColorPicker from "./GradientPickerWithColorPicker";
import KobaGradientButton from "../KobaGradientButton";
import ColorPicker from "./ColorPicker";
import { hexToHsv } from "../../utils/colors";

interface ColorPickerSwitcherProps {
    background?: boolean;
    colors: GradientStop[];
    onChange?: (stops: GradientStop[]) => void;
}

const isSingle = (colors: GradientStop[]) => {
    if (colors.length == 2) {
        return colors[0].color === colors[1].color && colors[0].position == 0 && colors[1].position == 100;
    }
    return false;
}

export default function ColorPickerSwitcher({ background, colors, onChange }: ColorPickerSwitcherProps) {
    const [single, setSingle] = useState<boolean>(isSingle(colors)); // 0 = single color

    useEffect(() => {
        setSingle(isSingle(colors));
    }, [colors]);

    const handleChange = useCallback((stops: GradientStop[]) => {
        onChange?.(stops);
    }, [onChange]);

    return (
        <div className="flex flex-col w-full gap-4 px-4">
            <div className={`flex flex-row w-full items-center text-center justify-center`}>
                <KobaGradientButton text={"Single"} isSelected={single} onClick={() => setSingle(true)} />
                <KobaGradientButton text={"Gradient"} isSelected={!single} onClick={() => setSingle(false)} />
            </div>

            <div className="w-full">
                {single && (
                    <ColorPicker
                        background={false}
                        initialColor={hexToHsv(colors[0].color)} // animation.colors[0].color
                        onChange={handleChange}
                    />
                )}
                {!single && (
                    <GradientPickerWithColorPicker background={background} gradients={colors} onChange={handleChange} />
                )}
            </div>
        </div>
    );
}
