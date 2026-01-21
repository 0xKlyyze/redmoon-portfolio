"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import * as Icons from 'lucide-react';

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

    const data = asteroids.find((a) => a.id === activeAsteroid);

    return (
        <AnimatePresence>
            {data && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed right-0 top-0 h-full w-full md:w-[480px] lg:w-[520px] z-50 flex items-center justify-end pointer-events-none"
                >
                    {/* Main Panel Container */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="pointer-events-auto w-full h-full glass-panel-premium md:rounded-l-3xl overflow-hidden flex flex-col"
                    >
                        {/* Gradient accent at top */}
                        <div
                            className="h-1 w-full"
                            style={{ background: `linear-gradient(90deg, ${data.visualAsset.color}, transparent)` }}
                        />

                        {/* Header Section */}
                        <motion.div
                            className="relative p-6 lg:p-8 border-b border-white/[0.06]"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Ambient glow */}
                            <div
                                className="absolute top-0 right-0 w-64 h-64 opacity-[0.08] blur-[80px] -translate-y-1/2 translate-x-1/4"
                                style={{ backgroundColor: data.visualAsset.color }}
                            />

                            <motion.div variants={itemVariants} className="relative z-10 flex justify-between items-start gap-4">
                                <div className="flex items-center gap-4 lg:gap-5">
                                    {/* Logo */}
                                    <div
                                        className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center p-3 overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${data.visualAsset.color}15, transparent)`,
                                            border: `1px solid ${data.visualAsset.color}30`
                                        }}
                                    >
                                        <Image
                                            src={data.visualAsset.logo}
                                            alt={data.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Title & Status */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="font-orbitron text-2xl lg:text-3xl font-bold text-white tracking-wide">
                                                {data.name}
                                            </h1>
                                            <span
                                                className="badge-status"
                                                style={{
                                                    borderColor: `${data.visualAsset.color}50`,
                                                    color: data.visualAsset.color,
                                                    backgroundColor: `${data.visualAsset.color}10`
                                                }}
                                            >
                                                {data.status}
                                            </span>
                                        </div>
                                        <p className="text-sm lg:text-base text-white/60 font-light leading-relaxed">
                                            {data.tagline}
                                        </p>
                                    </div>
                                </div>

                                {/* Close button */}
                                <button
                                    onClick={() => setActiveAsteroid(null)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all duration-200"
                                >
                                    <Icons.X className="w-5 h-5" />
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Scrollable Content */}
                        <motion.div
                            className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Forge Dashboard CTA */}
                            {data.metadata.links.forgeDashboardUrl && (
                                <motion.a
                                    variants={itemVariants}
                                    href={data.metadata.links.forgeDashboardUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block relative rounded-2xl overflow-hidden hover-lift"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#4A47A3] to-[#2B2D42]" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                    <div className="relative z-10 p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                                <Image src="/logos/forgelogo.svg" alt="Forge" width={28} height={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold font-orbitron text-base">Forge Dashboard</h3>
                                                <p className="text-white/60 text-xs mt-0.5">View roadmap & metrics</p>
                                            </div>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                            <Icons.ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </motion.a>
                            )}

                            {/* Description & Tech */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">About Project</h4>
                                <p className="text-sm text-white/60 leading-relaxed">{data.metadata.description}</p>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {data.metadata.techStack.map((tech) => (
                                        <span key={tech} className="tag">{tech}</span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Divider */}
                            <div className="divider-gradient" />

                            {/* Features Grid */}
                            {data.metadata.features && data.metadata.features.length > 0 && (
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Key Features</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {data.metadata.features.slice(0, 4).map((feature: any, i: number) => {
                                            // @ts-ignore
                                            const IconComponent = Icons[feature.icon] || Icons.Star;
                                            return (
                                                <motion.div
                                                    key={i}
                                                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex gap-4 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-white/50">
                                                        <IconComponent className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-white/90 font-medium text-sm mb-0.5">{feature.name}</h5>
                                                        <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Pricing Plans */}
                            {data.pricingPlans && data.pricingPlans.length > 0 && (
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <div className="divider-gradient mb-6" />
                                    <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Access Plans</h4>

                                    <div className="space-y-3">
                                        {data.pricingPlans.map((plan, i) => (
                                            <div
                                                key={i}
                                                className={`relative p-4 rounded-xl border transition-all duration-300 ${plan.highlighted
                                                        ? 'bg-white/[0.04] border-white/20'
                                                        : 'bg-white/[0.02] border-white/[0.04] hover:border-white/10'
                                                    }`}
                                            >
                                                {plan.highlighted && (
                                                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-white text-black text-[9px] font-bold uppercase tracking-wider rounded-full">
                                                        Popular
                                                    </div>
                                                )}

                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h5 className="text-sm font-medium text-white/90 mb-1">{plan.name}</h5>
                                                        <p className="text-xs text-white/40">{plan.description}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="text-xl font-bold text-white font-mono">
                                                            {plan.price === 0 ? 'Free' : formatPrice(plan.price, plan.currency)}
                                                        </span>
                                                        <span className="text-xs text-white/40 font-mono">{getBillingLabel(plan.billingCycle)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-white/[0.04]">
                                                    {plan.features.slice(0, 3).map((feature, j) => (
                                                        <div key={j} className="flex items-center gap-1.5 text-[11px] text-white/50">
                                                            <Icons.Check className="w-3 h-3 text-neon-green" />
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
                            <motion.div variants={itemVariants} className="pt-4">
                                <div className="divider-gradient mb-6" />
                                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Connect</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.metadata.links.twitter && (
                                        <a href={data.metadata.links.twitter} target="_blank" rel="noopener noreferrer"
                                            className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2]/30 hover:text-[#1DA1F2] transition-all text-white/40">
                                            <Icons.Twitter className="w-4 h-4" />
                                        </a>
                                    )}
                                    {data.metadata.links.githubUrl && (
                                        <a href={data.metadata.links.githubUrl} target="_blank" rel="noopener noreferrer"
                                            className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/10 hover:border-white/20 hover:text-white transition-all text-white/40">
                                            <Icons.Github className="w-4 h-4" />
                                        </a>
                                    )}
                                    {data.metadata.links.discord && (
                                        <a href={data.metadata.links.discord} target="_blank" rel="noopener noreferrer"
                                            className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-[#5865F2]/20 hover:border-[#5865F2]/30 hover:text-[#5865F2] transition-all text-white/40">
                                            <Icons.MessageCircle className="w-4 h-4" />
                                        </a>
                                    )}
                                    {data.metadata.links.docsUrl && (
                                        <a href={data.metadata.links.docsUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/10 hover:border-white/20 text-white/40 hover:text-white transition-all text-[11px] font-medium">
                                            <Icons.BookOpen className="w-3.5 h-3.5" />
                                            <span>Docs</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Sticky Action Footer */}
                        {data.metadata.links.liveUrl && (
                            <motion.div
                                className="p-5 lg:p-6 border-t border-white/[0.06] bg-surface/80 backdrop-blur-md"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                            >
                                <a
                                    href={data.metadata.links.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-white w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
                                >
                                    <span>Launch Application</span>
                                    <Icons.ExternalLink className="w-4 h-4" />
                                </a>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}