'use client'

import React, { useState, useEffect, useMemo } from 'react';
import GradientBorder from './GradientBorder';

interface SliderProps {
    label?: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
}

function RealSlider({
    label = '',
    value,
    min = 0,
    max = 100,
    step = 1,
    onChange,
}: SliderProps) {
    const [localValue, setLocalValue] = useState(value);
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
        setLocalValue(value);
        setInputValue(value.toString());
    }, [value]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);
        setInputValue(newValue.toString());
        onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        const numValue = parseFloat(inputValue);
        if (!isNaN(numValue)) {
            const clampedValue = Math.min(Math.max(numValue, min), max);
            setLocalValue(clampedValue);
            setInputValue(clampedValue.toString());
            onChange(clampedValue);
        } else {
            setInputValue(localValue.toString());
        }
    };

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputBlur();
        }
    };

    const sliderBackground = (value: number, min: number, max: number) => {
        const percent = ((value - min) / (max - min)) * 100;
        return `linear-gradient(to right, #51a2ff 0%, #c27aff ${percent}%, #4e4e4eff ${percent}%)`;
    };

    return (
        <div className="flex flex-col w-full">
            {label && (
                <div className="text-lg text-neutral-200 italic text-center">
                    {label}
                </div>
            )}

            {/* Relative container for absolute border */}
            <div className="relative w-full h-12 rounded-xl">
                {/* Gradient "border" as absolute background */}
                <GradientBorder>
                    {/* Actual content — fully transparent, on top */}
                    <div className="relative z-10 flex items-center gap-1.5 w-full h-full bg-transparent">
                        <input
                            type="number"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onKeyDown={handleInputKeyPress}
                            min={min}
                            max={max}
                            className="ml-3 text-sm text-neutral-200 bg-transparent border-none text-center w-12 focus:outline-none focus:ring-0 disable-spin"
                        />
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={localValue}
                            onChange={handleSliderChange}
                            style={{
                                background: sliderBackground(localValue, min, max)
                            }}
                            className="mr-4 flex h-2 w-full rounded-lg appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:w-5
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-neutral-300
                          [&::-webkit-slider-thumb]:border-0
                          [&::-webkit-slider-thumb]:cursor-pointer

                          [&::-moz-range-thumb]:h-5
                          [&::-moz-range-thumb]:w-5
                          [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:bg-neutral-300
                          [&::-moz-range-thumb]:cursor-pointer
                          "/>
                    </div>
                </GradientBorder>
            </div>
        </div>
    );
}

const Slider = React.memo(RealSlider);
export default Slider;