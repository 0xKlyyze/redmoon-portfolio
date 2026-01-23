"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroOverlay() {
    const [isVisible, setIsVisible] = useState(true);
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);

    // Hide hero when an asteroid is selected
    const shouldShow = isVisible && !activeAsteroid;

    const handleExplore = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-30 flex items-center justify-center bg-deep-void/70 backdrop-blur-md px-4 md:px-6"
                >
                    {/* Center content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        {/* Decorative ring - smaller on mobile */}
                        <motion.div
                            className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-6 md:mb-8"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute inset-0 rounded-full border border-dashed border-white/10" />
                            <div className="absolute inset-1.5 md:inset-2 rounded-full border border-white/5" />
                            <motion.div
                                className="absolute inset-3 md:inset-4 rounded-full bg-redmoon-crimson/10 border border-redmoon-crimson/30"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-[10px] md:text-sm font-mono tracking-[0.25em] md:tracking-[0.3em] text-orbital-grey/80 uppercase mb-3 md:mb-4"
                        >
                            Software Agency Portfolio
                        </motion.p>

                        {/* Main headline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="font-orbitron text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight"
                        >
                            Building the
                            <span className="block text-gradient-crimson bg-clip-text text-transparent bg-gradient-to-r from-redmoon-crimson via-redmoon-glow to-redmoon-crimson">
                                Digital Future
                            </span>
                        </motion.h2>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                            className="text-sm md:text-lg text-white/60 font-light mb-8 md:mb-10 max-w-sm md:max-w-md mx-auto leading-relaxed"
                        >
                            Explore our ecosystem of innovative applications orbiting around our vision.
                        </motion.p>

                        {/* CTA Button - Larger touch target on mobile */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.6 }}
                            onClick={handleExplore}
                            className="pointer-events-auto group relative inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl overflow-hidden touch-target touch-active"
                        >
                            {/* Background layers */}
                            <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-r from-redmoon-crimson/5 via-transparent to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Text */}
                            <span className="relative font-orbitron text-xs md:text-sm tracking-widest text-white/90 group-hover:text-white transition-colors">
                                EXPLORE UNIVERSE
                            </span>

                            {/* Arrow */}
                            <motion.span
                                className="relative"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-white transition-colors">
                                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.span>
                        </motion.button>

                        {/* Hint text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.6 }}
                            className="text-[9px] md:text-[10px] font-mono text-orbital-grey/40 mt-5 md:mt-6 tracking-wider"
                        >
                            <span className="hidden sm:inline">CLICK AN APP TO LEARN MORE</span>
                            <span className="sm:hidden">TAP AN APP TO LEARN MORE</span>
                        </motion.p>
                    </motion.div>

                    {/* Side decorative elements - Hidden on mobile and tablet */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-1 rounded-full bg-white/20"
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-1 rounded-full bg-white/20"
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 2, delay: i * 0.2 + 0.5, repeat: Infinity }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
