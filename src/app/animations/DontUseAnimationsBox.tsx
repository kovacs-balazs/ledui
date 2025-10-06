'use client'

import { useEffect, useRef, useState } from "react"
import AnimationComponent from "../../../components/animations/AnimationComponent"
import { getAudioAnimations, getIdleAnimations } from "./animations";
import { Animation, LedStrip } from "../../../utils/types";

interface AnimationBoxProps {
    ledStrip: LedStrip
    onChange: (animation: Animation) => void;
    className?: string;
}
export default function AnimationBox({ ledStrip, onChange, className }: AnimationBoxProps) {
    const [isActive, setIsActive] = useState<'idle' | 'audio'>('idle');

    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({ left: '0%', width: '50%' });

    // Update slider position when active tab changes
    useEffect(() => {
        if (!containerRef.current) return;

        const children = Array.from(containerRef.current.children) as HTMLElement[];
        // A children[0] a slider, children[1] a flex konténer → ezért:
        const flexContainer = children[1] as HTMLElement;
        if (!flexContainer || flexContainer.children.length < 2) return;

        const activeIndex = isActive === 'idle' ? 0 : 1;
        const activeChild = flexContainer.children[activeIndex] as HTMLElement;
        const container = containerRef.current;

        // Mérjük a gomb pozícióját a px-12 konténerhez képest
        const left = ((activeChild.offsetLeft + flexContainer.offsetLeft) / container.offsetWidth) * 100;
        const width = (activeChild.offsetWidth / container.offsetWidth) * 100;

        setSliderStyle({ left: `${left}%`, width: `${width}%` });
    }, [isActive]);


    const idleAnimations: Record<number, string> = getIdleAnimations();
    const audioAnimations: Record<number, string> = getAudioAnimations();

    return (
        <div className={`flex ${className}`}>
            {/* Bounding Box */}
            <div className="w-screen sm:w-100 sm:overflow-hidden sm:rounded-3xl sm:bg-gradient-to-br from-neutral-800 to-slate-900">
                {/* Title Bar */}
                <div className="relative">
                    <div ref={containerRef} className="px-12 py-2">
                        {/* background slide */}
                        <div
                            className="absolute h-12 rounded-2xl bg-blue-800 transition-all duration-300 ease-in-out z-0"
                            style={{
                                left: sliderStyle.left,
                                width: sliderStyle.width,
                            }}
                        />

                        <div className="flex gap-12 relative z-10">
                            <div className={`flex-1 flex items-center justify-center h-12 text-neutral-200 rounded-2xl duration-300 cursor-pointer
                            ${isActive === 'idle' ? 'text-2xl font-semibold' : 'text-xl text-neutral-300 hover:text-white hover:bg-blue-800/10'}
                            `}
                                onClick={() => setIsActive("idle")}>
                                Idle
                            </div>
                            <div className={`flex-1 flex items-center justify-center h-12 text-neutral-200 rounded-2xl duration-300 cursor-pointer
                            ${isActive === 'audio' ? 'text-2xl font-semibold' : 'text-xl text-neutral-300 hover:text-white hover:bg-blue-800/10'}
                            `}
                                onClick={() => setIsActive("audio")}>
                                Audio
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area — responsive padding p-4 sm:p-6 */}
                <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar h-fit max-h-81 sm:max-h-screen sm:h-138 p-4 sm:p-6">
                    {Object.keys(isActive === 'idle' ? idleAnimations : audioAnimations)
                        .map(k => (<AnimationComponent
                            key={k}
                            animation={{ "id": parseInt(k) }}
                            selected={ledStrip !== null && ledStrip.animation === parseInt(k)}
                            onClick={(animation) => { onChange(animation) }}
                        />))}
                </div>
            </div>
        </div>
    )
}