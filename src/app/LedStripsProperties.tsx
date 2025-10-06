'use client'

import { useEffect, useState } from "react";
import TextInputBox from "../../components/TextInputBox";
import NumberInputBox from "../../components/NumberInputBox";
import { LedStrip } from "../../utils/types";


interface LedStripPropertiesProps {
    ledStrip: LedStrip;
    onChange: (ledStrip: LedStrip) => void;
    className?: string;
}

export default function LedStripProperties({ ledStrip, onChange, className }: LedStripPropertiesProps) {
    const [name, setName] = useState<string>(ledStrip.name);
    const [pin, setPin] = useState<number>(ledStrip.pin);
    const [ledCount, setLedCount] = useState<number>(ledStrip.ledCount);

    useEffect(() => {
        if (ledStrip) {
            setName(ledStrip.name);
            setPin(ledStrip.pin);
            setLedCount(ledStrip.ledCount);
        }
    }, [ledStrip]);

    return (
        <div className={`flex flex-col gap-4 sm:gap-8 items-center w-full ${className}`}>
            {/* Name input */}
            <div>
                <TextInputBox label="Name" placeholder="Enter name..." value={name}
                    onChange={(e) => {
                        e.preventDefault();
                        setName(e.target.value);
                    }}
                    onSubmit={(text) => {
                        if (!text) text = `Unknown (ID ${ledStrip.id})`
                        setName(text);
                        ledStrip.name = text;
                        onChange(ledStrip);
                    }} />
            </div>

            <div className="flex flex-row gap-12 mt-4">
                {/* Pin number input */}
                <div>
                    <NumberInputBox label="Pin Number" value={pin}
                        onSubmit={(number) => {
                            ledStrip.pin = number;
                            onChange(ledStrip);
                        }} />
                </div>

                {/* Led count input */}
                <div>
                    <NumberInputBox label="Led Count" value={ledCount}
                        onSubmit={(number) => {
                            ledStrip.ledCount = number;
                            onChange(ledStrip);
                        }} />
                </div>
            </div>

            {/* Premium Glow & Glint Toggle */}
            <div
                className="relative flex border-2 border-gray-600/50 w-36 h-12 mt-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 cursor-pointer overflow-hidden shadow-2xl shadow-black/40"
                onClick={() => {
                    ledStrip.power = !ledStrip.power;
                    onChange(ledStrip);
                }}
            >
                {/* Animated Glow Background */}
                <div
                    className={`absolute top-0 w-1/2 h-full transition-all duration-500 ease-out ${ledStrip.power
                        ? 'left-0 bg-gradient-to-r from-green-400/80 via-green-500/70 to-green-600/60'
                        : 'left-1/2 bg-gradient-to-r from-red-400/80 via-red-500/70 to-red-600/60'
                        }`}
                />

                {/* Animated Glow Effect */}
                <div
                    className={`absolute inset-0 rounded-xl transition-all duration-700 ease-out ${ledStrip.power
                        ? 'shadow-[0_0_30px_10px_rgba(34,197,94,0.3)]'
                        : 'shadow-[0_0_30px_10px_rgba(239,68,68,0.3)]'
                        }`}
                />

                {/* Moving Glint/Shine Effect */}
                <div
                    className={`absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 transition-all duration-1000 ease-in-out ${ledStrip.power ? 'left-[-100px]' : 'left-[100px]'
                        }`}
                />

                {/* Subtle Pulse Animation */}
                <div
                    className={`absolute inset-0 rounded-xl animate-pulse ${ledStrip.power ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}
                />

                {/* On Text with Premium Styling */}
                <div className="relative flex-1 flex items-center justify-center z-10">
                    <span className={`text-lg font-bold transition-all duration-300 transform ${ledStrip.power
                        ? 'text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] scale-110'
                        : 'text-gray-400/70 scale-100'
                        }`}>
                        On
                    </span>
                </div>

                {/* Off Text with Premium Styling */}
                <div className="relative flex-1 flex items-center justify-center z-10">
                    <span className={`text-lg font-bold transition-all duration-300 transform ${!ledStrip.power
                        ? 'text-white drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-110'
                        : 'text-gray-400/70 scale-100'
                        }`}>
                        Off
                    </span>
                </div>

                {/* Inner Border Glow */}
                <div
                    className={`absolute inset-0 rounded-xl border-2 transition-all duration-500 ${ledStrip.power
                        ? 'border-green-400/50'
                        : 'border-red-400/50'
                        }`}
                />
            </div>
        </div>
    )
}


// {/* <div className="mt-24">
//     <KobaColorPicker color={'#FF0000'} onChange={(color) => {
//         // Color.rgb(ledStrip.color.r, ledStrip.color.g, ledStrip.color.b).hex()
//         // ledStrip.color = { "r": color.red(), "g": color.green(), "b": color.blue() }
//         onChange(ledStrip);
//     }} />
// </div> */}