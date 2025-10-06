const idleAnimations: Record<number, string> = {
    0: "Solid",
    1: "Wave",
    2: "Reversed Wave",
    3: "Bounce Wave",
} as const;

const audioAnimations: Record<number, string> = {
    100: "Basic Bass",
    101: "High Frequency"
} as const;

export function getIdleAnimations(): Record<number, string> {
    return idleAnimations;
}

export function getAudioAnimations(): Record<number, string> {
    return audioAnimations;
}

export function getAnimations(): Record<number, string> {
    return {
        ...idleAnimations,
        ...audioAnimations,
    };
}

export function getAnimationName(id: number): string {
    return getAnimations()[id];
}