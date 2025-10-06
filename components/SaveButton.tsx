interface SaveButtonProps {
    onClick: () => void;
    className?: string;
}

export default function SaveButton({onClick, className}: SaveButtonProps) {
    return (
        <div className={`flex h-12 w-28 text-neutral-200 text-xl font-medium rounded-lg items-center justify-center mt-10 sm:mt-30 ${className}
                                bg-gradient-to-r from-blue-800 to-violet-950
                                transition-all duration-300 ease-out
                                sm:hover:shadow-xl sm:hover:shadow-indigo-800/40
                                active:scale-80 active:shadow-lg
                                focus:outline-none `}>
            <button className="inline-flex items-center" onClick={onClick}>
                <svg className="mr-2 w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                </svg>
                Save
            </button>
        </div>
    )
}