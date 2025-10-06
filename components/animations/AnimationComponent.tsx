'use client';

import React from "react";
import { Animation } from "../../utils/types";
import { getAnimationName } from "@/app/animations/animations";

interface AmimationComponentProps {
    animation: Animation;
    selected: boolean;
    onClick: (animation: Animation) => void;
}

export default function LedStripComponent({
    animation,
    selected,
    onClick,
}: AmimationComponentProps) {
    const name: string = getAnimationName(animation.id);

    return (
        <div onClick={() => onClick(animation)} className="p-3 rounded-md ml-4 mr-4 relative items-center group/hoverShadow">
            <div className="absolute h-full w-full top-0 left-0 bottom-0 rounded-md bg-gradient-to-r from-blue-600/20 to-purple-500/20" />

            {/* Ha feléviszi az egeret sötétítse el */}
            <div className="absolute h-full w-full top-0 left-0 bottom-0 group-hover/hoverShadow:bg-black/15 duration-200 rounded-md z-0 pointer-events-none" />

            {/* Átlásztó selected background */}
            {selected && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-cyan-400/20 rounded-md z-0 pointer-events-none" />
            )}

            {/* Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-800 rounded-tl-xl rounded-bl-xl z-1" />

            {/* Content */}
            <div className="ml-3 flex flex-row items-center justify-between gap-4 relative z-2 h-full">
                {/* Left group: name + brightness */}
                <div className="flex items-baseline gap-3 overflow-hidden whitespace-nowrap text-ellipsis">
                    <label className={`text-neutral-200 text-lg z-2 min-w-0 w-full relative truncate max-w-full ${selected ? 'font-bold' : 'font-normal'}`}>
                        {name}
                    </label>
                </div>
            </div>
        </div>
    );
}
