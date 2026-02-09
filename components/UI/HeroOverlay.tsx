"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Typed text animation component
function TypedText({
    text,
    delay = 0,
    speed = 50,
    className = ""
}: {
    text: string;
    delay?: number;
    speed?: number;
    className?: string;
}) {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, text, speed]);

    return (
        <span className={className}>
            {displayedText}
            {started && displayedText.length < text.length && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-[3px] h-[1em] bg-redmoon-crimson ml-1 align-middle"
                />
            )}
        </span>
    );
}

// Floating particle component
function FloatingParticle({ delay, size, x, y, duration }: {
    delay: number;
    size: number;
    x: number;
    y: number;
    duration: number;
}) {
    return (
        <motion.div
            className="absolute rounded-full bg-redmoon-crimson/30"
            style={{
                width: size,
                height: size,
                left: `${x}%`,
                top: `${y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
                y: [-20, 20, -20],
            }}
            transition={{
                delay,
                duration,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
}

export default function HeroOverlay() {
    const heroVisible = useAppStore((state) => state.heroVisible);
    const setHeroVisible = useAppStore((state) => state.setHeroVisible);
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);

    // Also hide when an asteroid is selected
    const shouldShow = heroVisible && !activeAsteroid;

    const handleExplore = () => {
        setHeroVisible(false);
    };

    // Generate random particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        size: 2 + Math.random() * 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 4 + Math.random() * 4,
    }));

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                >
                    {/* Full-screen backdrop with vignette */}
                    <div className="absolute inset-0 bg-deep-void">
                        {/* Radial vignette */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_50%,_rgba(0,0,0,0.8)_100%)]" />

                        {/* Subtle red ambient glow at center */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(255,42,42,0.08) 0%, transparent 70%)",
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {particles.map((p) => (
                            <FloatingParticle key={p.id} {...p} />
                        ))}
                    </div>

                    {/* Orbital rings expanding from center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        {[1, 2, 3].map((ring, i) => (
                            <motion.div
                                key={ring}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
                                initial={{ width: 0, height: 0, opacity: 0 }}
                                animate={{
                                    width: 200 + ring * 150,
                                    height: 200 + ring * 150,
                                    opacity: 0.3 - i * 0.08,
                                }}
                                transition={{
                                    delay: 0.8 + i * 0.3,
                                    duration: 1.5,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                            />
                        ))}

                        {/* Animated rotating ring */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border border-dashed border-redmoon-crimson/20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: 360 }}
                            transition={{
                                scale: { delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] },
                                opacity: { delay: 0.5, duration: 0.8 },
                                rotate: { delay: 0.5, duration: 60, repeat: Infinity, ease: "linear" }
                            }}
                        />
                    </div>

                    {/* Main content */}
                    <motion.div
                        className="relative z-10 text-center max-w-3xl mx-auto px-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        {/* Logo reveal */}
                        <motion.div
                            className="relative mx-auto mb-8 md:mb-12"
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.5,
                                duration: 1,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                        >
                            {/* Logo glow */}
                            <motion.div
                                className="absolute inset-0 -m-8"
                                style={{
                                    background: "radial-gradient(circle, rgba(255,42,42,0.3) 0%, transparent 70%)",
                                }}
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                    scale: [0.9, 1.1, 0.9]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Logo image */}
                            <div className="relative h-16 sm:h-20 md:h-28 lg:h-32 w-auto mx-auto">
                                <Image
                                    src="/redmoon-logo.png"
                                    alt="Redmoon"
                                    width={400}
                                    height={100}
                                    className="h-full w-auto object-contain mx-auto drop-shadow-[0_0_30px_rgba(255,42,42,0.6)]"
                                    priority
                                />
                            </div>
                        </motion.div>

                        {/* Tagline with typing effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            className="mb-4 md:mb-6"
                        >
                            <p className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.3em] text-orbital-grey/70 uppercase">
                                <TypedText text="SOFTWARE AGENCY PORTFOLIO" delay={1400} speed={40} />
                            </p>
                        </motion.div>

                        {/* Main headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight"
                        >
                            Building the
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-redmoon-crimson via-redmoon-glow to-redmoon-crimson">
                                Digital Future
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.6, duration: 0.8 }}
                            className="text-sm sm:text-base md:text-lg text-white/50 font-light mb-10 md:mb-14 max-w-lg mx-auto leading-relaxed"
                        >
                            Explore our ecosystem of innovative applications orbiting around our vision.
                        </motion.p>

                        {/* CTA Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onClick={handleExplore}
                            className="pointer-events-auto group relative inline-flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-2xl overflow-hidden touch-target"
                        >
                            {/* Animated gradient border */}
                            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-redmoon-crimson via-redmoon-glow to-redmoon-crimson bg-[length:200%_100%] animate-shimmer" />

                            {/* Inner background */}
                            <div className="absolute inset-[1px] rounded-2xl bg-deep-void/90 group-hover:bg-deep-void/70 transition-colors duration-300" />

                            {/* Hover glow */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: "radial-gradient(circle at center, rgba(255,42,42,0.15) 0%, transparent 70%)",
                                }}
                            />

                            {/* Button text */}
                            <span className="relative font-orbitron text-sm md:text-base tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">
                                EXPLORE UNIVERSE
                            </span>

                            {/* Arrow with animation */}
                            <motion.span
                                className="relative"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white transition-colors">
                                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.span>
                        </motion.button>

                        {/* Hint text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3.5, duration: 1 }}
                            className="text-[9px] md:text-[11px] font-mono text-orbital-grey/40 mt-8 md:mt-10 tracking-widest"
                        >
                            <span className="hidden sm:inline">CLICK AN APP TO LEARN MORE</span>
                            <span className="sm:hidden">TAP AN APP TO LEARN MORE</span>
                        </motion.p>
                    </motion.div>

                    {/* Corner decorative elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute top-8 left-8 hidden lg:block"
                    >
                        <div className="w-16 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
                        <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute top-8 right-8 hidden lg:block"
                    >
                        <div className="w-16 h-[1px] bg-gradient-to-l from-white/20 to-transparent ml-auto" />
                        <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent ml-auto" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-8 left-8 hidden lg:block"
                    >
                        <div className="w-[1px] h-16 bg-gradient-to-t from-white/20 to-transparent" />
                        <div className="w-16 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-8 right-8 hidden lg:block"
                    >
                        <div className="w-[1px] h-16 bg-gradient-to-t from-white/20 to-transparent ml-auto" />
                        <div className="w-16 h-[1px] bg-gradient-to-l from-white/20 to-transparent" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
