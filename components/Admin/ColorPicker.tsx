'use client';

import { useState, useRef, useCallback } from 'react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleHexInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let hex = e.target.value;
        // Ensure it starts with #
        if (!hex.startsWith('#')) {
            hex = '#' + hex;
        }
        // Validate hex format
        if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
            onChange(hex);
        }
    }, [onChange]);

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                {/* Color Preview Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 rounded border-2 border-white/20 hover:border-white/40 transition-colors"
                    style={{ backgroundColor: value }}
                />

                {/* Hex Input */}
                <input
                    type="text"
                    value={value}
                    onChange={handleHexInput}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white font-mono text-sm focus:border-tech-blue focus:outline-none uppercase"
                    maxLength={7}
                    placeholder="#FF0000"
                />
            </div>

            {/* Native Color Picker (hidden but functional) */}
            <input
                ref={inputRef}
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
            />

            {/* Color Picker Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-deep-void border border-white/20 rounded-lg shadow-lg z-50">
                    {/* Preset Colors */}
                    <div className="grid grid-cols-6 gap-2 mb-3">
                        {[
                            '#FF2A2A', '#FF6B6B', '#FF9F1C', '#FFD600',
                            '#00FF94', '#00D68F', '#2A9DFF', '#0066FF',
                            '#B794F6', '#9C27B0', '#E91E63', '#FFFFFF',
                            '#E0E0E0', '#9E9E9E', '#616161', '#212121',
                        ].map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => {
                                    onChange(color);
                                    setIsOpen(false);
                                }}
                                className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${value === color ? 'border-white' : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    {/* Custom Color Button */}
                    <button
                        type="button"
                        onClick={() => {
                            inputRef.current?.click();
                            setIsOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs text-orbital-grey hover:text-white border border-white/20 rounded hover:border-white/40 transition-colors"
                    >
                        Custom Color...
                    </button>

                    {/* Close on outside click */}
                    <div
                        className="fixed inset-0 -z-10"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}
