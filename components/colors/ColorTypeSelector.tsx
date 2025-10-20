import { useEffect, useState } from "react";
import { Animation, WaveAnimation } from "../../utils/types";
import GradientBorder from "../GradientBorder";
import ColorPickerSwitcher from "./ColorPickerSwitcher";
import KobaHorizontalLine from "../KobaHorizontalLine";
import KobaGradientButton from "../KobaGradientButton";
import { formatName } from "../../utils/utils";

interface ColorTypeSelectorProps {
    animation: WaveAnimation;
    options: string[];
}

export default function ColorTypeSelector({ animation, options }: ColorTypeSelectorProps) {
    const [selected, setSelected] = useState<string>(options[0]);

    useEffect(() => {
        setSelected(options[0]);
    }, [options]);

    return (
        <div className="w-full">
            <GradientBorder>
                <div className="w-full flex flex-col items-center">
                    <div className="flex flex-wrap w-full gap-4 px-4 my-4">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className="flex-1 min-w-[calc(50%-8px)] mx-auto max-w-64 text-center text-neutral-200"
                                onClick={() => setSelected(option)}
                            >
                                <KobaGradientButton text={formatName(option)} isSelected={selected == option} />
                            </div>
                        ))}
                    </div>
                    <div className="w-[80%] mb-4">
                        <KobaHorizontalLine />
                    </div>
                    <div className="flex w-full">
                        <ColorPickerSwitcher background={false} colors={animation.colors[selected]} onChange={(stops) => {
                            animation.colors[selected] = stops;
                        }} />
                    </div>
                </div>
            </GradientBorder>
        </div>
    )
}