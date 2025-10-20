interface GradientBorderProps {
    children: React.ReactNode;
}

export default function GradientBorder({ children }: GradientBorderProps) {
    return (
        <div className="relative w-full h-full">
            <div
                className="absolute inset-0 rounded-xl z-0 w-full"
                style={{
                    padding: '2px',
                    background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'destination-out',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                }}
            />
            <div
                className="flex items-center justify-center relative z-10"
                style={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {children}
            </div>
        </div>
    );
}