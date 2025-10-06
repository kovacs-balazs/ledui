import { HSVColor, RGBColor } from "./types";

export const hsvToRgb = (h: number, s: number, v: number): RGBColor => {
    h = h % 360; // wrap hue into [0,360)
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
};

// RGB to HEX konverzió
export const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${[r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`.toUpperCase();
};

// HEX to RGB konverzió
export const hexToRgb = (hex: string): RGBColor | null => {
    // Remove the hash if present

    hex = hex.replace(/^#/, "");

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    // if (hex.length === 3) {
    //     hex = hex.split("").map(c => c + c).join("");
    // }

    if (hex.length !== 6) {
        return null; // Invalid hex
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Validate that the parsed values are valid numbers
    if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        return null; // Invalid hex
    }

    return { r, g, b };
};


export const hexToHsv = (hex: string, roundValues: boolean = false): HSVColor => {
    // --- Validáció ---
    hex = hex.replace(/^#/, "");
    // if (!/^([0-9A-Fa-f]{6})$/.test(hex)) {
    //     // throw new Error("Invalid hex color");
    //     return
    // }

    // --- Hex -> RGB [0..1] ---
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // --- Hue kiszámítása ---
    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = 60 * ((g - b) / delta);
        } else if (max === g) {
            h = 60 * ((b - r) / delta + 2);
        } else {
            h = 60 * ((r - g) / delta + 4);
        }
    }
    h = (h + 360) % 360; // mindig 0–359 között

    // --- Saturation & Value ---
    const s = max === 0 ? 0 : delta / max;
    const v = max;

    // --- Visszatérés ---
    return {
        h: roundValues ? Math.round(h) : h,
        s: roundValues ? Math.round(s * 100) : s * 100,
        v: roundValues ? Math.round(v * 100) : v * 100,
    };
};

export const hsvToHex = (h: number, s: number, v: number): string => {
    const { r, g, b } = hsvToRgb(h, s, v);
    return rgbToHex(r, g, b);
};

// Or, if you want to accept an HSVColor object:
export const hsvObjToHex = (hsv: HSVColor): string => {
    const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
    return rgbToHex(r, g, b);
};

