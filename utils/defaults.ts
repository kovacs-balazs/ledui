import { SolidAnimation, WaveAnimation, ReverseWaveAnimation, BounceWaveAnimation, AudioBassAnimation, AudioHighFrequencyAnimation, LedStrip, Animation } from "./types";

// export const createDefaultAnimation = (id: number): Animation => ({
//   id
// });

export const createDefaultSolidAnimation = (): SolidAnimation => ({
    id: 0,
    colors: [255, 255, 255] // white by default
});

export const createDefaultWaveAnimation = (): WaveAnimation => ({
    id: 1,
    length: 10,
    distance: false,
    speed: 50,
    colors: [255, 0, 0]
});

export const createDefaultReverseWaveAnimation = (): ReverseWaveAnimation => ({
    id: 2,
    length: 10,
    distance: false,
    speed: 50,
    colors: [255, 0, 0]
});

export const createDefaultBounceWaveAnimation = (): BounceWaveAnimation => ({
    id: 3,
    length: 10,
    speed: 50,
    colors: [255, 0, 0]
});

export const createDefaultAudioBassAnimation = (): AudioBassAnimation => ({
    id: 100,
    decibelThreshold: -40,
    fadeOut: 500,
    colors: [255, 0, 0]
});

export const createDefaultAudioHighFrequencyAnimation = (): AudioHighFrequencyAnimation => ({
    id: 101,
    decibelThreshold: -20,
    maxFrequency: 8000,
    colors: [255, 0, 0]
});

export const createDefaultLedStrip = (id: number): LedStrip => ({
    id,
    name: `New LedStrip (${id})`,
    pin: 0,
    ledCount: 0,
    power: false,
    animation: 0,
    animations: [
        // idle
        createDefaultSolidAnimation(),
        createDefaultWaveAnimation(),
        createDefaultReverseWaveAnimation(),
        createDefaultBounceWaveAnimation(),

        // Audio
        createDefaultAudioBassAnimation(),
        createDefaultAudioHighFrequencyAnimation(),
    ]
});