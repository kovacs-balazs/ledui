// components/GradientPickerWithColorPicker.tsx
'use client';

import Color from 'color';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { GradientStop, RGBColor, HSVColor } from '../../utils/types';


import { converter } from "culori";
import { hexToRgb, hsvToRgb, rgbToHex } from '../../utils/colors';

const toOklch = converter("oklch");


// Custom hook a color pickerhez
const useColorPicker = (initialColor: HSVColor = { h: 0, s: 100, v: 100 }) => {
    const [color, setColor] = useState<HSVColor>(initialColor);
    const isDraggingRef = useRef(false);
    const rafIdRef = useRef<number | null>(null);

    // Debounced color update requestAnimationFrame-el
    const updateColor = useCallback((newColor: Partial<HSVColor>) => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
            setColor(prev => ({ ...prev, ...newColor }));
            rafIdRef.current = null;
        });
    }, [setColor]);

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

// Touch event kezelés
// const useTouchEvents = (
//     onStart: () => void,
//     onMove: (clientX: number, clientY: number) => void,
//     onEnd: () => void
// ) => {
//     const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
//         e.preventDefault();
//         onStart();
//     }, [onStart]);

//     const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
//         e.preventDefault();
//         const touch = e.touches[0];
//         if (touch) {
//             onMove(touch.clientX, touch.clientY);
//         }
//     }, [onMove]);

//     const handleTouchEnd = useCallback((e: React.TouchEvent | TouchEvent) => {
//         e.preventDefault();
//         onEnd();
//     }, [onEnd]);

