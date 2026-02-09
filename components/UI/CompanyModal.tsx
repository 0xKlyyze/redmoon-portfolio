"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyInfo } from "@/types";
import * as Icons from 'lucide-react';
import Image from "next/image";

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

// Modern stagger animation for list items
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

export default function CompanyModal() {
    const isOpen = useAppStore((state) => state.isCompanyModalOpen);
    const setOpen = useAppStore((state) => state.setCompanyModalOpen);

    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'connect' | 'legal'>('overview');

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
                    {/* Backdrop with premium blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]"
                    />

                    {/* Floating particles effect in backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[61] pointer-events-none overflow-hidden"
                    >
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-redmoon-crimson/30 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    opacity: [0.2, 0.6, 0.2],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 pointer-events-none"
                    >
                        {/* Modal Panel - Modern glassmorphism */}
                        <div className="pointer-events-auto w-full max-w-lg relative">
                            {/* Outer glow ring */}
                            <div className="absolute -inset-px bg-gradient-to-br from-redmoon-crimson/30 via-transparent to-redmoon-glow/20 rounded-3xl blur-sm" />

                            {/* Main panel */}
                            <div className="relative bg-gradient-to-br from-[#0a0a0f]/95 via-[#12121a]/95 to-[#0a0a0f]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden">

                                {/* Animated gradient border */}
                                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-redmoon-crimson/20 via-transparent to-redmoon-glow/20"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        style={{ transformOrigin: "center" }}
                                    />
                                </div>

                                {/* Close Button - Floating style */}
                                <motion.button
                                    onClick={() => setOpen(false)}
                                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 group"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Icons.X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                </motion.button>

                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-80 gap-6">
                                        <motion.div
                                            className="relative w-16 h-16"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-redmoon-crimson" />
                                            <div className="absolute inset-2 rounded-full border border-transparent border-b-redmoon-glow/50" />
                                        </motion.div>
                                        <span className="text-xs font-mono text-white/30 tracking-[0.3em]">LOADING</span>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Header - Hero style with logo */}
                                        <div className="relative px-8 pt-10 pb-6 text-center">
                                            {/* Background orb glow */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-redmoon-crimson/10 rounded-full blur-[80px] pointer-events-none" />

                                            {/* Logo */}
                                            <motion.div
                                                className="relative mx-auto mb-6"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                <div className="relative h-16 md:h-20 w-auto flex justify-center">
                                                    <Image
                                                        src="/redmoon-logo.png"
                                                        alt="Redmoon"
                                                        width={240}
                                                        height={80}
                                                        className="h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(255,42,42,0.4)]"
                                                        priority
                                                    />
                                                </div>
                                            </motion.div>

                                            {/* Tagline with animated underline */}
                                            {companyInfo?.tagline && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-sm text-white/50 font-light tracking-wide"
                                                >
                                                    {companyInfo.tagline}
                                                </motion.p>
                                            )}

                                            {/* Founded badge */}
                                            {companyInfo?.foundedYear && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-redmoon-crimson animate-pulse" />
                                                    <span className="text-[10px] font-mono text-white/40 tracking-widest">
                                                        EST. {companyInfo.foundedYear}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Tab Navigation - Pill style */}
                                        <div className="px-6 pb-4">
                                            <div className="flex bg-white/[0.02] rounded-2xl p-1.5 border border-white/[0.04]">
                                                {[
                                                    { id: 'overview', label: 'Overview', icon: Icons.Sparkles },
                                                    { id: 'connect', label: 'Connect', icon: Icons.Link2 },
                                                    { id: 'legal', label: 'Legal', icon: Icons.Shield },
                                                ].map((tab) => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                                        className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${activeTab === tab.id
                                                                ? 'text-white'
                                                                : 'text-white/40 hover:text-white/60'
                                                            }`}
                                                    >
                                                        {activeTab === tab.id && (
                                                            <motion.div
                                                                layoutId="activeTabBg"
                                                                className="absolute inset-0 bg-gradient-to-r from-redmoon-crimson/20 to-redmoon-glow/10 rounded-xl border border-redmoon-crimson/30"
                                                                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                                                            />
                                                        )}
                                                        <tab.icon className="w-3.5 h-3.5 relative z-10" />
                                                        <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="px-6 pb-6 max-h-[40vh] overflow-y-auto custom-scrollbar">
                                            <AnimatePresence mode="wait">
                                                {activeTab === 'overview' && (
                                                    <motion.div
                                                        key="overview"
                                                        variants={containerVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="space-y-4"
                                                    >
                                                        {/* Description Card */}
                                                        {companyInfo?.seo?.description && (
                                                            <motion.div
                                                                variants={itemVariants}
                                                                className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                                                            >
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Icons.Info className="w-4 h-4 text-redmoon-crimson/70" />
                                                                    <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">About</span>
                                                                </div>
                                                                <p className="text-sm text-white/70 leading-relaxed font-light">
                                                                    {companyInfo.seo.description}
                                                                </p>
                                                            </motion.div>
                                                        )}

                                                        {/* Brand Colors */}
                                                        {(companyInfo?.branding?.primaryColor || companyInfo?.branding?.secondaryColor) && (
                                                            <motion.div
                                                                variants={itemVariants}
                                                                className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.04]"
                                                            >
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <Icons.Palette className="w-4 h-4 text-redmoon-glow/70" />
                                                                    <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Brand</span>
                                                                </div>
                                                                <div className="flex gap-3">
                                                                    {companyInfo.branding?.primaryColor && (
                                                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/20 border border-white/[0.04]">
                                                                            <div
                                                                                className="w-6 h-6 rounded-lg shadow-lg ring-2 ring-white/10"
                                                                                style={{ backgroundColor: companyInfo.branding.primaryColor }}
                                                                            />
                                                                            <span className="text-xs font-mono text-white/50">
                                                                                {companyInfo.branding.primaryColor}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {companyInfo.branding?.secondaryColor && (
                                                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/20 border border-white/[0.04]">
                                                                            <div
                                                                                className="w-6 h-6 rounded-lg shadow-lg ring-2 ring-white/10"
                                                                                style={{ backgroundColor: companyInfo.branding.secondaryColor }}
                                                                            />
                                                                            <span className="text-xs font-mono text-white/50">
                                                                                {companyInfo.branding.secondaryColor}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                )}

                                                {activeTab === 'connect' && (
                                                    <motion.div
                                                        key="connect"
                                                        variants={containerVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="space-y-3"
                                                    >
                                                        {/* Contact Cards */}
                                                        {companyInfo?.contact?.email && (
                                                            <motion.a
                                                                variants={itemVariants}
                                                                href={`mailto:${companyInfo.contact.email}`}
                                                                className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-tech-blue/5 to-transparent border border-white/[0.04] hover:border-tech-blue/30 transition-all duration-300"
                                                            >
                                                                <div className="w-12 h-12 rounded-xl bg-tech-blue/10 flex items-center justify-center group-hover:bg-tech-blue/20 transition-colors">
                                                                    <Icons.Mail className="w-5 h-5 text-tech-blue" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-0.5">Email</p>
                                                                    <p className="text-sm text-white group-hover:text-tech-blue transition-colors truncate">
                                                                        {companyInfo.contact.email}
                                                                    </p>
                                                                </div>
                                                                <Icons.ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-tech-blue transition-colors" />
                                                            </motion.a>
                                                        )}

                                                        {companyInfo?.contact?.supportEmail && (
                                                            <motion.a
                                                                variants={itemVariants}
                                                                href={`mailto:${companyInfo.contact.supportEmail}`}
                                                                className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-neon-green/5 to-transparent border border-white/[0.04] hover:border-neon-green/30 transition-all duration-300"
                                                            >
                                                                <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center group-hover:bg-neon-green/20 transition-colors">
                                                                    <Icons.LifeBuoy className="w-5 h-5 text-neon-green" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-0.5">Support</p>
                                                                    <p className="text-sm text-white group-hover:text-neon-green transition-colors truncate">
                                                                        {companyInfo.contact.supportEmail}
                                                                    </p>
                                                                </div>
                                                                <Icons.ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-neon-green transition-colors" />
                                                            </motion.a>
                                                        )}

                                                        {/* Social Links */}
                                                        {socialLinks.length > 0 && (
                                                            <motion.div variants={itemVariants} className="pt-2">
                                                                <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-3 px-1">Social</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {socialLinks.map(([platform, url]) => (
                                                                        <motion.a
                                                                            key={platform}
                                                                            href={url as string}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="w-11 h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 flex items-center justify-center transition-all group"
                                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                            title={platform}
                                                                        >
                                                                            <SocialIcon name={platform} className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                                                                        </motion.a>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                        {/* Address */}
                                                        {formatAddress() && (
                                                            <motion.div
                                                                variants={itemVariants}
                                                                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] mt-3"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                                        <Icons.MapPin className="w-4 h-4 text-white/40" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-1">Headquarters</p>
                                                                        <p className="text-sm text-white/60 leading-relaxed">{formatAddress()}</p>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                )}

                                                {activeTab === 'legal' && (
                                                    <motion.div
                                                        key="legal"
                                                        variants={containerVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="space-y-2"
                                                    >
                                                        {[
                                                            { key: 'privacyPolicy', label: 'Privacy Policy', icon: Icons.Lock, color: 'redmoon-crimson' },
                                                            { key: 'termsOfService', label: 'Terms of Service', icon: Icons.FileText, color: 'tech-blue' },
                                                            { key: 'cookiePolicy', label: 'Cookie Policy', icon: Icons.Cookie, color: 'solar-yellow' },
                                                            { key: 'refundPolicy', label: 'Refund Policy', icon: Icons.Receipt, color: 'neon-green' },
                                                        ].map(({ key, label, icon: Icon, color }) => {
                                                            const value = companyInfo?.legal?.[key as keyof typeof companyInfo.legal];
                                                            if (!value) return null;

                                                            const isUrl = value.startsWith('http');

                                                            return (
                                                                <motion.div
                                                                    key={key}
                                                                    variants={itemVariants}
                                                                    className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all flex items-center justify-between"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-9 h-9 rounded-lg bg-${color}/10 flex items-center justify-center`}>
                                                                            <Icon className={`w-4 h-4 text-${color}/70`} />
                                                                        </div>
                                                                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">{label}</span>
                                                                    </div>

                                                                    {isUrl ? (
                                                                        <a
                                                                            href={value}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/50 hover:text-white transition-all"
                                                                        >
                                                                            View
                                                                            <Icons.ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-[10px] text-white/20 italic">Available</span>
                                                                    )}
                                                                </motion.div>
                                                            );
                                                        })}

                                                        {!companyInfo?.legal?.privacyPolicy &&
                                                            !companyInfo?.legal?.termsOfService &&
                                                            !companyInfo?.legal?.cookiePolicy &&
                                                            !companyInfo?.legal?.refundPolicy && (
                                                                <motion.div
                                                                    variants={itemVariants}
                                                                    className="flex flex-col items-center justify-center py-12 text-center"
                                                                >
                                                                    <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-4">
                                                                        <Icons.FileX className="w-7 h-7 text-white/10" />
                                                                    </div>
                                                                    <p className="text-sm text-white/30">No legal documents available</p>
                                                                </motion.div>
                                                            )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-6 py-4 border-t border-white/[0.04] bg-black/20">
                                            <p className="text-[9px] font-mono text-white/20 tracking-[0.2em] text-center">
                                                © {new Date().getFullYear()} {companyInfo?.companyName?.toUpperCase() || 'REDMOON'} • ALL RIGHTS RESERVED
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}