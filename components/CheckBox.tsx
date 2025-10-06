'use client'

import React from 'react';

interface CheckBoxProps {
    label?: string,
    isChecked: boolean;
    onClick?: () => void;
}

export default function CheckBox({ label = '', isChecked, onClick }: CheckBoxProps) {
    return (
        <div className='flex flex-row gap-4 items-center'>
            <label className='flex text-neutral-200 text-lg italic'>{label}</label>

            <div className={`z-[3] relative flex items-center group/checkbox gap-4`}>
                <div className={`cursor-pointer w-5 h-5 rounded
                ${isChecked ? 'bg-green-500' : 'bg-red-500'}
                border-none transition-all duration-200 z-4 scale-115 group-active/checkbox:scale-80 sm:scale-100 md:group-hover/checkbox:scale-115`}
                />
                <input
                    className="cursor-pointer w-5 h-5 opacity-0 m-0 absolute z-5"
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onClick?.()} // ← Fix: Add onChange
                    onClick={(e) => e.stopPropagation()} // ← Prevent double-trigger if needed
                    aria-checked={isChecked}
                    role="checkbox"
                />
            </div>
        </div>
    );
}