//     return {
//         handleTouchStart,
//         handleTouchMove,
//         handleTouchEnd
//     };
// };

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
        <div className="mb-4 relative">
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
        <div className="mb-4">
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
    initialColor?: HSVColor;
    onChange?: (color: HSVColor, rgb: RGBColor, hex: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
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

    // Local state for hex input to allow temporary invalid values during typing
    const [hexInputValue, setHexInputValue] = useState<string>(hexColor);

    // Update local hex input when hexColor changes (e.g., from other inputs)
    useEffect(() => {
        setHexInputValue(hexColor);
    }, [hexColor]);

    // RGB input handlers
    const handleRChange = useCallback((r: number) => {
        if (isNaN(r))
            r = 0;
        const newRgb = { ...rgbColor, r };
        const newHsv = hexToHsv(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setColor(newHsv);
        if (onChange) {
            onChange(newHsv, newRgb, rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
    }, [rgbColor, onChange, setColor]);

    const handleGChange = useCallback((g: number) => {
        if (isNaN(g))
            g = 0;
        const newRgb = { ...rgbColor, g };
        const newHsv = hexToHsv(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setColor(newHsv);
        if (onChange) {
            onChange(newHsv, newRgb, rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
    }, [rgbColor, onChange, setColor]);

    const handleBChange = useCallback((b: number) => {
        if (isNaN(b))
            b = 0;
        const newRgb = { ...rgbColor, b };
        const newHsv = hexToHsv(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setColor(newHsv);
        if (onChange) {
            onChange(newHsv, newRgb, rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
    }, [rgbColor, onChange, setColor]);

    // HEX input handler
    const handleHexChange = useCallback((hex: string) => {
        // Update local input state immediately to allow typing
        let newHex = hex.startsWith('#') ? hex : `#${hex}`;

        // Remove any non-hex characters
        newHex = newHex.replace(/[^#0-9A-Fa-f]/g, '').trim().toUpperCase();

        // Limit to 7 characters (# + 6 hex digits)
        if (newHex.length > 7) {
            newHex = newHex.substring(0, 7);
        }

        setHexInputValue(newHex);

        if (/^#([A-Fa-f0-9]{6})$/.test(newHex)) {
            const rgb = hexToRgb(newHex);
            if (rgb) {
                const newHsv = hexToHsv(newHex);
                setColor(newHsv);
                if (onChange) {
                    onChange(newHsv, rgb, newHex);
                }
            }
        }
    }, [onChange, setColor]);

    return (
        <div className="relative rounded-lg max-w-md mx-auto">
            {/* Saturation & Brightness Picker */}
            <SaturationBrightnessPicker
                hue={color.h}
                saturation={color.s}
                brightness={color.v}
                onSaturationBrightnessChange={(s, v) => {
                    handleColorChange({ s, v });
                    if (onChange) {
                        const newColor = { ...color, s, v };
                        const newRgb = hsvToRgb(newColor.h, newColor.s, newColor.v);
                        const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
                        onChange(newColor, newRgb, newHex);
                    }
                }}
                onDragStart={startDrag}
                onDragEnd={endDrag}
            />

            {/* Hue Slider */}
            <HueSlider
                hue={color.h}
                onHueChange={(h) => {
                    handleColorChange({ h });
                    if (onChange) {
                        const newColor = { ...color, h };
                        const newRgb = hsvToRgb(newColor.h, newColor.s, newColor.v);
                        const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
                        onChange(newColor, newRgb, newHex);
                    }
                }}
                onDragStart={startDrag}
                onDragEnd={endDrag}
            />

            {/* Color Preview */}
            {/* <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div
                    className="w-16 h-16 rounded-md border border-gray-300 shadow-sm"
                    style={{
                        backgroundColor: hexColor
                    }}
                />
                <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-1">HEX</div>
                    <div className="text-lg font-mono font-bold text-gray-900">{hexColor}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        RGB: {rgbColor.r}, {rgbColor.g}, {rgbColor.b}
                    </div>
                </div>
            </div> */}

            {/* Inputs Grid - Improved layout with larger HEX input */}
            <div className="flex flex-row justify-around gap-2">
                {/* HEX Input - Larger width */}
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

                {/* Red Input */}
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

                {/* Green Input */}
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

                {/* Blue Input */}
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


interface GradientPickerWithColorPickerProps {
    background?: boolean;
    gradients?: GradientStop[];
    onChange?: (gradients: GradientStop[]) => void;
}

// type HSVColor = {
//     h: number; // 0–360
//     s: number; // 0–100
//     v: number; // 0–100
// };

const hexToHsv = (hex: string, roundValues: boolean = false): HSVColor => {
    // --- Validáció ---
    hex = hex.replace(/^#/, "");
    if (!/^([0-9A-Fa-f]{6})$/.test(hex)) {
        // throw new Error("Invalid hex color");
        // return null;
    }

    // --- 3 jegyű HEX kiterjesztése ---
    // if (hex.length === 3) {
    //     hex = hex.split("").map(c => c + c).join("");
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

// Custom hook for gradient picker functionality
const useGradientPicker = (initialGradients?: GradientStop[], onChange?: (gradients: GradientStop[]) => void) => {
    const initialStops = useMemo(() => {
        console.log("Recalculating initialStops with:", initialGradients);
        return initialGradients && initialGradients.length >= 2
            ? [...initialGradients]
            : [
                { color: '#FF0000', position: 0 },
                { color: '#0000FF', position: 100 },
            ];
    }, [initialGradients]);
    const [stops, setStops] = useState<GradientStop[]>(initialStops);

    const [selectedStopIndex, setSelectedStopIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const gradientBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setStops(initialStops);
        setSelectedStopIndex(0);
    }, [initialStops]);

    // Update stop color
    const updateStopColor = useCallback((color: string) => {
        setStops((prev) => {
            const next = [...prev];
            if (selectedStopIndex < next.length) {
                next[selectedStopIndex] = { ...next[selectedStopIndex], color };
            }
            const updatedStops = [...next];
            onChange?.(updatedStops);
            return updatedStops;
        });
    }, [selectedStopIndex, onChange]);

    // Add a new stop at specified position
    const addStop = useCallback((position: number) => {
        setStops(prevStops => {
            let leftStop = prevStops[0];
            let rightStop = prevStops[prevStops.length - 1];

            for (let i = 0; i < prevStops.length - 1; i++) {
                if (position >= prevStops[i].position && position <= prevStops[i + 1].position) {
                    leftStop = prevStops[i];
                    rightStop = prevStops[i + 1];
                    break;
                }
            }

            const ratio = (position - leftStop.position) / (rightStop.position - leftStop.position);
            const newColor = Color(leftStop.color).mix(Color(rightStop.color), ratio).hex();

            const newStop: GradientStop = {
                color: newColor,
                position: position
            };

            const newStops = [...prevStops, newStop].sort((a, b) => a.position - b.position);
            // Find the correct index for the new stop after sorting
            const newIndex = newStops.findIndex(stop => stop.position === position && stop.color === newColor);
            setSelectedStopIndex(newIndex !== -1 ? newIndex : newStops.length - 1);

            const updatedStops = [...newStops];
            onChange?.(updatedStops);
            return updatedStops;
        });
    }, [onChange]);

    // Remove a stop at specified index
    const removeStop = useCallback((index: number) => {
        setStops(prevStops => {
            if (prevStops.length <= 2) return prevStops; // Keep at least 2 stops

            const newStops = prevStops.filter((_, i) => i !== index);
            // Adjust selected index after removal
            if (selectedStopIndex === index) {
                setSelectedStopIndex(Math.max(0, index - 1));
            } else if (selectedStopIndex > index) {
                setSelectedStopIndex(selectedStopIndex - 1);
            }

            const updatedStops = [...newStops];
            onChange?.(updatedStops);
            return updatedStops;
        });
    }, [selectedStopIndex, onChange]);

    // Handle stop position input
    const handleStopPositionInput = useCallback((index: number, value: string) => {
        // Remove any non-digit characters
        const numbersOnly = value.replace(/[^\d]/g, '');
        const withoutLeadingZeros = numbersOnly.replace(/^0+/, '') || '0';

        if (numbersOnly === "") {
            updateStopPosition(index, 0);
            return;
        }

        const parsedValue = parseInt(withoutLeadingZeros, 10);
        if (!isNaN(parsedValue)) {
            updateStopPosition(index, parsedValue);
        }
    }, []);

    // Update stop position
    const updateStopPosition = useCallback((index: number, newPosition: number) => {
        setStops(prevStops => {
            // Check if position actually changed
            if (prevStops[index]?.position === newPosition) {
                return prevStops;
            }

            const newStops = [...prevStops];
            const originalStop = { ...newStops[index] };
            newStops[index] = {
                ...newStops[index],
                position: Math.max(0, Math.min(100, newPosition))
            };

            newStops.sort((a, b) => a.position - b.position);

            // Find the index of the stop that originally had the same position and color
            const newIndex = newStops.findIndex(stop =>
                stop.position === Math.max(0, Math.min(100, newPosition)) &&
                stop.color === originalStop.color
            );

            // Update selected index if found
            if (newIndex !== -1 && newIndex !== selectedStopIndex) {
                setSelectedStopIndex(newIndex);
            }

            const updatedStops = [...newStops];
            onChange?.(updatedStops);
            return updatedStops;
        });
    }, [selectedStopIndex, onChange]);

    // Handle click on gradient bar
    const handleGradientBarClick = useCallback((e: React.MouseEvent) => {
        if (!gradientBarRef.current || isDragging) return;

        const rect = gradientBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const position = Math.round((x / rect.width) * 100);

        // Check if clicked near existing stop
        const existingStopIndex = stops.findIndex(stop =>
            Math.abs(stop.position - position) < 10
        );

        if (existingStopIndex !== -1) {
            setSelectedStopIndex(existingStopIndex);
        } else {
            addStop(position);
        }
    }, [stops, isDragging, addStop]);

    // Handle drag of a stop
    const handleDrag = useCallback((index: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        if (!gradientBarRef.current) return;

        let animationFrameId: number | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                const rect = gradientBarRef.current!.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newPosition = Math.round((x / rect.width) * 100);

                updateStopPosition(index, newPosition);
            });
        };

        const handleMouseUp = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [updateStopPosition]);

    // Handle touch move of a stop
    const handleTouchMove = useCallback((index: number, e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        if (!gradientBarRef.current) return;

        let animationFrameId: number | null = null;

        const handleTouchMove = (e: TouchEvent) => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                const rect = gradientBarRef.current!.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const newPosition = Math.round((x / rect.width) * 100);

                updateStopPosition(index, newPosition);
            });
        };

        const handleTouchUp = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            setIsDragging(false);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchUp);
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchUp);
    }, [updateStopPosition]);

    return {
        stops,
        selectedStopIndex,
        isDragging,
        gradientBarRef,
        updateStopColor,
        addStop,
        removeStop,
        handleStopPositionInput,
        handleGradientBarClick,
        handleDrag,
        handleTouchMove,
        setSelectedStopIndex,
    };
};

export const GradientPickerWithColorPicker: React.FC<GradientPickerWithColorPickerProps> = ({
    background = true,
    gradients,
    onChange,
}) => {
    const {
        stops,
        selectedStopIndex,
        isDragging,
        gradientBarRef,
        updateStopColor,
        removeStop,
        handleStopPositionInput,
        handleGradientBarClick,
        handleDrag,
        handleTouchMove,
        setSelectedStopIndex,
    } = useGradientPicker(gradients, onChange);

    // Generate CSS gradient string
    // const gradientString = `linear-gradient(to right, ${stops.map(stop => `${stop.color} ${stop.position}%`).join(', ')})`;
    const gradientString = `linear-gradient(to right, ${stops
        .map((stop) => {
            const { l, c, h } = toOklch(stop.color)!;
            return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h?.toFixed(2) ?? 0}) ${stop.position}%`;
        })
        .join(", ")})`;

    const currentStop = stops[selectedStopIndex];
    const currentColor = currentStop?.color || '#FF0000';
    const currentStopPosition = currentStop?.position || 0;

    // Handle color change from ColorPicker
    const handleColorChangeFromPicker = useCallback((hsv: HSVColor, rgb: RGBColor, hex: string) => {
        updateStopColor(hex);
    }, [updateStopColor]);

    const backgroundString = background ? "bg-gradient-to-br from-neutral-700/80 to-gray-800/50" : "bg-transparent";
    return (
        <div className={`flex flex-col gap-4 pb-4 rounded-lg w-full max-w-md mx-auto relative ${backgroundString}`}>
            {/* Gradient Preview */}
            <div className="flex justify-center items-center gap-3">
                <div
                    className="w-full h-8 rounded-lg border border-gray-300"
                    style={{
                        background: gradientString
                    }}
                />
            </div>

            {/* Gradient Bar with Stops */}
            <div className="relative">
                <div
                    ref={gradientBarRef}
                    className="w-full h-8 rounded-lg cursor-pointer relative overflow-hidden pointer"
                    style={{
                        background: gradientString
                    }}
                    onClick={handleGradientBarClick}
                />

                {/* Stops */}
                {stops.map(((stop, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 w-3 h-8 border-2 transform -translate-x-1/2 cursor-pointer transition-transform rounded-lg
                            ${index === selectedStopIndex
                                ? 'border-white shadow-lg scale-115'
                                : 'border-gray-300 shadow-md'
                            }`}
                        style={{
                            left: `${stop.position}%`,
                            pointerEvents: 'auto',
                            backgroundColor: stop.color
                        }}
                        onTouchStart={(e) => {
                            e.stopPropagation();
                            setSelectedStopIndex(index);
                            handleTouchMove(index, e);
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setSelectedStopIndex(index);
                            handleDrag(index, e);
                        }}
                        onClick={(e) => {
                            if (!isDragging) {
                                e.stopPropagation();
                                setSelectedStopIndex(index);
                            }
                        }}
                    />
                )))}
            </div>

            {/* Remove button and position inputbox */}
            <div className="flex flex-row w-full justify-around">
                <div className="flex justify-center items-center gap-3 w-fit">
                    <div
                        className="w-16 h-8 rounded-lg border border-gray-300 shadow-sm"
                        style={{ backgroundColor: currentStop.color }}
                    />
                </div>
                <div
                    className="flex flex-row items-center border border-gray-300 rounded-md px-2 focus-within:ring-2 focus-within:ring-blue-300"
                    onClick={() => document.getElementById('position-input')?.focus()}>
                    <input
                        id="position-input"
                        type="number"
                        value={currentStopPosition > 0 ? String(currentStopPosition).replace(/^0+/, '') : 0}
                        // value={currentStopPosition}
                        onChange={(e) => handleStopPositionInput(selectedStopIndex, e.target.value)}
                        min={0}
                        max={100}
                        className="min-w-4 py-1 text-center text-sm text-neutral-300 focus:outline-none bg-transparent disable-spin border-0 outline-none"
                        style={{ width: `${Math.max(2, currentStopPosition.toString().length * 0.75)}rem` }}
                    />
                    <label className="text-neutral-300 text-sm">%</label>
                </div>
                <button
                    className="flex underline text-blue-500 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => removeStop(selectedStopIndex)}
                    disabled={stops.length <= 2}
                >
                    Remove
                </button>
            </div>

            <div className="w-full">
                <ColorPicker
                    initialColor={hexToHsv(currentColor)}
                    onChange={handleColorChangeFromPicker}
                    key={selectedStopIndex} // This ensures the ColorPicker re-initializes when the selected stop changes
                />
            </div>
        </div>
    );
};

export default GradientPickerWithColorPicker;