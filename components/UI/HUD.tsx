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
                    className="fixed right-0 top-0 h-full w-full md:w-[800px] z-50 flex items-center justify-end md:pr-4 pointer-events-none"
                >
                    {/* Main Panel Container */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="pointer-events-auto w-full h-full md:h-[95vh] bg-[#0a0a0a]/90 backdrop-blur-xl border-l md:border border-white/10 md:rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/80"
                    >
                        {/* 1. Header Section */}
                        <div className="relative p-8 pb-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                            <div
                                className="absolute top-0 right-0 w-96 h-96 bg-current opacity-[0.08] blur-[100px] -translate-y-1/2 translate-x-1/2"
                                style={{ color: data.visualAsset.color }}
                            />

                            <div className="relative z-10 flex justify-between items-start">
                                <div className="flex items-center gap-6">
                                    <div className="relative w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4 shadow-2xl">
                                        <Image
                                            src={data.visualAsset.logo}
                                            alt={data.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="font-orbitron text-4xl font-black text-white tracking-widest leading-none">
                                                {data.name}
                                            </h1>
                                            <span
                                                className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold border"
                                                style={{
                                                    borderColor: data.visualAsset.color,
                                                    color: data.visualAsset.color,
                                                    backgroundColor: `${data.visualAsset.color}15`
                                                }}
                                            >
                                                {data.status}
                                            </span>
                                        </div>
                                        <p className="text-lg font-light text-white/80 leading-snug">
                                            {data.tagline}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveAsteroid(null)}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                >
                                    <Icons.X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">

                            {/* 2. Primary Action: Forge Dashboard */}
                            {data.metadata.links.forgeDashboardUrl && (
                                <a
                                    href={data.metadata.links.forgeDashboardUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#4A47A3] to-[#2B2D42] opacity-100" />
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s] duration-0 group-hover:duration-[1500ms] group-hover:bg-[position:200%_0,0_0]" />

                                    <div className="relative z-10 p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                                                <Image
                                                    src="/logos/forgelogo.svg"
                                                    alt="Forge"
                                                    width={36}
                                                    height={36}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold font-orbitron text-xl leading-tight">
                                                    Forge Dashboard
                                                </h3>
                                                <p className="text-white/70 text-sm mt-1">
                                                    View project roadmap, metrics, and development status.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                            <Icons.ArrowRight className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </a>
                            )}

                            {/* 3. Description & Tech Stack Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-4">
                                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">About Project</h4>
                                    <p className="text-base text-white/70 leading-relaxed font-light">
                                        {data.metadata.description}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">Technology</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.metadata.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white/60 font-mono"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 4. Modular Features Grid */}
                            {data.metadata.features && data.metadata.features.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">Key Features</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.metadata.features.map((feature: any, i: number) => {
                                            // Dynamic Icon Rendering
                                            // @ts-ignore
                                            const IconComponent = Icons[feature.icon] || Icons.Star;

                                            return (
                                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4 hover:bg-white/[0.07] transition-colors">
                                                    <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 text-white/80">
                                                        <IconComponent className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-white font-bold text-sm mb-1">{feature.name}</h5>
                                                        <p className="text-white/50 text-xs leading-relaxed">{feature.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 5. Horizontal Pricing Plans */}
                            {data.pricingPlans && data.pricingPlans.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">Access Plans</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {data.pricingPlans.map((plan, i) => (
                                            <div
                                                key={i}
                                                className={`relative p-5 rounded-xl border flex flex-col h-full transition-all duration-300 hover:scale-[1.02] ${plan.highlighted
                                                        ? 'bg-gradient-to-b from-white/10 to-transparent border-white/30 shadow-xl'
                                                        : 'bg-white/5 border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                {plan.highlighted && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap">
                                                        Best Choice
                                                    </div>
                                                )}

                                                <div className="mb-4">
                                                    <h5 className={`text-sm font-bold uppercase tracking-wider mb-2 ${plan.highlighted ? 'text-white' : 'text-white/70'}`}>
                                                        {plan.name}
                                                    </h5>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-bold text-white font-mono">
                                                            {plan.price === 0 ? 'Free' : formatPrice(plan.price, plan.currency)}
                                                        </span>
                                                        <span className="text-xs text-white/40 font-mono">
                                                            {getBillingLabel(plan.billingCycle)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-white/50 mt-2 min-h-[2.5em]">
                                                        {plan.description}
                                                    </p>
                                                </div>

                                                <div className="space-y-2 pt-4 border-t border-white/5 mt-auto">
                                                    {plan.features.map((feature, j) => (
                                                        <div key={j} className="flex items-start gap-2 text-xs text-white/70">
                                                            <Icons.Check className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 6. Social Links & Community */}
                            <div className="pt-6 border-t border-white/10">
                                <h4 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Community & Socials</h4>
                                <div className="flex flex-wrap gap-3">
                                    {data.metadata.links.twitter && (
                                        <a href={data.metadata.links.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] transition-colors text-white/60">
                                            <Icons.Twitter className="w-5 h-5" />
                                        </a>
                                    )}
                                    {data.metadata.links.githubUrl && (
                                        <a href={data.metadata.links.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg hover:bg-white/20 hover:text-white transition-colors text-white/60">
                                            <Icons.Github className="w-5 h-5" />
                                        </a>
                                    )}
                                    {data.metadata.links.discord && (
                                        <a href={data.metadata.links.discord} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg hover:bg-[#5865F2]/20 hover:text-[#5865F2] transition-colors text-white/60">
                                            <Icons.MessageCircle className="w-5 h-5" />
                                        </a>
                                    )}
                                    {data.metadata.links.productHunt && (
                                        <a href={data.metadata.links.productHunt} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg hover:bg-[#DA552F]/20 hover:text-[#DA552F] transition-colors text-white/60">
                                            <Icons.Award className="w-5 h-5" />
                                        </a>
                                    )}
                                    {data.metadata.links.docsUrl && (
                                        <a href={data.metadata.links.docsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                                            <Icons.BookOpen className="w-4 h-4" />
                                            <span>Documentation</span>
                                        </a>
                                    )}
                                    {data.metadata.links.supportEmail && (
                                        <a href={`mailto:${data.metadata.links.supportEmail}`} className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                                            <Icons.Mail className="w-4 h-4" />
                                            <span>Support</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Sticky Action Footer */}
                        {data.metadata.links.liveUrl && (
                            <div className="p-6 border-t border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md">
                                <a
                                    href={data.metadata.links.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5"
                                >
                                    <span>Launch Application</span>
                                    <Icons.ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}