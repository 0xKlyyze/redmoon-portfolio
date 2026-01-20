'use client';

import { useState, useCallback, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AsteroidData } from '@/types';
import { useAdmin } from './AdminProvider';
import ImageUpload from './ImageUpload';
import ColorPicker from './ColorPicker';
import * as Icons from 'lucide-react';

interface ProjectFormProps {
    project: AsteroidData | null;
    onClose: () => void;
}

const AVAILABLE_ICONS = [
    'Activity', 'Bell', 'Box', 'Code', 'Cpu', 'Database', 'Globe', 'Layers',
    'Layout', 'Lock', 'MessageSquare', 'Rocket', 'Server', 'Shield', 'Smartphone',
    'Star', 'Terminal', 'UserCheck', 'Zap', 'Eye', 'Sparkles', 'Download', 'Cloud'
];

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

    // Feature Input State
    const [featureName, setFeatureName] = useState('');
    const [featureDesc, setFeatureDesc] = useState('');
    const [featureIcon, setFeatureIcon] = useState('Star');

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

    // Enhanced Feature Handlers
    const addFeature = useCallback(() => {
        if (!featureName.trim() || !featureDesc.trim()) return;

        const newFeature = {
            name: featureName.trim(),
            description: featureDesc.trim(),
            icon: featureIcon
        };

        const currentFeatures = formData.metadata?.features || [];
        // @ts-ignore - Assuming types are updated
        updateNestedField('metadata', 'features', [...currentFeatures, newFeature]);

        // Reset inputs
        setFeatureName('');
        setFeatureDesc('');
        setFeatureIcon('Star');
    }, [featureName, featureDesc, featureIcon, formData.metadata?.features, updateNestedField]);

    const removeFeature = useCallback((index: number) => {
        const currentFeatures = formData.metadata?.features || [];
        updateNestedField('metadata', 'features', currentFeatures.filter((_, i) => i !== index));
    }, [formData.metadata?.features, updateNestedField]);

    const updateLink = useCallback((key: keyof NonNullable<AsteroidData['metadata']['links']>, value: string) => {
        const currentLinks = formData.metadata?.links || {};
        updateNestedField('metadata', 'links', { ...currentLinks, [key]: value || undefined });
    }, [formData.metadata?.links, updateNestedField]);

    // Pricing Plans Helpers
    const addPricingPlan = useCallback(() => {
        const currentPlans = formData.pricingPlans || [];
        setFormData(prev => ({
            ...prev,
            pricingPlans: [...currentPlans, {
                name: 'New Plan',
                price: 0,
                billingCycle: 'monthly',
                currency: 'USD',
                description: '',
                features: [],
                highlighted: false
            }]
        }));
    }, [formData.pricingPlans]);

    const removePricingPlan = useCallback((index: number) => {
        const currentPlans = formData.pricingPlans || [];
        setFormData(prev => ({
            ...prev,
            pricingPlans: currentPlans.filter((_, i) => i !== index)
        }));
    }, [formData.pricingPlans]);

    const updatePricingPlan = useCallback((index: number, field: string, value: any) => {
        const currentPlans = formData.pricingPlans || [];
        const updatedPlans = [...currentPlans];
        updatedPlans[index] = { ...updatedPlans[index], [field]: value };
        setFormData(prev => ({ ...prev, pricingPlans: updatedPlans }));
    }, [formData.pricingPlans]);

    // Screenshot Helpers
    const addScreenshot = useCallback((url: string) => {
        if (!url) return;
        setFormData(prev => ({
            ...prev,
            screenshots: [...(prev.screenshots || []), url]
        }));
    }, []);

    const removeScreenshot = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            screenshots: (prev.screenshots || []).filter((_, i) => i !== index)
        }));
    }, []);

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

                        {/* Modular Features */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Key Features
                            </h3>

                            {/* Add Feature Form */}
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-4 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={featureName}
                                        onChange={(e) => setFeatureName(e.target.value)}
                                        placeholder="Feature Name"
                                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                    />
                                    <select
                                        value={featureIcon}
                                        onChange={(e) => setFeatureIcon(e.target.value)}
                                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                    >
                                        {AVAILABLE_ICONS.map(icon => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    value={featureDesc}
                                    onChange={(e) => setFeatureDesc(e.target.value)}
                                    placeholder="Short description of the feature"
                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
                                >
                                    Add Feature
                                </button>
                            </div>

                            {/* Features List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {formData.metadata?.features?.map((feature: any, index: number) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded relative group">
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="absolute top-2 right-2 text-orbital-grey hover:text-redmoon-crimson opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                        </button>
                                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center shrink-0">
                                            {/* @ts-ignore */}
                                            {Icons[feature.icon] ? <Icons.Star className="w-4 h-4 text-white" /> : <span className="text-xs">?</span>}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{feature.name}</h4>
                                            <p className="text-xs text-white/60 leading-tight mt-1">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Pricing Plans (New Layout) */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider">
                                    Pricing Plans
                                </h3>
                                <button
                                    type="button"
                                    onClick={addPricingPlan}
                                    className="px-3 py-1 bg-neon-green/20 border border-neon-green text-neon-green text-xs rounded hover:bg-neon-green/30"
                                >
                                    + Add Plan
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.pricingPlans?.map((plan, index) => (
                                    <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3 relative">
                                        <button
                                            type="button"
                                            onClick={() => removePricingPlan(index)}
                                            className="absolute top-2 right-2 text-orbital-grey hover:text-redmoon-crimson"
                                        >
                                            Remove
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] text-orbital-grey mb-1">Plan Name</label>
                                                <input
                                                    type="text"
                                                    value={plan.name}
                                                    onChange={(e) => updatePricingPlan(index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                                    placeholder="e.g. Starter"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-orbital-grey mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    value={plan.price}
                                                    onChange={(e) => updatePricingPlan(index, 'price', parseFloat(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] text-orbital-grey mb-1">Description</label>
                                                <input
                                                    type="text"
                                                    value={plan.description}
                                                    onChange={(e) => updatePricingPlan(index, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-orbital-grey mb-1">Features (comma separated)</label>
                                                <input
                                                    type="text"
                                                    value={plan.features.join(', ')}
                                                    onChange={(e) => updatePricingPlan(index, 'features', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
