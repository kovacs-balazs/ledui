// components/ColorPicker.tsx
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { GradientStop, HSVColor, RGBColor } from '../../utils/types';
import { hexToHsv, hexToRgb, hsvToRgb, rgbToHex } from '../../utils/colors';

// Custom hook a color pickerhez
const useColorPicker = (initialColor: HSVColor = { h: 0, s: 100, v: 100 }) => {
    const stableInitialColor = useMemo(() => initialColor, [
        initialColor.h,
        initialColor.s,
        initialColor.v
    ]);

    const [color, setColor] = useState<HSVColor>(stableInitialColor);
    const isDraggingRef = useRef(false);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        setColor(initialColor);
    }, [initialColor.h, initialColor.s, initialColor.v]);

    // Debounced color update requestAnimationFrame-el
    const updateColor = useCallback((newColor: Partial<HSVColor>) => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
            setColor(prev => ({ ...prev, ...newColor }));
            rafIdRef.current = null;
        });
    }, []);

    // Drag start
    const startDrag = useCallback(() => {
        isDraggingRef.current = true;
    }, []);

    // Drag end
    const endDrag = useCallback(() => {
        isDraggingRef.current = false;
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }
    }, []);

    // Color change during drag
    const handleColorChange = useCallback((newColor: Partial<HSVColor>) => {
        if (!isDraggingRef.current) return;
        updateColor(newColor);
    }, [updateColor]);

    const rgbColor = hsvToRgb(color.h, color.s, color.v);
    const hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);

    return {
        color,
        rgbColor,
        hexColor,
        setColor,
        startDrag,
        endDrag,
        handleColorChange
    };
};

