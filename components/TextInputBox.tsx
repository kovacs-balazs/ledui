'use client'

import React from 'react';

interface InputBoxProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (value: string) => void;
    className?: string;
}

export default function TextInputBox({
    label,
    placeholder = '',
    value,
    onChange,
    onSubmit,
    className = '',
}: InputBoxProps) {
    return (
        <div className={`flex flex-col gap-1/2 ${className} relative`}>
            {label && (
                <p className="text-lg text-neutral-200 italic text-left ml-2 mb-1">
                    {label}
                </p>
            )}
            <form onSubmit={(e) => {e.preventDefault(); onSubmit(value)}}>
                <input
                    type="text"
                    value={value}
                    className={`text-neutral-300 bg-gradient-to-br from-neutral-700 to-gray-800 border border-gray-300 rounded-xl p-2 h-10 text-md sm:text-lg w-56 input disable-spin focus:outline-none focus:ring-2 focus:ring-blue-300`}
                    onChange={(e) => onChange(e)}
                    placeholder={placeholder}
                    onBlur={() => (onSubmit(value))}
                    aria-label={label || placeholder}
                />
            </form>
        </div>
    );
}