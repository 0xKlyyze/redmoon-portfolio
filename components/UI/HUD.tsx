"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { AsteroidData } from "@/types";
import Image from "next/image";

export default function HUD() {
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const asteroids = useAppStore((state) => state.asteroids);
    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);

    const data = asteroids.find((a) => a.id === activeAsteroid);

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
            default: return '';
        }
    };

    return (
        <AnimatePresence>
            {data && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed right-0 top-0 h-full w-full md:w-[600px] z-50 flex items-center justify-end md:pr-4 pointer-events-none"
                >
                    {/* Main Panel Container */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="pointer-events-auto w-full h-full md:h-[95vh] bg-[#0a0a0a]/80 backdrop-blur-xl border-l md:border border-white/10 md:rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/50"
                    >
                        {/* 1. Hero / Brand Header */}
                        <div className="relative p-8 pb-6 border-b border-white/5">
                            {/* Decorative Background Glow */}
                            <div
                                className="absolute top-0 right-0 w-64 h-64 bg-current opacity-10 blur-[80px] -translate-y-1/2 translate-x-1/2"
                                style={{ color: data.visualAsset.color }}
                            />

                            <div className="relative z-10 flex justify-between items-start">
                                <div className="flex items-center gap-5">
                                    <div className="relative w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4 overflow-hidden shadow-lg group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Image
                                            src={data.visualAsset.logo}
                                            alt={data.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="font-orbitron text-4xl font-black text-white tracking-widest leading-none">
                                            {data.name}
                                        </h1>
                                        <div className="flex items-center gap-3 mt-2">
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
                                            <span className="text-sm text-white/40 font-mono tracking-tight">
                                                v1.0.4
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveAsteroid(null)}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <p className="relative z-10 mt-6 text-lg font-light text-white/80 leading-snug">
                                {data.tagline}
                            </p>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6 space-y-8">

                            {/* 2. Primary CTA: Forge Dashboard */}
                            {data.metadata.links.forgeDashboardUrl && (
                                <a
                                    href={data.metadata.links.forgeDashboardUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block relative rounded-2xl overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#4A47A3] to-[#2B2D42] opacity-90 transition-all duration-500 group-hover:scale-105" />


                                    <div className="relative z-10 p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                                                <Image
                                                    src="/logos/forgelogo.svg"
                                                    alt="Forge"
                                                    width={32}
                                                    height={32}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold font-orbitron text-lg leading-tight group-hover:text-amber-300 transition-colors">
                                                    Forge Dashboard
                                                </h3>
                                                <p className="text-[#a5a5ff] text-xs font-mono uppercase tracking-wide mt-0.5">
                                                    Project Development Status
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:translate-x-1">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            )}

                            {/* 3. Mission Brief */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Mission Brief</h4>
                                <p className="text-base text-white/70 leading-relaxed font-light">
                                    {data.metadata.description}
                                </p>
                            </div>

                            {/* 4. Tech Stack */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Technologies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.metadata.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 font-mono hover:bg-white/10 hover:border-white/20 hover:text-white transition-all cursor-default"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 5. Pricing Plans - Premium Cards */}
                            {data.pricingPlans && data.pricingPlans.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Access Plans</h4>

                                    <div className="grid gap-4">
                                        {data.pricingPlans.map((plan, i) => (
                                            <div
                                                key={i}
                                                className={`relative p-5 rounded-xl border transition-all duration-300 ${plan.highlighted
                                                    ? 'bg-gradient-to-br from-white/10 to-transparent border-white/30 hover:border-white/50 shadow-lg'
                                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                {plan.highlighted && (
                                                    <div className="absolute -top-3 right-4 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                                        Recommended
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h5 className="text-lg font-bold text-white font-orbitron">{plan.name}</h5>
                                                        <p className="text-xs text-white/50 mt-1">{plan.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-white font-mono">
                                                            {plan.price === 0 ? 'Free' : formatPrice(plan.price, plan.currency)}
                                                        </div>
                                                        {plan.price > 0 && (
                                                            <div className="text-[10px] text-white/40 uppercase tracking-wide">
                                                                {getBillingLabel(plan.billingCycle)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-4 border-t border-white/5">
                                                    {plan.features.map((feature, j) => (
                                                        <div key={j} className="flex items-center gap-2 text-sm text-white/70">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={data.visualAsset.color} strokeWidth="3">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metadata Footer */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                                <div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Model</div>
                                    <div className="text-sm text-white font-mono">{data.metadata.pricingModel}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Orbit Distance</div>
                                    <div className="text-sm text-white font-mono">{data.orbitDistance} AU</div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="p-6 border-t border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md">
                            <div className="flex gap-3">
                                {data.metadata.links.liveUrl && (
                                    <a
                                        href={data.metadata.links.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors text-center flex items-center justify-center gap-2"
                                    >
                                        <span>Launch App</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M7 17L17 7M7 7h10v10" />
                                        </svg>
                                    </a>
                                )}
                                {data.metadata.links.githubUrl && (
                                    <a
                                        href={data.metadata.links.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3 bg-white/5 text-white border border-white/10 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white/10 hover:border-white/30 transition-all text-center"
                                    >
                                        Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}