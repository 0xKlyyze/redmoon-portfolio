
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AsteroidData } from '@/types';

type PricingPlan = NonNullable<AsteroidData['pricingPlans']>[0];

interface PricingEditorProps {
    plans: PricingPlan[];
    onChange: (plans: PricingPlan[]) => void;
}

export default function PricingEditor({ plans = [], onChange, brandColor = '#2A9DFF' }: PricingEditorProps & { brandColor?: string }) {
    const handleAdd = () => {
        const newPlan: PricingPlan = {
            name: 'New Plan',
            price: 0,
            billingCycle: 'monthly',
            currency: 'USD',
            description: '',
            features: [],
            highlighted: false
        };
        onChange([...plans, newPlan]);
    };

    const handleRemove = (index: number) => {
        onChange(plans.filter((_, i) => i !== index));
    };

    const handleUpdate = (index: number, updates: Partial<PricingPlan>) => {
        const updatedPlans = [...plans];
        updatedPlans[index] = { ...updatedPlans[index], ...updates };
        onChange(updatedPlans);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider">
                    Pricing Plans
                </h3>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-3 py-1 bg-white/5 border border-white/10 text-white text-xs rounded hover:bg-white/10 flex items-center gap-1 transition-colors"
                    style={{ borderColor: brandColor, color: brandColor }}
                >
                    <Icons.Plus className="w-3 h-3" />
                    <span>Add Plan</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`relative p-5 bg-black/40 border rounded-xl transition-all overflow-hidden group`}
                            style={{
                                borderColor: plan.highlighted ? brandColor : 'rgba(255,255,255,0.1)',
                                boxShadow: plan.highlighted ? `0 0 20px ${brandColor}20` : 'none'
                            }}
                        >
                            {/* Decorative Top Border */}
                            <div
                                className="absolute top-0 left-0 w-full h-1 opacity-50 transition-opacity"
                                style={{ backgroundColor: brandColor }}
                            />

                            {/* Card Header Actions */}
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleUpdate(index, { highlighted: !plan.highlighted })}
                                    className={`p-1.5 rounded transition-colors ${plan.highlighted ? 'opacity-100' : 'text-orbital-grey hover:text-white'}`}
                                    style={{ color: plan.highlighted ? brandColor : undefined }}
                                    title="Toggle Highlight"
                                >
                                    <Icons.Star className={`w-4 h-4 ${plan.highlighted ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="p-1.5 text-orbital-grey hover:text-redmoon-crimson transition-colors"
                                    title="Remove Plan"
                                >
                                    <Icons.Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] text-orbital-grey mb-1 uppercase tracking-wider">Plan Name</label>
                                        <input
                                            type="text"
                                            value={plan.name}
                                            onChange={(e) => handleUpdate(index, { name: e.target.value })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm font-bold focus:outline-none transition-colors"
                                            style={{ caretColor: brandColor }}
                                            onFocus={(e) => e.target.style.borderColor = brandColor}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            placeholder="e.g. Starter"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="block text-[10px] text-orbital-grey mb-1 uppercase tracking-wider">Price</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={plan.price}
                                                    onChange={(e) => handleUpdate(index, { price: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                                                    className="w-full px-3 py-2 pl-8 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none transition-colors"
                                                    style={{ caretColor: brandColor }}
                                                    onFocus={(e) => e.target.style.borderColor = brandColor}
                                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                                />
                                                <span className="absolute left-3 top-2 text-white/40">$</span>
                                            </div>
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-[10px] text-orbital-grey mb-1 uppercase tracking-wider">Currency</label>
                                            <select
                                                value={plan.currency}
                                                onChange={(e) => handleUpdate(index, { currency: e.target.value })}
                                                className="w-full px-2 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none"
                                                style={{ caretColor: brandColor }}
                                                onFocus={(e) => e.target.style.borderColor = brandColor}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            >
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-orbital-grey mb-1 uppercase tracking-wider">Billing</label>
                                        <select
                                            // @ts-ignore
                                            value={plan.billingCycle}
                                            onChange={(e) => handleUpdate(index, { billingCycle: e.target.value as any })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none"
                                            onFocus={(e) => e.target.style.borderColor = brandColor}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="one-time">One-Time</option>
                                            <option value="free">Free</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column: Details & Features */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] text-orbital-grey mb-1 uppercase tracking-wider">Description</label>
                                        <input
                                            type="text"
                                            value={plan.description}
                                            onChange={(e) => handleUpdate(index, { description: e.target.value })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none"
                                            onFocus={(e) => e.target.style.borderColor = brandColor}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            placeholder="Brief tagline for this plan"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-orbital-grey mb-1 uppercase tracking-wider">Features</label>
                                        <textarea
                                            value={plan.features.join('\n')}
                                            onChange={(e) => handleUpdate(index, { features: e.target.value.split('\n') })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none font-mono"
                                            style={{ caretColor: brandColor }}
                                            onFocus={(e) => e.target.style.borderColor = brandColor}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            rows={4}
                                            placeholder="One feature per line..."
                                        />
                                        <p className="text-[10px] text-white/30 mt-1 text-right">One feature per line</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {plans.length === 0 && (
                    <div className="p-8 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Icons.CreditCard className="w-6 h-6 text-white/20" />
                        </div>
                        <p className="text-white/40 text-sm">No pricing plans added yet.</p>
                        <button
                            onClick={handleAdd}
                            className="mt-2 text-xs underline hover:text-white"
                            style={{ color: brandColor }}
                        >
                            Add your first plan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
