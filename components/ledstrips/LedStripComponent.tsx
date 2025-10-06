'use client';

import { LedStrip } from "../../utils/types";
import CheckBox from "../CheckBox";
import React from "react";

interface LedStripComponentProps {
	ledStrip: LedStrip;
	selected: boolean;
	onClick?: () => void;
	onPowerToggle?: () => void;
}

// ${ledstrip.power ? '' : 'line-through'} decoration-1 md:decoration-2
interface LedStripComponentProps {
	ledStrip: LedStrip;
	selected: boolean;
	onClick?: () => void;
	onPowerToggle?: () => void;
}

export default function LedStripComponent({
	ledStrip,
	selected,
	onClick,
	onPowerToggle
}: LedStripComponentProps) {
	return (
		<div onClick={onClick} className="p-3 rounded-md ml-4 mr-4 relative items-center group/hoverShadow cursor-pointer">
			{ledStrip.power && (<div className="absolute h-full w-full top-0 left-0 bottom-0 rounded-md bg-gradient-to-r from-blue-600/20 to-purple-500/20" />)}

			{/* Power off overlay - BUT with pointer-events-none and higher z-index on checkbox */}
			{!ledStrip.power && !selected && (
				<div className="absolute h-full w-full top-0 left-0 bottom-0 rounded-md bg-neutral-800/50 z-5 pointer-events-none" />
			)}

			{/* Hover effect */}
			<div className="absolute h-full w-full top-0 left-0 bottom-0 group-hover/hoverShadow:bg-black/15 duration-200 rounded-md z-0 pointer-events-none" />

			{/* Selected background */}
			{selected && (
				<div className="absolute top-0 left-0 right-0 bottom-0 bg-cyan-400/20  rounded-md z-0 pointer-events-none" />
			)}

			{/* Vertical Line */}
			<div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-800 rounded-tl-xl rounded-bl-xl z-1" />

			{/* Content */}
			<div className="ml-3 flex flex-row items-center justify-between gap-4 relative z-2 h-full">
				{/* Left group: name + brightness */}
				<div className="flex items-baseline gap-3 overflow-hidden whitespace-nowrap text-ellipsis">
					<label className={`text-neutral-200 text-lg z-2 min-w-0 w-full relative truncate max-w-full ${selected ? 'font-bold' : 'font-normal'}`}>
						{ledStrip.name}
					</label>
					<label className="text-neutral-300 text-sm text-left z-2">
						p{ledStrip.pin}
					</label>
				</div>

				{/* Right: Checkbox - Moved outside the overlay */}
				<div className="flex-shrink-0 z-10 relative"> {/* Increased z-index */}
					<CheckBox isChecked={ledStrip.power} onClick={onPowerToggle} />
				</div>
			</div>
		</div>
	);
}
