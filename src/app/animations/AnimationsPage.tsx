import { useCallback, useState } from "react";
import Navbar from "../navbar";
import { Animation, LedStrip } from "../../../utils/types";
import AnimationsBox from "../../../components/animations/AnimationsBox";
import { getAudioAnimations, getIdleAnimations } from "./animations";
import AnimationsSettings from "../../../components/animations/AnimationsSettings";
import KobaHorizontalLine from "../../../components/KobaHorizontalLine";
// import AnimationsAudioBox from "../../../components/animations-audio-box";

interface AnimationsPageProps {
    selectedLedStrip: LedStrip;
    onSelect: (animation: Animation) => void;
    onChange: (animation: Animation) => void;
}

export default function AnimationsPage({ selectedLedStrip, onSelect, onChange }: AnimationsPageProps) {
    const opened = selectedLedStrip.animation < 100 ? 'idle' : 'audio';
    const [menu, setMenu] = useState<'idle' | 'audio' | 'settings'>(opened);

    if (!selectedLedStrip) return <div className="text-white text-xl">No selected LedStrip? How did you do that???</div>

    const idleAnimations = getIdleAnimations();
    const audioAnimations = getAudioAnimations();

    return (
        <div className="w-full">
            <Navbar options={[
                { name: "Idle", isSelected: menu === 'idle', onClick: () => { setMenu('idle') } },
                { name: "Audio", isSelected: menu === 'audio', onClick: () => { setMenu('audio') } },
                { name: "Settings", isSelected: menu === 'settings', onClick: () => { setMenu('settings') } },
            ]} />

            <KobaHorizontalLine />

            {(menu === 'idle' || menu === 'audio') && (
                // Boxba nincs onChange, nem állít ott úgysem settingset
                <div className="flex w-full">
                    <AnimationsBox
                        selectedLedStrip={selectedLedStrip}
                        animations={menu === 'idle' ? idleAnimations : audioAnimations}
                        onSelect={(animation) => onSelect(animation)}
                    // onChange={(ledStrip, animation) => onChange(ledStrip, animation)}
                    />
                </div>
            )}
            {menu === 'settings' && (
                <AnimationsSettings
                    selectedLedStrip={selectedLedStrip}
                    onChange={onChange}
                />
            )}

            <div className="fixed bottom-[6rem] max-w-150 w-full">
                <KobaHorizontalLine />
            </div>
        </div>
    );
}