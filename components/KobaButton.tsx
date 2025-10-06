interface KobaButtonProps {
    label: string;
    onClick: () => void;
}

export default function KobaButton({ label, onClick }: KobaButtonProps) {
    return (

        <button className="flex w-full h-full bg-gradient-to-r from-blue-800 to-violet-950 text-neutral-200 text-xl font-medium rounded-lg items-center justify-center
                                    transition-all duration-300 ease-out
                                    sm:hover:shadow-xl sm:hover:shadow-indigo-800/40
                                    active:scale-80 active:shadow-lg
                                    focus:outline-none
                                    sm:hover:scale-110"
            onClick={onClick}
        // onTouchStart={} létezik ha kéne, telón a long pressre eventet rakni
        >
            {label}
        </button>
    );
}