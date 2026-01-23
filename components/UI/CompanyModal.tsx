"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyInfo } from "@/types";
import * as Icons from 'lucide-react';

// Social media icons mapping
const SocialIcon = ({ name, className }: { name: string, className?: string }) => {
    switch (name.toLowerCase()) {
        case 'twitter': return <Icons.Twitter className={className} />;
        case 'github': return <Icons.Github className={className} />;
        case 'discord': return <Icons.MessageCircle className={className} />;
        case 'linkedin': return <Icons.Linkedin className={className} />;
        case 'youtube': return <Icons.Youtube className={className} />;
        case 'instagram': return <Icons.Instagram className={className} />;
        default: return <Icons.Globe className={className} />;
    }
};

// Mobile animation variants (slide up from bottom)
const mobileModalVariants = {
    hidden: { y: "100%", opacity: 1 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 1 }
};

// Desktop animation variants (scale in)
const desktopModalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 }
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

    // Detect if we're on mobile (for animation variant selection)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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

                    {/* Modal Content Container */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={isMobile ? mobileModalVariants : desktopModalVariants}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[70] flex flex-col md:block pointer-events-none"
                    >
                        {/* Modal Panel */}
                        <div className="pointer-events-auto w-full md:w-[90vw] md:max-w-2xl h-full md:h-auto md:max-h-[85vh] flex flex-col glass-panel-premium md:rounded-3xl shadow-2xl mt-auto md:mt-0">

                            {/* Mobile Drag Indicator */}
                            <div className="md:hidden flex justify-center pt-3 pb-1">
                                <div className="drag-indicator" />
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 md:top-5 md:right-5 z-10 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all duration-200 group touch-target"
                            >
                                <Icons.X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-80 md:h-96 gap-4">
                                    <div className="relative w-12 h-12">
                                        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                                        <div className="absolute inset-0 rounded-full border-2 border-t-redmoon-crimson animate-spin" />
                                    </div>
                                    <span className="text-xs font-mono text-white/40 tracking-widest animate-pulse">LOADING INTEL...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Header with Logo & Name */}
                                    <div className="relative p-6 md:p-8 pb-4 md:pb-6 text-center border-b border-white/[0.06]">
                                        {/* Background Glow */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-redmoon-crimson/5 blur-3xl rounded-full" />

                                        {/* Animated Logo/Icon */}
                                        <motion.div
                                            className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 flex items-center justify-center overflow-hidden hover-lift shadow-glow-subtle"
                                            animate={{
                                                boxShadow: ['0 0 20px rgba(255, 42, 42, 0.1)', '0 0 30px rgba(255, 42, 42, 0.2)', '0 0 20px rgba(255, 42, 42, 0.1)']
                                            }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            {companyInfo?.branding?.logo ? (
                                                <img
                                                    src={companyInfo.branding.logo}
                                                    alt={companyInfo.companyName}
                                                    className="w-10 h-10 md:w-14 md:h-14 object-contain"
                                                />
                                            ) : (
                                                <span className="text-2xl md:text-4xl font-orbitron font-bold text-gradient-crimson drop-shadow-md">
                                                    {companyInfo?.companyName?.charAt(0) || 'R'}
                                                </span>
                                            )}
                                        </motion.div>

                                        <h2 className="font-orbitron text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-widest mb-2">
                                            {companyInfo?.companyName || 'REDMOON'}
                                        </h2>

                                        {companyInfo?.tagline && (
                                            <p className="text-xs md:text-sm text-white/50 font-light max-w-sm mx-auto">
                                                {companyInfo.tagline}
                                            </p>
                                        )}

                                        {companyInfo?.foundedYear && (
                                            <span className="inline-block mt-3 md:mt-4 px-3 py-1 text-[9px] md:text-[10px] font-mono text-tech-blue bg-tech-blue/10 border border-tech-blue/20 rounded-full">
                                                EST. {companyInfo.foundedYear}
                                            </span>
                                        )}
                                    </div>

                                    {/* Section Tabs - Scrollable on mobile */}
                                    <div className="flex border-b border-white/[0.06] bg-black/20 overflow-x-auto hide-scrollbar-mobile">
                                        {[
                                            { id: 'about', label: 'About', icon: Icons.Building2 },
                                            { id: 'contact', label: 'Contact', icon: Icons.Mail },
                                            { id: 'legal', label: 'Legal', icon: Icons.Scale },
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                                                className={`flex-1 min-w-[100px] px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm font-medium transition-all relative flex items-center justify-center gap-1.5 md:gap-2 touch-target ${activeSection === tab.id
                                                    ? 'text-white'
                                                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
                                                    }`}
                                            >
                                                <tab.icon className={`w-4 h-4 ${activeSection === tab.id ? 'text-redmoon-crimson' : ''}`} />
                                                <span className="tracking-wide uppercase font-orbitron text-[9px] md:text-xs">{tab.label}</span>

                                                {activeSection === tab.id && (
                                                    <motion.div
                                                        layoutId="activeCompanyTab"
                                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-redmoon-crimson via-redmoon-glow to-redmoon-crimson shadow-[0_-2px_8px_rgba(255,42,42,0.5)]"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar hide-scrollbar-mobile p-4 md:p-6 lg:p-8 bg-black/10">
                                        <AnimatePresence mode="wait">
                                            {activeSection === 'about' && (
                                                <motion.div
                                                    key="about"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-6 md:space-y-8"
                                                >
                                                    {/* Description */}
                                                    {companyInfo?.seo?.description && (
                                                        <div className="space-y-2 md:space-y-3">
                                                            <h4 className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Overview</h4>
                                                            <p className="text-white/70 leading-relaxed font-light text-sm md:text-base">
                                                                {companyInfo.seo.description}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Social Links */}
                                                    {socialLinks.length > 0 && (
                                                        <div className="space-y-2 md:space-y-3">
                                                            <h4 className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Connect</h4>
                                                            <div className="flex flex-wrap gap-2 md:gap-3">
                                                                {socialLinks.map(([platform, url]) => (
                                                                    <a
                                                                        key={platform}
                                                                        href={url as string}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 flex items-center justify-center transition-all group hover-lift touch-target touch-active"
                                                                        title={platform}
                                                                    >
                                                                        <SocialIcon name={platform} className="w-4 h-4 md:w-5 md:h-5 text-white/50 group-hover:text-white transition-colors" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Branding Colors */}
                                                    {(companyInfo?.branding?.primaryColor || companyInfo?.branding?.secondaryColor) && (
                                                        <div className="space-y-2 md:space-y-3">
                                                            <h4 className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Brand Identity</h4>
                                                            <div className="flex flex-wrap gap-3 md:gap-4">
                                                                {companyInfo.branding.primaryColor && (
                                                                    <div className="group flex items-center gap-2 md:gap-3 p-2 pr-3 md:pr-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                                        <div
                                                                            className="w-7 h-7 md:w-8 md:h-8 rounded-md shadow-lg"
                                                                            style={{ backgroundColor: companyInfo.branding.primaryColor }}
                                                                        />
                                                                        <span className="text-[10px] md:text-xs font-mono text-white/60 group-hover:text-white transition-colors">
                                                                            {companyInfo.branding.primaryColor}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {companyInfo.branding.secondaryColor && (
                                                                    <div className="group flex items-center gap-2 md:gap-3 p-2 pr-3 md:pr-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                                        <div
                                                                            className="w-7 h-7 md:w-8 md:h-8 rounded-md shadow-lg"
                                                                            style={{ backgroundColor: companyInfo.branding.secondaryColor }}
                                                                        />
                                                                        <span className="text-[10px] md:text-xs font-mono text-white/60 group-hover:text-white transition-colors">
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
                                                    className="space-y-4 md:space-y-6"
                                                >
                                                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                                                        {companyInfo?.contact?.email && (
                                                            <a
                                                                href={`mailto:${companyInfo.contact.email}`}
                                                                className="p-4 md:p-5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-tech-blue/50 hover:bg-tech-blue/[0.05] transition-all group touch-active"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-2 md:mb-3 text-white/40 group-hover:text-tech-blue group-hover:bg-tech-blue/10 transition-colors">
                                                                    <Icons.Mail className="w-4 h-4" />
                                                                </div>
                                                                <h4 className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">
                                                                    General Inquiries
                                                                </h4>
                                                                <p className="text-sm font-medium text-white group-hover:text-tech-blue transition-colors break-all">
                                                                    {companyInfo.contact.email}
                                                                </p>
                                                            </a>
                                                        )}

                                                        {companyInfo?.contact?.supportEmail && (
                                                            <a
                                                                href={`mailto:${companyInfo.contact.supportEmail}`}
                                                                className="p-4 md:p-5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-neon-green/50 hover:bg-neon-green/[0.05] transition-all group touch-active"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-2 md:mb-3 text-white/40 group-hover:text-neon-green group-hover:bg-neon-green/10 transition-colors">
                                                                    <Icons.LifeBuoy className="w-4 h-4" />
                                                                </div>
                                                                <h4 className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">
                                                                    Customer Support
                                                                </h4>
                                                                <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors break-all">
                                                                    {companyInfo.contact.supportEmail}
                                                                </p>
                                                            </a>
                                                        )}

                                                        {companyInfo?.contact?.phone && (
                                                            <a
                                                                href={`tel:${companyInfo.contact.phone}`}
                                                                className="p-4 md:p-5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-solar-yellow/50 hover:bg-solar-yellow/[0.05] transition-all group touch-active"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-2 md:mb-3 text-white/40 group-hover:text-solar-yellow group-hover:bg-solar-yellow/10 transition-colors">
                                                                    <Icons.Phone className="w-4 h-4" />
                                                                </div>
                                                                <h4 className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">
                                                                    Phone Support
                                                                </h4>
                                                                <p className="text-sm font-medium text-white group-hover:text-solar-yellow transition-colors">
                                                                    {companyInfo.contact.phone}
                                                                </p>
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Address */}
                                                    {formatAddress() && (
                                                        <div className="p-4 md:p-5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                                                            <h4 className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 md:mb-3">
                                                                Headquarters
                                                            </h4>
                                                            <div className="flex items-start gap-3 md:gap-4">
                                                                <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                                                                    <Icons.MapPin className="w-4 h-4" />
                                                                </div>
                                                                <p className="text-sm text-white/70 leading-relaxed font-light">
                                                                    {formatAddress()}
                                                                </p>
                                                            </div>
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
                                                    className="space-y-3 md:space-y-4"
                                                >
                                                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                                                        {[
                                                            { key: 'privacyPolicy', label: 'Privacy Policy', icon: Icons.Lock },
                                                            { key: 'termsOfService', label: 'Terms of Service', icon: Icons.FileText },
                                                            { key: 'cookiePolicy', label: 'Cookie Policy', icon: Icons.Cookie },
                                                            { key: 'refundPolicy', label: 'Refund Policy', icon: Icons.Receipt },
                                                        ].map(({ key, label, icon: Icon }) => {
                                                            const value = companyInfo?.legal?.[key as keyof typeof companyInfo.legal];
                                                            if (!value) return null;

                                                            const isUrl = value.startsWith('http');

                                                            return (
                                                                <div key={key} className="p-3 md:p-4 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:bg-white/[0.06] transition-all group flex items-center justify-between touch-active">
                                                                    <div className="flex items-center gap-3 md:gap-4">
                                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                                                                            <Icon className="w-4 h-4" />
                                                                        </div>
                                                                        <h4 className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{label}</h4>
                                                                    </div>

                                                                    {isUrl ? (
                                                                        <a
                                                                            href={value}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-tech-blue hover:bg-tech-blue/10 transition-colors flex items-center gap-1.5 touch-target"
                                                                        >
                                                                            <span>View</span>
                                                                            <Icons.ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-xs text-white/30 italic">Text only</span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {!companyInfo?.legal?.privacyPolicy &&
                                                        !companyInfo?.legal?.termsOfService &&
                                                        !companyInfo?.legal?.cookiePolicy &&
                                                        !companyInfo?.legal?.refundPolicy && (
                                                            <div className="flex flex-col items-center justify-center py-10 md:py-12 text-center">
                                                                <Icons.FileX className="w-10 h-10 md:w-12 md:h-12 text-white/10 mb-3 md:mb-4" />
                                                                <p className="text-sm text-white/40">
                                                                    No legal documents currently available for public view.
                                                                </p>
                                                            </div>
                                                        )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-3 md:p-4 border-t border-white/[0.06] text-center bg-black/20 safe-area-bottom">
                                        <p className="text-[9px] md:text-[10px] font-mono text-white/30 tracking-widest">
                                            © {new Date().getFullYear()} {companyInfo?.companyName?.toUpperCase() || 'REDMOON'}. ALL SYSTEM RIGHTS RESERVED.
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