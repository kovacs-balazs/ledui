import { useState } from "react";
import { Animation } from "../../utils/types";
import GradientPickerWithColorPicker from "./GradientPickerWithColorPicker";
import ColorPicker from "./ColorPicker";
import { hexToHsv } from "../../utils/colors";

interface ColorPickerSwitcherProps {
    background?: boolean;
    animation: Animation;
}

const isSingle = (animation: Animation) => {
    if (animation.colors.length == 2) {
        return animation.colors[0].color === animation.colors[1].color && animation.colors[0].position == 0 && animation.colors[1].position == 100;
    }
}

export default function ColorPickerSwitcher({ background, animation }: ColorPickerSwitcherProps) {
    const [type, setType] = useState<number>(isSingle(animation) ? 0 : 1); // 0 = single color

    // const text = type == 0 ? "to gradient" : "to single";
    // const design = type == 0 ? "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" : "text-neutral-300";

    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex justify-center w-full text-neutral-200 text-2xl active:scale-90 transform transition-transform rounded-xl mx-auto h-fit"
                onClick={() => { setType(prev => prev == 1 ? 0 : 1) }}>
                <div className={`flex flex-row w-full justify-center items-center gap-2`}>
                    <label className="flex text-xl">Switch Picker</label>
                </div>
            </div>
            <div className="w-full">
                {type == 0 && (
                    <ColorPicker
                        background={background}
                        initialColor={hexToHsv(animation.colors[0].color)}
                        onChange={(hsv, rgb, hex) => animation.colors = [{ "position": 0, "color": hex }, { "position": 100, "color": hex }]}
                    // key={selectedStopIndex}
                    />
                )}
                {type == 1 && (
                    <GradientPickerWithColorPicker background={background} gradients={animation.colors} onChange={((colors) => { animation.colors = colors })} />
                )}
            </div>
        </div>
    );
}