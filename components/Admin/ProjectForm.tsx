'use client';

import { useState, useCallback, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AsteroidData } from '@/types';
import { useAdmin } from './AdminProvider';
import ImageUpload from './ImageUpload';
import ColorPicker from './ColorPicker';

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
    const [featuresInput, setFeaturesInput] = useState('');
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

    const addFeature = useCallback(() => {
        if (!featuresInput.trim()) return;
        const currentFeatures = formData.metadata?.features || [];
        updateNestedField('metadata', 'features', [...currentFeatures, featuresInput.trim()]);
        setFeaturesInput('');
    }, [featuresInput, formData.metadata?.features, updateNestedField]);

    const removeFeature = useCallback((index: number) => {
        const currentFeatures = formData.metadata?.features || [];
        updateNestedField('metadata', 'features', currentFeatures.filter((_, i) => i !== index));
    }, [formData.metadata?.features, updateNestedField]);

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
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-xl"
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
                                <div className="md:col-span-2">
                                    <label className="block text-xs text-orbital-grey mb-2">Catch Phrase</label>
                                    <input
                                        type="text"
                                        value={formData.catchPhrase || ''}
                                        onChange={(e) => updateField('catchPhrase', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="Marketing catchphrase for landing page"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Visual Properties */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Visual Properties
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
                                    <label className="block text-xs text-orbital-grey mb-2">Size (0.3 - 1.2)</label>
                                    <input
                                        type="number"
                                        min="0.3"
                                        max="1.2"
                                        step="0.1"
                                        value={formData.visualAsset?.size || 0.7}
                                        onChange={(e) => updateNestedField('visualAsset', 'size', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Color</label>
                                    <ColorPicker
                                        value={formData.visualAsset?.color || '#FF2A2A'}
                                        onChange={(color) => updateNestedField('visualAsset', 'color', color)}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs text-orbital-grey mb-2">Logo</label>
                                <ImageUpload
                                    value={formData.visualAsset?.logo}
                                    onChange={(url) => updateNestedField('visualAsset', 'logo', url)}
                                    folder="logos"
                                />
                            </div>
                        </section>

                        {/* Gallery / Screenshots */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Gallery & Screenshots
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                {formData.screenshots?.map((url, index) => (
                                    <div key={index} className="relative group aspect-video bg-black/20 rounded border border-white/10 overflow-hidden">
                                        <img src={url} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeScreenshot(index)}
                                            className="absolute top-2 right-2 bg-redmoon-crimson/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block text-xs text-orbital-grey mb-2">Add New Screenshot</label>
                                <ImageUpload
                                    onChange={addScreenshot}
                                    folder="screenshots"
                                />
                            </div>
                        </section>

                        {/* Branding Colors */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Branding Colors
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Primary</label>
                                    <ColorPicker
                                        value={formData.brandingColors?.primary || '#FF2A2A'}
                                        onChange={(color) => updateNestedField('brandingColors', 'primary', color)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Secondary</label>
                                    <ColorPicker
                                        value={formData.brandingColors?.secondary || '#2A9DFF'}
                                        onChange={(color) => updateNestedField('brandingColors', 'secondary', color)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Accent</label>
                                    <ColorPicker
                                        value={formData.brandingColors?.accent || '#00FF94'}
                                        onChange={(color) => updateNestedField('brandingColors', 'accent', color)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Orbit Properties */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Orbit Properties
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Orbit Distance (6 - 20)</label>
                                    <input
                                        type="number"
                                        min="6"
                                        max="20"
                                        step="1"
                                        value={formData.orbitDistance || 10}
                                        onChange={(e) => updateField('orbitDistance', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Orbit Speed (0.05 - 0.5)</label>
                                    <input
                                        type="number"
                                        min="0.05"
                                        max="0.5"
                                        step="0.05"
                                        value={formData.orbitSpeed || 0.2}
                                        onChange={(e) => updateField('orbitSpeed', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Description
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Short Description (for HUD)</label>
                                    <textarea
                                        value={formData.metadata?.description || ''}
                                        onChange={(e) => updateNestedField('metadata', 'description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Long Description (Markdown supported)</label>
                                    <textarea
                                        value={formData.metadata?.longDescription || ''}
                                        onChange={(e) => updateNestedField('metadata', 'longDescription', e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none resize-none font-mono text-sm"
                                    />
                                </div>
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

                        {/* Features */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Key Features
                            </h3>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={featuresInput}
                                    onChange={(e) => setFeaturesInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    placeholder="Add feature..."
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="px-4 py-2 bg-neon-green/20 border border-neon-green text-neon-green rounded hover:bg-neon-green/30"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.metadata?.features?.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded flex items-center justify-between"
                                    >
                                        <span className="text-sm text-white">{feature}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-orbital-grey hover:text-redmoon-crimson"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Pricing Plans (New) */}
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
                                                <label className="block text-[10px] text-orbital-grey mb-1">Description</label>
                                                <input
                                                    type="text"
                                                    value={plan.description}
                                                    onChange={(e) => updatePricingPlan(index, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                                    placeholder="Brief description"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[10px] text-orbital-grey mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    value={plan.price}
                                                    onChange={(e) => updatePricingPlan(index, 'price', parseFloat(e.target.value))}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-orbital-grey mb-1">Cycle</label>
                                                <select
                                                    value={plan.billingCycle}
                                                    onChange={(e) => updatePricingPlan(index, 'billingCycle', e.target.value)}
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                                >
                                                    <option value="monthly">Monthly</option>
                                                    <option value="yearly">Yearly</option>
                                                    <option value="one-time">One-Time</option>
                                                    <option value="free">Free</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-orbital-grey mb-1">Highlight</label>
                                                <div className="flex items-center h-[38px]">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={plan.highlighted}
                                                            onChange={(e) => updatePricingPlan(index, 'highlighted', e.target.checked)}
                                                            className="w-4 h-4 rounded border-white/20 bg-black/20"
                                                        />
                                                        <span className="text-xs text-white">Popular?</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-orbital-grey mb-1">Features (comma separated)</label>
                                            <input
                                                type="text"
                                                value={plan.features.join(', ')}
                                                onChange={(e) => updatePricingPlan(index, 'features', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                                                placeholder="Feature 1, Feature 2..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Standard Pricing (Legacy) */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Standard Pricing (Legacy Configuration)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Pricing Model</label>
                                    <select
                                        value={formData.metadata?.pricingModel || 'Subscription'}
                                        onChange={(e) => updateNestedField('metadata', 'pricingModel', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    >
                                        <option value="Subscription">Subscription</option>
                                        <option value="One-Time">One-Time</option>
                                        <option value="Free">Free</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Currency</label>
                                    <select
                                        value={formData.pricing?.currency || 'USD'}
                                        onChange={(e) => updateNestedField('pricing', 'currency', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="JPY">JPY</option>
                                    </select>
                                </div>
                                {formData.metadata?.pricingModel === 'Subscription' && (
                                    <>
                                        <div>
                                            <label className="block text-xs text-orbital-grey mb-2">Monthly Price</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.pricing?.monthlyPrice || ''}
                                                onChange={(e) => updateNestedField('pricing', 'monthlyPrice', parseFloat(e.target.value) || undefined)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-orbital-grey mb-2">Yearly Price</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.pricing?.yearlyPrice || ''}
                                                onChange={(e) => updateNestedField('pricing', 'yearlyPrice', parseFloat(e.target.value) || undefined)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                            />
                                        </div>
                                    </>
                                )}
                                {formData.metadata?.pricingModel === 'One-Time' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-orbital-grey mb-2">One-Time Price</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.pricing?.oneTimePrice || ''}
                                            onChange={(e) => updateNestedField('pricing', 'oneTimePrice', parseFloat(e.target.value) || undefined)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Links */}
                        <section>
                            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">
                                Links
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Live URL</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.liveUrl || ''}
                                        onChange={(e) => {
                                            const links = { ...formData.metadata?.links, liveUrl: e.target.value || undefined };
                                            updateNestedField('metadata', 'links', links);
                                        }}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Forge Dashboard URL</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.forgeDashboardUrl || ''}
                                        onChange={(e) => {
                                            const links = { ...formData.metadata?.links, forgeDashboardUrl: e.target.value || undefined };
                                            updateNestedField('metadata', 'links', links);
                                        }}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="https://forge.redmoon.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Documentation URL</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.docsUrl || ''}
                                        onChange={(e) => {
                                            const links = { ...formData.metadata?.links, docsUrl: e.target.value || undefined };
                                            updateNestedField('metadata', 'links', links);
                                        }}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={formData.metadata?.links?.githubUrl || ''}
                                        onChange={(e) => {
                                            const links = { ...formData.metadata?.links, githubUrl: e.target.value || undefined };
                                            updateNestedField('metadata', 'links', links);
                                        }}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="https://github.com/..."
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
