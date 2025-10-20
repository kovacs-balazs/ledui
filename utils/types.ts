export interface Animation {
    id: number;
}

export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

export interface HSVColor {
    h: number; // 0-360
    s: number; // 0-100
    v: number; // 0-100
}

export interface GradientStop {
    color: string;
    position: number;
}

// export interface Gradient {
//     colors: GradientStop[];
// }

export interface SolidAnimation extends Animation {
    id: number;
    colors: GradientStop[];
}

export interface WaveAnimation extends Animation {
    id: number;
    length: number;
    distance: boolean;
    speed: number;
    colors: {
        foreground: GradientStop[];
        background: GradientStop[];
    };
}

export interface ReverseWaveAnimation extends Animation {
    id: number;
    length: number;
    distance: boolean;
    speed: number;
    colors: GradientStop[];
}

export interface BounceWaveAnimation extends Animation {
    id: number;
    length: number;
    speed: number; // 0-100
    colors: GradientStop[];
}

export interface AudioBassAnimation extends Animation {
    id: number;
    decibelThreshold: number;
    fadeOut: number; // millis
    colors: GradientStop[];
}

export interface AudioHighFrequencyAnimation extends Animation {
    id: number;
    decibelThreshold: number;
    maxFrequency: number;
    colors: GradientStop[];
}

export interface ColorPickerRgb {
    r: number;
    g: number;
    b: number;
}

export interface LedStrip {
    id: number;
    name: string;
    pin: number,
    ledCount: number;
    power: boolean;
    animation: number;
    animations: Animation[];
    // color: LedStripColor;
}
