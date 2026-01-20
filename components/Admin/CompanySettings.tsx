'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompanyInfo } from '@/types';
import { useAdmin } from './AdminProvider';
import ColorPicker from './ColorPicker';
import ImageUpload from './ImageUpload';

interface CompanySettingsProps {
    onClose: () => void;
}

const DEFAULT_COMPANY: CompanyInfo = {
    companyName: '',
    tagline: '',
    contact: {},
    social: {},
    legal: {},
    branding: {},
    seo: {},
};

type TabId = 'general' | 'contact' | 'social' | 'legal' | 'branding' | 'seo';

const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: '🏢' },
    { id: 'contact', label: 'Contact', icon: '📧' },
    { id: 'social', label: 'Social', icon: '🌐' },
    { id: 'legal', label: 'Legal', icon: '📋' },
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
];

export default function CompanySettings({ onClose }: CompanySettingsProps) {
    const { adminPin } = useAdmin();
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [formData, setFormData] = useState<CompanyInfo>(DEFAULT_COMPANY);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Fetch existing company info
    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                const response = await fetch('/api/settings/company');
                const data = await response.json();
                if (data.company) {
                    setFormData(data.company);
                }
            } catch (error) {
                console.error('Failed to fetch company info:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanyInfo();
    }, []);

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (adminPin) {
                headers['x-admin-pin'] = adminPin;
            }

            const response = await fetch('/api/settings/company', {
                method: 'PUT',
                headers,
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save');
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, adminPin]);

    const updateField = useCallback((field: keyof CompanyInfo, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateNestedField = useCallback((
        parent: 'contact' | 'address' | 'social' | 'legal' | 'branding' | 'seo',
        field: string,
        value: unknown
    ) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as object || {}),
                [field]: value,
            },
        }));
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs text-orbital-grey mb-2">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.companyName || ''}
                                    onChange={(e) => updateField('companyName', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    placeholder="Your Company Name"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-orbital-grey mb-2">Tagline</label>
                                <input
                                    type="text"
                                    value={formData.tagline || ''}
                                    onChange={(e) => updateField('tagline', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    placeholder="Building amazing things..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-orbital-grey mb-2">Founded Year</label>
                                <input
                                    type="number"
                                    value={formData.foundedYear || ''}
                                    onChange={(e) => updateField('foundedYear', parseInt(e.target.value) || undefined)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    placeholder="2020"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-orbital-grey mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.contact?.email || ''}
                                    onChange={(e) => updateNestedField('contact', 'email', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    placeholder="contact@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-orbital-grey mb-2">Support Email</label>
                                <input
                                    type="email"
                                    value={formData.contact?.supportEmail || ''}
                                    onChange={(e) => updateNestedField('contact', 'supportEmail', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    placeholder="support@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-orbital-grey mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.contact?.phone || ''}
                                    onChange={(e) => updateNestedField('contact', 'phone', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <h4 className="text-sm font-mono text-orbital-grey uppercase tracking-wider mb-4">Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs text-orbital-grey mb-2">Street</label>
                                    <input
                                        type="text"
                                        value={formData.address?.street || ''}
                                        onChange={(e) => updateNestedField('address', 'street', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="123 Main Street"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">City</label>
                                    <input
                                        type="text"
                                        value={formData.address?.city || ''}
                                        onChange={(e) => updateNestedField('address', 'city', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="San Francisco"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">State/Province</label>
                                    <input
                                        type="text"
                                        value={formData.address?.state || ''}
                                        onChange={(e) => updateNestedField('address', 'state', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="CA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Postal Code</label>
                                    <input
                                        type="text"
                                        value={formData.address?.postalCode || ''}
                                        onChange={(e) => updateNestedField('address', 'postalCode', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="94102"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-orbital-grey mb-2">Country</label>
                                    <input
                                        type="text"
                                        value={formData.address?.country || ''}
                                        onChange={(e) => updateNestedField('address', 'country', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                        placeholder="United States"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'social':
                return (
                    <div className="space-y-4">
                        {[
                            { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourhandle' },
                            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' },
                            { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourorg' },
                            { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/yourinvite' },
                            { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
                            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label className="block text-xs text-orbital-grey mb-2">{label}</label>
                                <input
                                    type="url"
                                    value={(formData.social as Record<string, string>)?.[key] || ''}
                                    onChange={(e) => updateNestedField('social', key, e.target.value || undefined)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}
                    </div>
                );

            case 'legal':
                return (
                    <div className="space-y-6">
                        <p className="text-sm text-orbital-grey">
                            Enter the full text or paste a URL to your legal documents. Markdown formatting is supported.
                        </p>
                        {[
                            { key: 'privacyPolicy', label: 'Privacy Policy' },
                            { key: 'termsOfService', label: 'Terms of Service' },
                            { key: 'cookiePolicy', label: 'Cookie Policy' },
                            { key: 'refundPolicy', label: 'Refund Policy' },
                        ].map(({ key, label }) => (
                            <div key={key}>
                                <label className="block text-xs text-orbital-grey mb-2">{label}</label>
                                <textarea
                                    value={(formData.legal as Record<string, string>)?.[key] || ''}
                                    onChange={(e) => updateNestedField('legal', key, e.target.value || undefined)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none resize-none font-mono text-sm"
                                    placeholder={`Enter your ${label.toLowerCase()} or paste a URL...`}
                                />
                            </div>
                        ))}
                    </div>
                );

            case 'branding':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs text-orbital-grey mb-2">Company Logo</label>
                            <ImageUpload
                                value={formData.branding?.logo}
                                onChange={(url) => updateNestedField('branding', 'logo', url)}
                                folder="branding"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-orbital-grey mb-2">Favicon</label>
                            <ImageUpload
                                value={formData.branding?.favicon}
                                onChange={(url) => updateNestedField('branding', 'favicon', url)}
                                folder="branding"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-orbital-grey mb-2">Primary Color</label>
                                <ColorPicker
                                    value={formData.branding?.primaryColor || '#FF2A2A'}
                                    onChange={(color) => updateNestedField('branding', 'primaryColor', color)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-orbital-grey mb-2">Secondary Color</label>
                                <ColorPicker
                                    value={formData.branding?.secondaryColor || '#2A9DFF'}
                                    onChange={(color) => updateNestedField('branding', 'secondaryColor', color)}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'seo':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs text-orbital-grey mb-2">Page Title</label>
                            <input
                                type="text"
                                value={formData.seo?.title || ''}
                                onChange={(e) => updateNestedField('seo', 'title', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none"
                                placeholder="Your Company - Tagline"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-orbital-grey mb-2">Meta Description</label>
                            <textarea
                                value={formData.seo?.description || ''}
                                onChange={(e) => updateNestedField('seo', 'description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white focus:border-tech-blue focus:outline-none resize-none"
                                placeholder="A brief description of your company for search engines..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-orbital-grey mb-2">OG Image (Social Share)</label>
                            <ImageUpload
                                value={formData.seo?.ogImage}
                                onChange={(url) => updateNestedField('seo', 'ogImage', url)}
                                folder="seo"
                            />
                        </div>
                    </div>
                );
        }
    };

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
                className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass-panel rounded-xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="font-orbitron text-2xl font-bold text-white">Company Settings</h2>
                        <p className="text-xs text-orbital-grey mt-1">Manage your company's legal and business information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-orbital-grey hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 overflow-x-auto shrink-0">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-orbital-grey hover:text-white'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-redmoon-crimson"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                {renderTabContent()}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex items-center justify-between shrink-0">
                    <div>
                        {error && (
                            <p className="text-sm text-redmoon-crimson">{error}</p>
                        )}
                        {success && (
                            <p className="text-sm text-neon-green flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                Changes saved successfully!
                            </p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-redmoon-crimson to-red-700 text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
