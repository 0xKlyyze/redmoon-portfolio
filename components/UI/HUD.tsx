"use client";

import React, { useCallback } from 'react';
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import * as Icons from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Pricing formatter
const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

const getBillingLabel = (cycle: string) => {
    switch (cycle) {
        case 'monthly': return '/mo';
        case 'yearly': return '/yr';
        case 'one-time': return ' once';
        case 'free': return '';
        default: return '';
    }
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

export default function HUD() {
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const asteroids = useAppStore((state) => state.asteroids);
    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);

    // Embla Carousel hook
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true, dragFree: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const data = asteroids.find((a) => a.id === activeAsteroid);

    return (
        <AnimatePresence>
            {data && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed right-0 top-0 h-full w-full md:w-[480px] lg:w-[580px] z-50 flex items-center justify-end pointer-events-none"
                >
                    {/* Main Panel Container */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="pointer-events-auto w-full h-full glass-panel-premium md:rounded-l-3xl overflow-hidden flex flex-col relative"
                        style={{
                            borderColor: `${data.visualAsset.color}20`,
                            boxShadow: `-20px 0 100px -20px ${data.visualAsset.color}15`
                        }}
                    >
                        {/* Dynamic Background Gradient */}
                        <div
                            className="absolute inset-0 pointer-events-none z-0 opacity-20"
                            style={{
                                background: `radial-gradient(circle at top right, ${data.visualAsset.color}, transparent 60%)`
                            }}
                        />

                        {/* Top Gradient Border */}
                        <div
                            className="h-1 w-full relative z-10"
                            style={{ background: `linear-gradient(90deg, ${data.visualAsset.color}, transparent)` }}
                        />

                        {/* Header Section */}
                        <motion.div
                            className="relative p-6 lg:p-8 border-b border-white/[0.06] z-10"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-4 lg:gap-5">
                                    {/* Logo with Glow */}
                                    <div
                                        className="relative w-16 h-16 rounded-2xl flex items-center justify-center p-3 overflow-hidden shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)]"
                                        style={{
                                            background: `linear-gradient(135deg, ${data.visualAsset.color}20, ${data.visualAsset.color}05)`,
                                            border: `1px solid ${data.visualAsset.color}40`
                                        }}
                                    >
                                        <Image
                                            src={data.visualAsset.logo}
                                            alt={data.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                        />
                                    </div>

                                    {/* Title & Status */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="font-orbitron text-3xl font-bold text-white tracking-wide drop-shadow-lg">
                                                {data.name}
                                            </h1>
                                            <span
                                                className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border"
                                                style={{
                                                    borderColor: `${data.visualAsset.color}50`,
                                                    color: data.visualAsset.color,
                                                    backgroundColor: `${data.visualAsset.color}10`,
                                                    boxShadow: `0 0 10px ${data.visualAsset.color}10`
                                                }}
                                            >
                                                {data.status}
                                            </span>
                                        </div>
                                        <p className="text-base text-white/70 font-light leading-relaxed">
                                            {data.tagline}
                                        </p>
                                    </div>
                                </div>

                                {/* Close button */}
                                <button
                                    onClick={() => setActiveAsteroid(null)}
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all duration-200 border border-transparent hover:border-white/10"
                                >
                                    <Icons.X className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Scrollable Content */}
                        <motion.div
                            className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-10 relative z-10"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Forge Dashboard CTA - High Priority */}
                            {data.metadata.links.forgeDashboardUrl && (
                                <motion.a
                                    variants={itemVariants}
                                    href={data.metadata.links.forgeDashboardUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block relative rounded-2xl overflow-hidden hover-lift shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                                    style={{
                                        border: `1px solid ${data.visualAsset.color}30`
                                    }}
                                >
                                    <div className="absolute inset-0 bg-[#0B0C15]" />
                                    <div
                                        className="absolute inset-0 opacity-20"
                                        style={{ background: `linear-gradient(45deg, ${data.visualAsset.color}, transparent)` }}
                                    />

                                    <div className="relative z-10 p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                                                <Image src="/logos/forgelogo.svg" alt="Forge" width={28} height={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold font-orbitron text-lg group-hover:text-tech-blue transition-colors">Forge Dashboard</h3>
                                                <p className="text-white/50 text-xs mt-0.5 font-mono">View Live Roadmap & Metrics</p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/5 group-hover:border-white/20">
                                            <Icons.ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white" />
                                        </div>
                                    </div>
                                </motion.a>
                            )}

                            {/* Description & Tech */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <h4 className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-white/10"></span>
                                    About Project
                                </h4>
                                <p className="text-sm lg:text-base text-white/70 leading-relaxed font-light">
                                    {data.metadata.description}
                                </p>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {data.metadata.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-white/60 font-mono hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Horizontal Feature Carousel */}
                            {data.metadata.features && data.metadata.features.length > 0 && (
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-white/10"></span>
                                            Key Features
                                        </h4>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={scrollPrev}
                                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-transparent hover:border-white/10"
                                            >
                                                <Icons.ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={scrollNext}
                                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-transparent hover:border-white/10"
                                            >
                                                <Icons.ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden -mx-2 px-2 pb-4" ref={emblaRef}>
                                        <div className="flex gap-4">
                                            {data.metadata.features.map((feature: any, i: number) => {
                                                // @ts-ignore
                                                const IconComponent = Icons[feature.icon] || Icons.Star;
                                                return (
                                                    <div key={i} className="flex-[0_0_240px] min-w-0">
                                                        <div
                                                            className="h-full p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-300 group flex flex-col gap-3"
                                                            style={{
                                                                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.2)'
                                                            }}
                                                        >
                                                            <div
                                                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                                                                style={{
                                                                    backgroundColor: `${data.visualAsset.color}15`,
                                                                    color: data.visualAsset.color
                                                                }}
                                                            >
                                                                <IconComponent className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                                                            </div>
                                                            <div>
                                                                <h5 className="text-white font-bold text-sm mb-1 line-clamp-1 group-hover:text-white/90">{feature.name}</h5>
                                                                <p className="text-white/50 text-xs leading-relaxed line-clamp-3">{feature.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Pricing Plans */}
                            {data.pricingPlans && data.pricingPlans.length > 0 && (
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <h4 className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <span className="w-8 h-[1px] bg-white/10"></span>
                                        Access Plans
                                    </h4>

                                    <div className="space-y-3">
                                        {data.pricingPlans.map((plan, i) => (
                                            <div
                                                key={i}
                                                className={`relative p-5 rounded-xl border transition-all duration-300 group ${plan.highlighted
                                                    ? 'bg-gradient-to-r from-white/[0.04] to-transparent'
                                                    : 'bg-white/[0.02]'
                                                    }`}
                                                style={{
                                                    borderColor: plan.highlighted ? `${data.visualAsset.color}40` : 'rgba(255,255,255,0.05)',
                                                    boxShadow: plan.highlighted ? `0 0 30px -10px ${data.visualAsset.color}20` : 'none'
                                                }}
                                            >
                                                {plan.highlighted && (
                                                    <div
                                                        className="absolute -top-2.5 left-4 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-lg"
                                                        style={{
                                                            backgroundColor: data.visualAsset.color,
                                                            color: '#000'
                                                        }}
                                                    >
                                                        Most Popular
                                                    </div>
                                                )}

                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h5 className="text-sm font-bold text-white mb-1">{plan.name}</h5>
                                                        <p className="text-xs text-white/40">{plan.description}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className="flex items-baseline justify-end gap-1">
                                                            <span className="text-2xl font-bold text-white font-mono tracking-tight" style={{ textShadow: `0 0 20px ${data.visualAsset.color}40` }}>
                                                                {plan.price === 0 ? 'Free' : formatPrice(plan.price, plan.currency)}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">{getBillingLabel(plan.billingCycle)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-white/[0.04]">
                                                    {plan.features.slice(0, 3).map((feature, j) => (
                                                        <div key={j} className="flex items-center gap-2 text-[11px] text-white/60">
                                                            <div
                                                                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                                                                style={{ backgroundColor: `${data.visualAsset.color}20` }}
                                                            >
                                                                <Icons.Check className="w-2.5 h-2.5" style={{ color: data.visualAsset.color }} />
                                                            </div>
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Social Links */}
                            <motion.div variants={itemVariants} className="pt-2 pb-6">
                                <h4 className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                    <span className="w-8 h-[1px] bg-white/10"></span>
                                    Connect
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.metadata.links.twitter && (
                                        <a href={data.metadata.links.twitter} target="_blank" rel="noopener noreferrer"
                                            className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/40 hover:text-[#1DA1F2] transition-all text-white/40 group">
                                            <Icons.Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </a>
                                    )}
                                    {data.metadata.links.githubUrl && (
                                        <a href={data.metadata.links.githubUrl} target="_blank" rel="noopener noreferrer"
                                            className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/10 hover:border-white/30 hover:text-white transition-all text-white/40 group">
                                            <Icons.Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </a>
                                    )}
                                    {data.metadata.links.discord && (
                                        <a href={data.metadata.links.discord} target="_blank" rel="noopener noreferrer"
                                            className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-[#5865F2]/10 hover:border-[#5865F2]/40 hover:text-[#5865F2] transition-all text-white/40 group">
                                            <Icons.MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </a>
                                    )}
                                    {data.metadata.links.docsUrl && (
                                        <a href={data.metadata.links.docsUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/10 hover:border-white/30 text-white/40 hover:text-white transition-all text-xs font-medium group">
                                            <Icons.BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span>Documentation</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Sticky Action Footer */}
                        {data.metadata.links.liveUrl && (
                            <motion.div
                                className="p-6 border-t border-white/[0.06] bg-black/40 backdrop-blur-xl relative z-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                            >
                                <a
                                    href={data.metadata.links.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg relative overflow-hidden group"
                                    style={{
                                        backgroundColor: data.visualAsset.color,
                                        color: '#000',
                                        boxShadow: `0 0 30px -5px ${data.visualAsset.color}40`
                                    }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Launch Application
                                        <Icons.ExternalLink className="w-4 h-4" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </a>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}