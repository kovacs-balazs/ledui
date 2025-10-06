'use client'

interface PremiumCheckBoxProps {
    size: number;
    isChecked: boolean;
    onClick?: () => void;
}

export default function PremiumCheckBox({ isChecked, onClick }: PremiumCheckBoxProps) {
    return (
        <div
            className={`relative flex border-2 border-gray-600/50 w-24 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 cursor-pointer overflow-hidden shadow-2xl shadow-black/40`}
            onClick={onClick}
        >
            {/* Animated Glow Background */}
            <div
                className={`absolute top-0 w-1/2 h-full transition-all duration-500 ease-out ${isChecked
                    ? 'left-0 bg-gradient-to-r from-green-400/80 via-green-500/70 to-green-600/60'
                    : 'left-1/2 bg-gradient-to-r from-red-400/80 via-red-500/70 to-red-600/60'
                    }`}
            />

            {/* Animated Glow Effect */}
            <div
                className={`absolute inset-0 rounded-xl transition-all duration-700 ease-out ${isChecked
                    ? 'shadow-[0_0_30px_10px_rgba(34,197,94,0.3)]'
                    : 'shadow-[0_0_30px_10px_rgba(239,68,68,0.3)]'
                    }`}
            />

            {/* Moving Glint/Shine Effect */}
            <div
                className={`absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 transition-all duration-1000 ease-in-out ${isChecked ? 'left-[-100px]' : 'left-[100px]'}`}
            />

            {/* Subtle Pulse Animation */}
            <div
                className={`absolute inset-0 rounded-xl animate-pulse ${isChecked ? 'bg-green-500/10' : 'bg-red-500/10'}`}
            />

            {/* On Text with Premium Styling */}
            <div className="relative flex-1 flex items-center justify-center z-10">
                <span className={`text-base font-bold transition-all duration-300 transform ${isChecked
                    ? 'text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] scale-110'
                    : 'text-gray-400/70 scale-100'
                    }`}>
                    On
                </span>
            </div>

            {/* Off Text with Premium Styling */}
            <div className="relative flex-1 flex items-center justify-center z-10">
                <span className={`text-base font-bold transition-all duration-300 transform ${!isChecked
                    ? 'text-white drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-110'
                    : 'text-gray-400/70 scale-100'}`}>
                    Off
                </span>
            </div>

            {/* Inner Border Glow */}
            <div
                className={`absolute inset-0 rounded-xl border-2 transition-all duration-500 ${isChecked
                    ? 'border-green-400/50'
                    : 'border-red-400/50'}`}
            />
        </div>
    );
}