// Hue Slider Komponens
interface HueSliderProps {
    hue: number;
    onHueChange: (hue: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

// Hue Slider Komponens - tap and drag
const HueSlider: React.FC<HueSliderProps> = ({
    hue,
    onHueChange,
    onDragStart,
    onDragEnd
}) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

    const calculateHue = useCallback((clientX: number) => {
        if (!sliderRef.current) return hue;

        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        return Math.round(percentage * 360);
    }, [hue]);

    // Touch start - both tap and drag
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        isDraggingRef.current = true;
        onDragStart?.();

        const touch = e.touches[0];
        if (touch) {
            const newHue = calculateHue(touch.clientX);
            onHueChange(newHue);
        }
    }, [calculateHue, onHueChange, onDragStart]);

    // Touch move - drag only
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (!isDraggingRef.current) return;

        const touch = e.touches[0];
        if (touch) {
            const newHue = calculateHue(touch.clientX);
            onHueChange(newHue);
        }
    }, [calculateHue, onHueChange]);

    // Touch end
    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        isDraggingRef.current = false;
        onDragEnd?.();
    }, [onDragEnd]);

    // Mouse events
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isDraggingRef.current = true;
        onDragStart?.();

        const newHue = calculateHue(e.clientX);
        onHueChange(newHue);

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const newHue = calculateHue(e.clientX);
            onHueChange(newHue);
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            onDragEnd?.();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [calculateHue, onHueChange, onDragStart, onDragEnd]);

    return (
        <div className="relative">
            <div
                ref={sliderRef}
                className="h-6 w-full rounded-md cursor-pointer relative touch-none select-none"
                style={{
                    background: `linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)`,
                    touchAction: 'none'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
            </div>
            <div
                className="absolute top-1/2 w-2 h-6 bg-white rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(hue / 360) * 100}%` }}
            />
        </div>
    );
};

// Saturation-Brightness Picker Komponens
interface SaturationBrightnessPickerProps {
    hue: number;
    saturation: number;
    brightness: number;
    onSaturationBrightnessChange: (s: number, v: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

const SaturationBrightnessPicker: React.FC<SaturationBrightnessPickerProps> = ({
    hue,
    saturation,
    brightness,
    onSaturationBrightnessChange,
    onDragStart,
    onDragEnd
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

    const calculateSaturationBrightness = useCallback((clientX: number, clientY: number) => {
        if (!containerRef.current) return { s: saturation, v: brightness };

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

        const s = Math.round((x / rect.width) * 100);
        const v = Math.round(100 - (y / rect.height) * 100);

        return { s, v };
    }, [saturation, brightness]);

    // Touch start - both tap and drag
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        isDraggingRef.current = true;
        onDragStart?.();

        const touch = e.touches[0];
        if (touch) {
            const { s, v } = calculateSaturationBrightness(touch.clientX, touch.clientY);
            onSaturationBrightnessChange(s, v);
        }
    }, [calculateSaturationBrightness, onSaturationBrightnessChange, onDragStart]);

    // Touch move - drag only
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (!isDraggingRef.current) return;

        const touch = e.touches[0];
        if (touch) {
            const { s, v } = calculateSaturationBrightness(touch.clientX, touch.clientY);
            onSaturationBrightnessChange(s, v);
        }
    }, [calculateSaturationBrightness, onSaturationBrightnessChange]);

    // Touch end
    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        isDraggingRef.current = false;
        onDragEnd?.();
    }, [onDragEnd]);

    // Mouse events
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isDraggingRef.current = true;
        onDragStart?.();

        const { s, v } = calculateSaturationBrightness(e.clientX, e.clientY);
        onSaturationBrightnessChange(s, v);

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const { s, v } = calculateSaturationBrightness(e.clientX, e.clientY);
            onSaturationBrightnessChange(s, v);
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            onDragEnd?.();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [calculateSaturationBrightness, onSaturationBrightnessChange, onDragStart, onDragEnd]);

    const backgroundColor = `hsl(${hue}, 100%, 50%)`;

    const currentColor = hsvToRgb(hue, saturation, brightness);

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="w-full h-48 relative rounded-lg cursor-crosshair touch-none select-none"
                style={{
                    background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${backgroundColor})`,
                    touchAction: 'none'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="absolute w-6 h-6 border-2 border-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `${saturation}%`,
                        top: `${100 - brightness}%`,
                        background: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
                    }}
                />
            </div>
        </div>
    );
};

// Fő Color Picker Komponens
interface ColorPickerProps {
    background?: boolean;
    initialColor?: HSVColor;
    onChange?: (stops: GradientStop[]) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    background = true,
    initialColor = { h: 0, s: 100, v: 100 },
    onChange
}) => {
    const {
        color,
        rgbColor,
        hexColor,
        setColor,
        startDrag,
        endDrag,
        handleColorChange
    } = useColorPicker(initialColor);

    const [hexInputValue, setHexInputValue] = useState<string>(hexColor);

    // Update local hex input when hexColor changes (e.g., from other inputs)
    useEffect(() => {
        setHexInputValue(hexColor);
    }, [hexColor]);

    // Helper function to trigger onChange
    const triggerOnChange = useCallback((newColor: HSVColor, newRgb: RGBColor, newHex: string) => {
        // onChange?.(newColor, newRgb, newHex);
        onChange?.([{"position": 0, "color": newHex}, {"position": 100, "color": newHex}]);
    }, [onChange]);

    const handleRChange = useCallback((r: number) => {
        if (isNaN(r))
            r = 0;
        r = Math.min(Math.max(r, 0), 255);
        const newRgb = { ...rgbColor, r };
        const newHsv = hexToHsv(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setColor(newHsv);
        triggerOnChange(newHsv, newRgb, rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }, [rgbColor, triggerOnChange, setColor]);

    const handleGChange = useCallback((g: number) => {
        if (isNaN(g))
            g = 0;
        g = Math.min(Math.max(g, 0), 255);
        const newRgb = { ...rgbColor, g };
        const newHsv = hexToHsv(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setColor(newHsv);
        triggerOnChange(newHsv, newRgb, rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }, [rgbColor, triggerOnChange, setColor]);

    const handleBChange = useCallback((b: number) => {
        if (isNaN(b))
            b = 0;
        b = Math.min(Math.max(b, 0), 255);
        const newRgb = { ...rgbColor, b };
        const newHsv = hexToHsv(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setColor(newHsv);
        triggerOnChange(newHsv, newRgb, rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }, [rgbColor, triggerOnChange, setColor]);

    // HEX input handler
    const handleHexChange = useCallback((hex: string) => {
        let newHex = hex.startsWith('#') ? hex : `#${hex}`;
        newHex = newHex.replace(/[^#0-9A-Fa-f]/g, '').trim().toUpperCase();

        if (newHex.length > 7) {
            newHex = newHex.substring(0, 7);
        }

        setHexInputValue(newHex);
        if (/^#([A-Fa-f0-9]{6})$/.test(newHex)) {
            const rgb = hexToRgb(newHex);
            if (rgb) {
                const newHsv = hexToHsv(newHex);
                setColor(newHsv);
                triggerOnChange(newHsv, rgb, newHex);
            }
        }
    }, [triggerOnChange, setColor]);

    const handleHueChange = useCallback((h: number) => {
        const newColor = { ...color, h };
        const newRgb = hsvToRgb(newColor.h, newColor.s, newColor.v);
        const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        handleColorChange({ h });
        triggerOnChange(newColor, newRgb, newHex);
    }, [color, handleColorChange, triggerOnChange]);

    const handleSaturationBrightnessChange = useCallback((s: number, v: number) => {
        const newColor = { ...color, s, v };
        const newRgb = hsvToRgb(newColor.h, newColor.s, newColor.v);
        const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        handleColorChange({ s, v });
        triggerOnChange(newColor, newRgb, newHex);
    }, [color, handleColorChange, triggerOnChange]);

    const backgroundString = background ? "bg-gradient-to-br from-neutral-700/80 to-gray-800/50" : "bg-transparent"

    return (
        <div className={`flex flex-col gap-4 pb-4 rounded-lg shadow-md max-w-md mx-auto ${backgroundString} h-fit`}>
            <div className="flex justify-center items-center gap-3">
                <div
                    className="w-full h-8 rounded-lg border border-gray-300 shadow-sm"
                    style={{ backgroundColor: hexColor }}
                />
            </div>

            <div className="relative">
                <SaturationBrightnessPicker
                    hue={color.h}
                    saturation={color.s}
                    brightness={color.v}
                    onSaturationBrightnessChange={handleSaturationBrightnessChange}
                    onDragStart={startDrag}
                    onDragEnd={endDrag}
                />
            </div>

            <div className="relative">
                <HueSlider
                    hue={color.h}
                    onHueChange={handleHueChange}
                    onDragStart={startDrag}
                    onDragEnd={endDrag}
                />
            </div>

            <div className="flex flex-row justify-around gap-2">
                <div className="flex flex-col items-center w-20 mr-6">
                    <input
                        type="text"
                        value={hexInputValue}
                        onChange={(e) => handleHexChange(e.target.value)}
                        maxLength={7}
                        className="w-full px-2 py-1 text-center text-sm border text-neutral-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent disable-spin"
                    />
                    <label className="text-xs font-medium text-neutral-300 mt-1">HEX</label>
                </div>

                <div className="flex flex-col items-center w-12">
                    <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbColor.r > 0 ? String(rgbColor.r).replace(/^0+/, '') : 0}
                        onChange={(e) => handleRChange(parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-center text-sm border border-gray-300 rounded-md text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent disable-spin"
                    />
                    <label className="text-xs font-medium text-neutral-300 mt-1">R</label>
                </div>

                <div className="flex flex-col items-center w-12">
                    <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbColor.g > 0 ? String(rgbColor.g).replace(/^0+/, '') : 0}
                        onChange={(e) => handleGChange(parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-center text-sm border border-gray-300 rounded-md text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent disable-spin"
                    />
                    <label className="text-xs font-medium text-neutral-300 mt-1">G</label>
                </div>

                <div className="flex flex-col items-center w-12">
                    <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbColor.b > 0 ? String(rgbColor.b).replace(/^0+/, '') : 0}
                        onChange={(e) => handleBChange(parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-center text-sm border border-gray-300 rounded-md text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent disable-spin"
                    />
                    <label className="text-xs font-medium text-neutral-300 mt-1">B</label>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;