"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyInfo } from "@/types";

// Social media icons as SVG paths
const SOCIAL_ICONS: Record<string, { path: string; viewBox: string }> = {
    twitter: {
        path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
        viewBox: "0 0 24 24"
    },
    linkedin: {
        path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
        viewBox: "0 0 24 24"
    },
    github: {
        path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
        viewBox: "0 0 24 24"
    },
    discord: {
        path: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
        viewBox: "0 0 24 24"
    },
    youtube: {
        path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
        viewBox: "0 0 24 24"
    },
    instagram: {
        path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
        viewBox: "0 0 24 24"
    }
};

export default function CompanyModal() {
    const isOpen = useAppStore((state) => state.isCompanyModalOpen);
    const setOpen = useAppStore((state) => state.setCompanyModalOpen);

    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'about' | 'contact' | 'legal'>('about');

    // Fetch company info when modal opens
    useEffect(() => {
        if (isOpen && !companyInfo) {
            fetchCompanyInfo();
        }
    }, [isOpen]);

    const fetchCompanyInfo = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/settings/company');
            const data = await response.json();
            if (data.company) {
                setCompanyInfo(data.company);
            }
        } catch (error) {
            console.error('Failed to fetch company info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const socialLinks = companyInfo?.social ? Object.entries(companyInfo.social).filter(([_, url]) => url) : [];

    const formatAddress = () => {
        if (!companyInfo?.address) return null;
        const { street, city, state, postalCode, country } = companyInfo.address;
        const parts = [street, city, state, postalCode, country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="glass-panel pointer-events-auto w-full max-w-2xl max-h-[85vh] overflow-hidden relative flex flex-col">

                            {/* Close Button */}
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-orbital-grey hover:text-white transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>

                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-redmoon-crimson rounded-full" />
                                </div>
                            ) : (
                                <>
                                    {/* Header with Logo & Name */}
                                    <div className="p-8 pb-6 text-center border-b border-white/10">
                                        {/* Animated Logo/Icon */}
                                        <motion.div
                                            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-redmoon-crimson/20 to-red-900/20 border border-redmoon-crimson/30 flex items-center justify-center overflow-hidden"
                                            animate={{
                                                boxShadow: ['0 0 20px rgba(255, 42, 42, 0.2)', '0 0 40px rgba(255, 42, 42, 0.4)', '0 0 20px rgba(255, 42, 42, 0.2)']
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            {companyInfo?.branding?.logo ? (
                                                <img
                                                    src={companyInfo.branding.logo}
                                                    alt={companyInfo.companyName}
                                                    className="w-12 h-12 object-contain"
                                                />
                                            ) : (
                                                <span className="text-4xl font-orbitron font-bold text-redmoon-crimson">
                                                    {companyInfo?.companyName?.charAt(0) || 'R'}
                                                </span>
                                            )}
                                        </motion.div>

                                        <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wider">
                                            {companyInfo?.companyName || 'REDMOON'}
                                        </h2>

                                        {companyInfo?.tagline && (
                                            <p className="mt-2 text-sm text-orbital-grey font-inter">
                                                {companyInfo.tagline}
                                            </p>
                                        )}

                                        {companyInfo?.foundedYear && (
                                            <span className="inline-block mt-3 px-3 py-1 text-[10px] font-mono text-tech-blue bg-tech-blue/10 border border-tech-blue/20 rounded-full">
                                                EST. {companyInfo.foundedYear}
                                            </span>
                                        )}
                                    </div>

                                    {/* Section Tabs */}
                                    <div className="flex border-b border-white/10">
                                        {[
                                            { id: 'about', label: 'About', icon: '🏢' },
                                            { id: 'contact', label: 'Contact', icon: '📧' },
                                            { id: 'legal', label: 'Legal', icon: '📋' },
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                                                className={`flex-1 px-4 py-3 text-sm font-medium transition-all relative ${activeSection === tab.id
                                                        ? 'text-white'
                                                        : 'text-orbital-grey hover:text-white'
                                                    }`}
                                            >
                                                <span className="mr-2">{tab.icon}</span>
                                                {tab.label}
                                                {activeSection === tab.id && (
                                                    <motion.div
                                                        layoutId="activeCompanyTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-redmoon-crimson"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 overflow-y-auto p-6">
                                        <AnimatePresence mode="wait">
                                            {activeSection === 'about' && (
                                                <motion.div
                                                    key="about"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-6"
                                                >
                                                    {/* SEO Description as About */}
                                                    {companyInfo?.seo?.description && (
                                                        <p className="text-hud-silver leading-relaxed">
                                                            {companyInfo.seo.description}
                                                        </p>
                                                    )}

                                                    {/* Social Links */}
                                                    {socialLinks.length > 0 && (
                                                        <div>
                                                            <h4 className="text-[10px] font-mono text-orbital-grey uppercase tracking-wider mb-3">
                                                                Connect With Us
                                                            </h4>
                                                            <div className="flex flex-wrap gap-3">
                                                                {socialLinks.map(([platform, url]) => {
                                                                    const icon = SOCIAL_ICONS[platform];
                                                                    return (
                                                                        <a
                                                                            key={platform}
                                                                            href={url as string}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all group"
                                                                            title={platform}
                                                                        >
                                                                            {icon ? (
                                                                                <svg
                                                                                    viewBox={icon.viewBox}
                                                                                    className="w-5 h-5 fill-orbital-grey group-hover:fill-white transition-colors"
                                                                                >
                                                                                    <path d={icon.path} />
                                                                                </svg>
                                                                            ) : (
                                                                                <span className="text-xs text-orbital-grey group-hover:text-white uppercase">
                                                                                    {platform.charAt(0)}
                                                                                </span>
                                                                            )}
                                                                        </a>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Branding Colors */}
                                                    {(companyInfo?.branding?.primaryColor || companyInfo?.branding?.secondaryColor) && (
                                                        <div>
                                                            <h4 className="text-[10px] font-mono text-orbital-grey uppercase tracking-wider mb-3">
                                                                Brand Colors
                                                            </h4>
                                                            <div className="flex gap-3">
                                                                {companyInfo.branding.primaryColor && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="w-8 h-8 rounded-lg border border-white/20"
                                                                            style={{ backgroundColor: companyInfo.branding.primaryColor }}
                                                                        />
                                                                        <span className="text-xs font-mono text-orbital-grey">
                                                                            {companyInfo.branding.primaryColor}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {companyInfo.branding.secondaryColor && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="w-8 h-8 rounded-lg border border-white/20"
                                                                            style={{ backgroundColor: companyInfo.branding.secondaryColor }}
                                                                        />
                                                                        <span className="text-xs font-mono text-orbital-grey">
                                                                            {companyInfo.branding.secondaryColor}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}

                                            {activeSection === 'contact' && (
                                                <motion.div
                                                    key="contact"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-6"
                                                >
                                                    {/* Contact Cards */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {companyInfo?.contact?.email && (
                                                            <a
                                                                href={`mailto:${companyInfo.contact.email}`}
                                                                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-tech-blue/50 hover:bg-white/10 transition-all group"
                                                            >
                                                                <h4 className="text-[10px] font-mono text-orbital-grey uppercase tracking-wider mb-1">
                                                                    Email
                                                                </h4>
                                                                <p className="text-sm font-mono text-white group-hover:text-tech-blue transition-colors">
                                                                    {companyInfo.contact.email}
                                                                </p>
                                                            </a>
                                                        )}

                                                        {companyInfo?.contact?.supportEmail && (
                                                            <a
                                                                href={`mailto:${companyInfo.contact.supportEmail}`}
                                                                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-neon-green/50 hover:bg-white/10 transition-all group"
                                                            >
                                                                <h4 className="text-[10px] font-mono text-orbital-grey uppercase tracking-wider mb-1">
                                                                    Support
                                                                </h4>
                                                                <p className="text-sm font-mono text-white group-hover:text-neon-green transition-colors">
                                                                    {companyInfo.contact.supportEmail}
                                                                </p>
                                                            </a>
                                                        )}

                                                        {companyInfo?.contact?.phone && (
                                                            <a
                                                                href={`tel:${companyInfo.contact.phone}`}
                                                                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-solar-yellow/50 hover:bg-white/10 transition-all group"
                                                            >
                                                                <h4 className="text-[10px] font-mono text-orbital-grey uppercase tracking-wider mb-1">
                                                                    Phone
                                                                </h4>
                                                                <p className="text-sm font-mono text-white group-hover:text-solar-yellow transition-colors">
                                                                    {companyInfo.contact.phone}
                                                                </p>
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Address */}
                                                    {formatAddress() && (
                                                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                            <h4 className="text-[10px] font-mono text-orbital-grey uppercase tracking-wider mb-2">
                                                                Address
                                                            </h4>
                                                            <p className="text-sm text-hud-silver">
                                                                {formatAddress()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}

                                            {activeSection === 'legal' && (
                                                <motion.div
                                                    key="legal"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-4"
                                                >
                                                    {/* Legal Links */}
                                                    {[
                                                        { key: 'privacyPolicy', label: 'Privacy Policy', icon: '🔒' },
                                                        { key: 'termsOfService', label: 'Terms of Service', icon: '📜' },
                                                        { key: 'cookiePolicy', label: 'Cookie Policy', icon: '🍪' },
                                                        { key: 'refundPolicy', label: 'Refund Policy', icon: '💰' },
                                                    ].map(({ key, label, icon }) => {
                                                        const value = companyInfo?.legal?.[key as keyof typeof companyInfo.legal];
                                                        if (!value) return null;

                                                        const isUrl = value.startsWith('http');

                                                        return (
                                                            <div key={key} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span>{icon}</span>
                                                                    <h4 className="text-sm font-medium text-white">{label}</h4>
                                                                </div>
                                                                {isUrl ? (
                                                                    <a
                                                                        href={value}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-sm text-tech-blue hover:underline"
                                                                    >
                                                                        View Document →
                                                                    </a>
                                                                ) : (
                                                                    <p className="text-sm text-orbital-grey line-clamp-3">
                                                                        {value}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}

                                                    {!companyInfo?.legal?.privacyPolicy &&
                                                        !companyInfo?.legal?.termsOfService &&
                                                        !companyInfo?.legal?.cookiePolicy &&
                                                        !companyInfo?.legal?.refundPolicy && (
                                                            <p className="text-sm text-orbital-grey text-center py-8">
                                                                No legal documents available.
                                                            </p>
                                                        )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-4 border-t border-white/10 text-center">
                                        <p className="text-[10px] font-mono text-orbital-grey">
                                            © {new Date().getFullYear()} {companyInfo?.companyName?.toUpperCase() || 'REDMOON'}. ALL RIGHTS RESERVED.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}