
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import IconPicker from './IconPicker';
import { motion, AnimatePresence } from 'framer-motion';

interface Feature {
    name: string;
    description: string;
    icon: string;
}

interface FeatureEditorProps {
    features: Feature[];
    onChange: (features: Feature[]) => void;
}

export default function FeatureEditor({ features = [], onChange }: FeatureEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('Star');

    const resetForm = () => {
        setName('');
        setDescription('');
        setIcon('Star');
        setIsEditing(false);
        setEditIndex(null);
    };

    const handleSave = () => {
        if (!name.trim() || !description.trim()) return;

        const newFeature = { name, description, icon };
        const updatedFeatures = [...features];

        if (editIndex !== null) {
            updatedFeatures[editIndex] = newFeature;
        } else {
            updatedFeatures.push(newFeature);
        }

        onChange(updatedFeatures);
        resetForm();
    };

    const handleEdit = (index: number) => {
        const feature = features[index];
        setName(feature.name);
        setDescription(feature.description);
        setIcon(feature.icon);
        setEditIndex(index);
        setIsEditing(true);
    };

    const handleDelete = (index: number) => {
        onChange(features.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider">
                Key Features
            </h3>

            {/* List of Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => {
                    // @ts-ignore
                    const Icon = Icons[feature.icon] || Icons.Star;
                    return (
                        <div key={index} className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg group hover:bg-white/[0.07] transition-colors relative">
                            <div className="w-10 h-10 rounded bg-tech-blue/10 flex items-center justify-center shrink-0 text-tech-blue">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">{feature.name}</h4>
                                <p className="text-xs text-white/60 leading-tight mt-1 line-clamp-2">{feature.description}</p>
                            </div>

                            {/* Actions */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(index)}
                                    className="p-1.5 text-tech-blue hover:bg-tech-blue/20 rounded"
                                    title="Edit"
                                >
                                    <Icons.Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(index)}
                                    className="p-1.5 text-redmoon-crimson hover:bg-redmoon-crimson/20 rounded"
                                    title="Delete"
                                >
                                    <Icons.Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Button (when not editing) */}
                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex flex-col items-center justify-center gap-2 p-4 border border-dashed border-white/20 rounded-lg text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all min-h-[80px]"
                    >
                        <Icons.Plus className="w-6 h-6" />
                        <span className="text-xs font-mono">ADD FEATURE</span>
                    </button>
                )}
            </div>

            {/* Edit/Add Modal/Drawer */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-black/40 border border-white/10 rounded-lg space-y-4 pt-6 mt-4 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tech-blue to-transparent opacity-50" />

                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-bold text-white">
                                    {editIndex !== null ? 'Edit Feature' : 'Add New Feature'}
                                </h4>
                                <button type="button" onClick={resetForm} className="text-xs text-orbital-grey hover:text-white">Cancel</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-orbital-grey mb-1">Feature Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-tech-blue focus:outline-none"
                                            placeholder="e.g. Real-time Sync"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-orbital-grey mb-1">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-tech-blue focus:outline-none resize-none"
                                            placeholder="Briefly describe this feature..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-orbital-grey mb-1">Select Icon</label>
                                    <IconPicker value={icon} onChange={setIcon} />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={!name.trim() || !description.trim()}
                                    className="px-6 py-2 bg-tech-blue text-white rounded hover:bg-tech-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                                >
                                    {editIndex !== null ? 'Update Feature' : 'Add Feature'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
