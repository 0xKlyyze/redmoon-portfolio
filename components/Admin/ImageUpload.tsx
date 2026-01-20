'use client';

import { useState, useCallback, useRef } from 'react';
import { useAdmin } from './AdminProvider';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
}

export default function ImageUpload({ value, onChange, folder = 'uploads' }: ImageUploadProps) {
    const { adminPin } = useAdmin();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const headers: HeadersInit = {};
            if (adminPin) {
                headers['x-admin-pin'] = adminPin;
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            onChange(data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, [folder, adminPin, onChange]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    }, [handleUpload]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        }
    }, [handleUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div>
            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Preview or Upload Area */}
            {value ? (
                <div className="relative group">
                    <div className="w-full h-32 rounded border border-white/20 overflow-hidden bg-white/5 flex items-center justify-center">
                        {/* For logos/SVGs, show as img; for other images, use background */}
                        <img
                            src={value}
                            alt="Uploaded"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                // Fallback for broken images
                                (e.target as HTMLImageElement).src = '/logos/favicon.svg';
                            }}
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="px-3 py-1 bg-tech-blue/80 text-white text-xs rounded hover:bg-tech-blue"
                        >
                            Replace
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="px-3 py-1 bg-redmoon-crimson/80 text-white text-xs rounded hover:bg-redmoon-crimson"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`w-full h-32 rounded border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors ${isDragging
                            ? 'border-tech-blue bg-tech-blue/10'
                            : 'border-white/20 hover:border-white/40 bg-white/5'
                        }`}
                >
                    {isUploading ? (
                        <div className="flex items-center gap-2 text-orbital-grey">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="text-sm">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orbital-grey">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span className="text-xs text-orbital-grey">
                                Drop image or click to upload
                            </span>
                        </>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-xs text-redmoon-crimson">{error}</p>
            )}

            {/* URL Input for external images */}
            <div className="mt-2">
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-xs focus:border-tech-blue focus:outline-none"
                />
            </div>
        </div>
    );
}
