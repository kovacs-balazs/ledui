'use client'

import React, { useEffect, useState } from 'react';
import GradientBorder from './GradientBorder';

interface NumberInputBoxProps {
    label: string;
    value: number;
    min?: number,
    max?: number,
    // onChange?: (value: number) => void;
    onSubmit: (value: number) => void;
    inputWidth?: number;
}

export default function NumberInputBox({
    label,
    value,
    min = 0,
    max = 0,
    // onChange,
    onSubmit,
    inputWidth = 4
}: NumberInputBoxProps) {
    const [localValue, setLocalValue] = useState<number>(value);

    useEffect(() => {
        if (!isNaN(value)) {
            setLocalValue(value);
        }
    }, [value]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleanedValue = e.target.value.replace(/^0+/, "")
        const newValue = parseInt(cleanedValue, 10);

        if (!cleanedValue || isNaN(newValue)) {
            setLocalValue(0);
            return;
        }

        const clamped = max > 0 ? Math.min(Math.max(min, newValue), max) : newValue;

        setLocalValue(clamped);
        // onChange(clamped);
    };

    const handleBlur = () => {
        // Parse the value and validate
        const numValue = localValue;
        if (!isNaN(numValue)) {
            onSubmit(numValue);
        } else {
            // If invalid, reset to the last valid value
            setLocalValue(value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numValue = localValue;
        if (!isNaN(numValue)) {
            onSubmit(numValue);
        }
    };

    return (
        <div className={`flex flex-col relative items-center`}>
            {label && (
                <p className="text-lg text-neutral-200 italic text-center mb-1">
                    {label}
                </p>
            )}
            <GradientBorder>
                <div className='py-1 w-12 flex h-full'>
                    <form className='w-full' onSubmit={handleSubmit}>
                        <input
                            type="number"
                            value={localValue > 0 ? String(localValue).replace(/^0+/, '') : "0"}
                            className={`flex text-neutral-300 h-10 rounded-xl text-center text-lg inputs disable-spin w-full focus:outline-none focus:ring-2 focus:ring-blue-300`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-label={label}
                        />
                    </form>
                </div>
            </GradientBorder>
        </div>
    );
}