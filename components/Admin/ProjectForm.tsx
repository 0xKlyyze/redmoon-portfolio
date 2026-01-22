'use client';

import { useState, useCallback, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AsteroidData } from '@/types';
import { useAdmin } from './AdminProvider';
import ImageUpload from './ImageUpload';
import ColorPicker from './ColorPicker';
import FeatureEditor from './FeatureEditor';
import PricingEditor from './PricingEditor';

interface ProjectFormProps {
    project: AsteroidData | null;
    onClose: () => void;
}

const DEFAULT_PROJECT: Partial<AsteroidData> = {
    name: '',
    tagline: '',
    catchPhrase: '',
    status: 'Beta',
    visualAsset: {
        geometry: 'icosahedron',
        color: '#FF2A2A',
        size: 0.7,
        logo: '/logos/favicon.svg',
    },
    brandingColors: {
        primary: '#FF2A2A',
        secondary: '#2A9DFF',
        accent: '#00FF94',
    },
    orbitDistance: 10,
    orbitSpeed: 0.2,
    metadata: {
        pricingModel: 'Subscription',
        techStack: [],
        description: '',
        longDescription: '',
        features: [],
        links: {},
    },
    pricingPlans: [],
    pricing: {
        currency: 'USD',
    },
    screenshots: [],
};

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
    const { adminPin } = useAdmin();
    const isEditing = Boolean(project);

    const [formData, setFormData] = useState<Partial<AsteroidData>>(
        project ? { ...project } : { ...DEFAULT_PROJECT }
    );
    const [techStackInput, setTechStackInput] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const url = isEditing ? `/api/projects/${project?.id}` : '/api/projects';
            const method = isEditing ? 'PUT' : 'POST';

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (adminPin) {
                headers['x-admin-pin'] = adminPin;
            }

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save project');
            }

            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, isEditing, project?.id, adminPin, onClose]);

    const updateField = useCallback(<K extends keyof AsteroidData>(
        field: K,
        value: AsteroidData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateNestedField = useCallback((
        parent: 'visualAsset' | 'metadata' | 'brandingColors' | 'pricing',
        field: string,
        value: unknown
    ) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as object),
                [field]: value,
            },
        }));
    }, []);

    const addTechStack = useCallback(() => {
        if (!techStackInput.trim()) return;
        const currentStack = formData.metadata?.techStack || [];
        updateNestedField('metadata', 'techStack', [...currentStack, techStackInput.trim()]);
        setTechStackInput('');
    }, [techStackInput, formData.metadata?.techStack, updateNestedField]);

    const removeTechStack = useCallback((index: number) => {
        const currentStack = formData.metadata?.techStack || [];
        updateNestedField('metadata', 'techStack', currentStack.filter((_, i) => i !== index));
    }, [formData.metadata?.techStack, updateNestedField]);

    const updateLink = useCallback((key: keyof NonNullable<AsteroidData['metadata']['links']>, value: string) => {
        const currentLinks = formData.metadata?.links || {};
        updateNestedField('metadata', 'links', { ...currentLinks, [key]: value || undefined });
    }, [formData.metadata?.links, updateNestedField]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-xl"
            >
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="sticky top-0 z-10 p-6 border-b border-white/10 bg-deep-void/90 backdrop-blur flex justify-between items-center">
                        <h2 className="font-orbitron text-2xl font-bold text-white">
                            {isEditing ? 'Edit Project' : 'New Project'}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-orbital-grey hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 space-y-8">
                        {error && (
                            <div className="p-4 bg-redmoon-crimson/20 border border-redmoon-crimson text-redmoon-crimson rounded">
                                {error}
                            </div>
                        )}

                        {/* Basic Info */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Status *</label>
                                    <select
                                        value={formData.status || 'Beta'}
                                        onChange={(e) => updateField('status', e.target.value as AsteroidData['status'])}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    >
                                        <option value="Live">Live</option>
                                        <option value="Beta">Beta</option>
                                        <option value="Sunset">Sunset</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs text-orbital-grey mb-2">Tagline *</label>
                                    <input
                                        type="text"
                                        value={formData.tagline || ''}
                                        onChange={(e) => updateField('tagline', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Visual Properties */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Visual Properties (3D Scene)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Geometry</label>
                                    <select
                                        value={formData.visualAsset?.geometry || 'icosahedron'}
                                        onChange={(e) => updateNestedField('visualAsset', 'geometry', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    >
                                        <option value="icosahedron">Icosahedron</option>
                                        <option value="dodecahedron">Dodecahedron</option>
                                        <option value="octahedron">Octahedron</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Color</label>
                                    <ColorPicker
                                        value={formData.visualAsset?.color || '#FF2A2A'}
                                        onChange={(color) => updateNestedField('visualAsset', 'color', color)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Logo</label>
                                    <ImageUpload
                                        value={formData.visualAsset?.logo}
                                        onChange={(url) => updateNestedField('visualAsset', 'logo', url)}
                                        folder="logos"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Description
                            </h3>
                            <div>
                                <label className="block text-xs text-orbital-grey mb-2">Short Description (for HUD)</label>
                                <textarea
                                    value={formData.metadata?.description || ''}
                                    onChange={(e) => updateNestedField('metadata', 'description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none resize-none"
                                />
                            </div>
                        </section>

                        {/* Tech Stack */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Tech Stack
                            </h3>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={techStackInput}
                                    onChange={(e) => setTechStackInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                                    placeholder="Add technology..."
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={addTechStack}
                                    className="px-4 py-2 bg-tech-blue/20 border border-tech-blue text-tech-blue rounded hover:bg-tech-blue/30"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.metadata?.techStack?.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-tech-blue rounded flex items-center gap-2"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTechStack(index)}
                                            className="text-orbital-grey hover:text-redmoon-crimson"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Modular Features Editor (New) */}
                        <section>
                            <FeatureEditor
                                // @ts-ignore
                                features={formData.metadata?.features || []}
                                // @ts-ignore
                                onChange={(features) => updateNestedField('metadata', 'features', features)}
                            />
                        </section>

                        {/* Pricing Plans Editor (New) */}
                        <section>
                            <PricingEditor
                                plans={formData.pricingPlans || []}
                                onChange={(plans) => setFormData(prev => ({ ...prev, pricingPlans: plans }))}
                            />
                        </section>

                        {/* All Links including Socials */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Project & Social Links
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Forge Dashboard URL</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.forgeDashboardUrl || ''}
                                        onChange={(e) => updateLink('forgeDashboardUrl', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="https://forge.redmoon.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Live Application URL</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.liveUrl || ''}
                                        onChange={(e) => updateLink('liveUrl', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Documentation</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.docsUrl || ''}
                                        onChange={(e) => updateLink('docsUrl', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">GitHub Repository</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.githubUrl || ''}
                                        onChange={(e) => updateLink('githubUrl', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Twitter / X</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.twitter || ''}
                                        onChange={(e) => updateLink('twitter', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Discord Invitation</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.discord || ''}
                                        onChange={(e) => updateLink('discord', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Product Hunt</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.productHunt || ''}
                                        onChange={(e) => updateLink('productHunt', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Support Email</label>
                                    <input
                                        type="email"
                                        value={formData.metadata?.links?.supportEmail || ''}
                                        onChange={(e) => updateLink('supportEmail', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 z-10 p-6 border-t border-white/10 bg-deep-void/90 backdrop-blur flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-redmoon-crimson to-red-700 text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div >
    );
}
