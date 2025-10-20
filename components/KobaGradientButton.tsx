interface GradientButtonProps {
    text: string;
    isSelected: boolean;
    onClick?: () => void;
}

export default function KobaGradientButton({ text, isSelected, onClick }: GradientButtonProps) {
    return (
        <div
            className="flex-1 flex flex-col items-center mx-4 group cursor-pointer"
            onClick={onClick}
        >
            <div className={`w-full py-2 rounded-xl transition-all duration-300
                        ${isSelected ? 'bg-gray-700 shadow-inner shadow-blue-400/10' : 'bg-transparent'}`}
            >
                <label className={`text-center w-full cursor-pointer transition-all duration-300
                            ${isSelected ? 'text-neutral-200' : 'text-neutral-400'}`}>
                    {text}
                </label>
            </div>

            <div className={`w-3/4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 
                        transition-all duration-300 transform origin-center -mt-1.5
                        ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50'}`}
            />
        </div>
    );
}
