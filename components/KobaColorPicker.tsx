'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColorPickerRgb } from "../utils/types";
import Color from "color";

interface ColorPickerProps {
    color?: string;
    onChange?: (colorHex: string) => void;
}

export default function KobaColorPicker({ color, onChange }: ColorPickerProps) {
    const [hue, setHue] = useState<number>(0);
    const [saturation, setSaturation] = useState<number>(100);
    const [brightness, setBrightness] = useState<number>(100);
    const [rgb, setRgb] = useState<ColorPickerRgb>({ r: 255, g: 0, b: 0 });
    const [hex, setHex] = useState<string>("#FF0000");

    const hueRef = useRef<HTMLDivElement | null>(null);
    const sbRef = useRef<HTMLDivElement | null>(null);

    // Guards to avoid emit / prop echo loops
    const lastEmittedHexRef = useRef<string | null>(null);
    const lastPropHexRef = useRef<string | null>(null);

    // Parse incoming prop once (memoized) to avoid recreating Color objects and to get canonical hex/hsv/rgb
    const parsedProp = useMemo(() => {
        if (!color) return null;

        try {
            const c = Color(color);
            const hexValue = c.hex().toUpperCase();
            const hsv = c.hsv().object();
            return {
                colorObj: c,
                hex: hexValue,
                hsv: {
                    h: Math.round(hsv.h || 0),
                    s: Math.round(hsv.s || 0),
                    v: Math.round(hsv.v || 0)
                },
                rgb: {
                    r: Math.round(c.red()),
                    g: Math.round(c.green()),
                    b: Math.round(c.blue())
                }
            };
        } catch (e) {
            return null;
        }
    }, [color]);

    // Derived color from current HSV (memoized)
    const derivedFromHSV = useMemo(() => {
        try {
            const c = Color.hsv(hue, saturation, brightness);
            return {
                colorObj: c,
                hex: c.hex().toUpperCase(),
                rgb: {
                    r: Math.round(c.red()),
                    g: Math.round(c.green()),
                    b: Math.round(c.blue())
                }
            };
        } catch (e) {
            return null;
        }
    }, [hue, saturation, brightness]);

    // Sync incoming prop -> internal state but only when something actually changed
    useEffect(() => {
        if (!parsedProp) return;

        const { hex: propHex, hsv: propHsv, rgb: propRgb } = parsedProp;

        // If prop hex hasn't changed since last sync and matches current state, skip
        if (
            lastPropHexRef.current === propHex &&
            hex === propHex &&
            rgb.r === propRgb.r &&
            rgb.g === propRgb.g &&
            rgb.b === propRgb.b &&
            hue === propHsv.h &&
            saturation === propHsv.s &&
            brightness === propHsv.v
        ) {
            return;
        }

        lastPropHexRef.current = propHex;

        // Only update the pieces that differ
        if (hex !== propHex) setHex(propHex);
        if (rgb.r !== propRgb.r || rgb.g !== propRgb.g || rgb.b !== propRgb.b) setRgb(propRgb);
        if (hue !== propHsv.h) setHue(propHsv.h);
        if (saturation !== propHsv.s) setSaturation(propHsv.s);
        if (brightness !== propHsv.v) setBrightness(propHsv.v);
    }, [parsedProp]);

    // When user changes HSV we update hex/rgb derived values (but do NOT call onChange here)
    useEffect(() => {
        if (!derivedFromHSV) return;
        const { hex: newHex, rgb: newRgb } = derivedFromHSV;
        if (newHex !== hex) setHex(newHex);
        if (newRgb.r !== rgb.r || newRgb.g !== rgb.g || newRgb.b !== rgb.b) setRgb(newRgb);
    }, [derivedFromHSV]);

    // Emit change to parent but guard repeated identical emits
    const emitChange = useCallback((cObj: Color) => {
        try {
            const hexValue = cObj.hex().toUpperCase();
            if (lastEmittedHexRef.current === hexValue) return;
            lastEmittedHexRef.current = hexValue;
            onChange?.(hexValue);
        } catch (e) {
            // ignore
        }
    }, [onChange]);

    const blurActiveElement = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    };

    // Handlers use local color creation (not relying on derivedFromHSV which is memoized for rendering)
    const handleHueChange = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if (!hueRef.current) return;
        const rect = hueRef.current.getBoundingClientRect();
        let x: number;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }

        x = Math.max(0, Math.min(rect.width, x));
        const newHue = Math.round((x / rect.width) * 360);
        setHue(newHue);

        try {
            const c = Color.hsv(newHue, saturation, brightness);
            emitChange(c);
        } catch (e) {
            // ignore
        }
    };

    const handleSBChange = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if (!sbRef.current) return;
        const rect = sbRef.current.getBoundingClientRect();
        let x: number, y: number;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        x = Math.max(0, Math.min(rect.width, x));
        y = Math.max(0, Math.min(rect.height, y));

        const newSaturation = Math.round((x / rect.width) * 100);
        const newBrightness = Math.round(100 - (y / rect.height) * 100);

        setSaturation(newSaturation);
        setBrightness(newBrightness);

        try {
            const c = Color.hsv(hue, newSaturation, newBrightness);
            emitChange(c);
        } catch (e) {
            // ignore
        }
    };

    // Mouse / Touch wiring
    const handleHueMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        blurActiveElement();
        handleHueChange(e);
        const handleMouseMove = (moveEvent: MouseEvent) => handleHueChange(moveEvent);
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleHueTouchStart = (e: React.TouchEvent) => {
        blurActiveElement();
        handleHueChange(e);
        const handleTouchMove = (moveEvent: TouchEvent) => handleHueChange(moveEvent);
        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };

    const handleSBMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        blurActiveElement();
        handleSBChange(e);
        const handleMouseMove = (moveEvent: MouseEvent) => handleSBChange(moveEvent);
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleSBTouchStart = (e: React.TouchEvent) => {
        blurActiveElement();
        handleSBChange(e);
        const handleTouchMove = (moveEvent: TouchEvent) => handleSBChange(moveEvent);
        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };

    // RGB handling
    const saveRgb = (newRgb: ColorPickerRgb) => {
        try {
            const c = Color.rgb(newRgb.r, newRgb.g, newRgb.b);
            const hsv = c.hsv().object();
            const newHue = hsv.h || 0;
            const newS = hsv.s || 0;
            const newV = hsv.v || 0;
            const newHex = c.hex().toUpperCase();

            if (rgb.r !== newRgb.r || rgb.g !== newRgb.g || rgb.b !== newRgb.b) setRgb(newRgb);
            if (hue !== newHue) setHue(newHue);
            if (saturation !== newS) setSaturation(newS);
            if (brightness !== newV) setBrightness(newV);
            if (hex !== newHex) setHex(newHex);

            emitChange(c);
        } catch (e) {
            // ignore invalid
        }
    };

    const handleRgbChange = (channel: 'r' | 'g' | 'b', rawValue: string) => {
        const cleaned = rawValue.replace(/[^0-9]/g, '');
        const num = cleaned === '' ? 0 : parseInt(cleaned, 10);
        const clamped = Math.min(Math.max(isNaN(num) ? 0 : num, 0), 255);
        const newRgb = { ...rgb, [channel]: clamped };
        setRgb(newRgb); // immediate UI feedback
        saveRgb(newRgb);
    };

    // HEX handling
    const saveHex = (hexColor: string) => {
        try {
            const c = Color(hexColor);
            const hsv = c.hsv().object();
            const newHue = hsv.h || 0;
            const newS = hsv.s || 0;
            const newV = hsv.v || 0;
            const newRgb = {
                r: Math.round(c.red()),
                g: Math.round(c.green()),
                b: Math.round(c.blue())
            };

            if (hex !== hexColor) setHex(hexColor.toUpperCase());
            if (rgb.r !== newRgb.r || rgb.g !== newRgb.g || rgb.b !== newRgb.b) setRgb(newRgb);
            if (hue !== newHue) setHue(newHue);
            if (saturation !== newS) setSaturation(newS);
            if (brightness !== newV) setBrightness(newV);

            emitChange(c);
        } catch (e) {
            // ignore
        }
    };

    const handleHexChange = (value: string) => {
        let newHex = value.startsWith('#') ? value : `#${value}`;
        newHex = newHex.replace(/[^#0-9A-Fa-f]/g, '').toUpperCase().trim();
        if (newHex.length > 7) newHex = newHex.substring(0, 7);
        setHex(newHex);
        if (/^#[0-9A-F]{6}$/i.test(newHex)) {
            saveHex(newHex);
        }
    };

    const huePosition = (hue / 360) * 100;
    const sbPosition = {
        left: (saturation / 100) * 100,
        top: 100 - (brightness / 100) * 100
    };

    return (
        <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md w-full max-w-xs relative overflow-hidden bg-linear-to-br from-blue-900/50 to-purple-900/50">
            <div className="flex justify-center items-center gap-3">
                <div
                    className="w-full h-8 rounded-lg border border-gray-300 shadow-sm"
                    style={{ backgroundColor: hex }}
                />
            </div>

            <div className="relative">
                <div
                    ref={sbRef}
                    className="w-full h-50 rounded-lg cursor-pointer relative overflow-hidden"
                    style={{
                        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
                    }}
                    onMouseDown={handleSBMouseDown}
                    onTouchStart={handleSBTouchStart}
                >
                    <div
                        className="absolute w-4 h-4 rounded-lg border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ left: `${sbPosition.left}%`, top: `${sbPosition.top}%` }}
                    />
                </div>
            </div>

            <div className="relative">
                <div
                    ref={hueRef}
                    className="w-full h-6 rounded cursor-pointer relative overflow-hidden"
                    style={{
                        background: `linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)`
                    }}
                    onMouseDown={handleHueMouseDown}
                    onTouchStart={handleHueTouchStart}
                />
                <div
                    className="absolute top-1/2 w-2 h-6 bg-white rounded shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${huePosition}%` }}
                />
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-neutral-200 w-8">HEX</label>
                <input
                    type="text"
                    value={hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    maxLength={7}
                    className="flex-1 px-3 py-2 text-sm border text-neutral-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2 rounded-md p-1 justify-start">
                    <label className="text-sm font-medium text-neutral-200 w-2">R</label>
                    <input
                        type="number"
                        min={0}
                        max={255}
                        value={String(rgb.r)}
                        onChange={(e) => handleRgbChange('r', e.target.value)}
                        className="text-center disable-spin w-16 px-2 py-1 text-sm border border-gray-300 rounded-md text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent"
                    />
                </div>

                <div className="flex items-center gap-2 rounded-md p-1 justify-center">
                    <label className="text-sm font-medium text-neutral-200 w-2">G</label>
                    <input
                        type="number"
                        min={0}
                        max={255}
                        value={String(rgb.g)}
                        onChange={(e) => handleRgbChange('g', e.target.value)}
                        className="text-center disable-spin w-16 px-2 py-1 text-sm border border-gray-300 rounded-md text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent"
                    />
                </div>

                <div className="flex items-center gap-2 rounded-md p-1 justify-end">
                    <label className="text-sm font-medium text-neutral-200 w-2">B</label>
                    <input
                        type="number"
                        min={0}
                        max={255}
                        value={String(rgb.b)}
                        onChange={(e) => handleRgbChange('b', e.target.value)}
                        className="text-center disable-spin w-16 px-2 py-1 text-sm border border-gray-300 rounded-md text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent"
                    />
                </div>
            </div>
        </div>
    );
}
