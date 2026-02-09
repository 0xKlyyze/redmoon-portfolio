"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, LayoutGroup } from "framer-motion";
import Image from "next/image";

// Phase type for the onboarding experience
type OnboardingPhase = 'atmosphere' | 'reveal' | 'invitation' | 'transitioning' | 'complete';

// LocalStorage key for tracking onboarding completion
const ONBOARDING_COMPLETE_KEY = 'redmoon-onboarding-complete';

// Check if onboarding has been completed before
const hasCompletedOnboarding = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
};

// Mark onboarding as complete
const markOnboardingComplete = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    }
};

// Floating particle component
const FloatingParticle = ({
    index,
    totalParticles
}: {
    index: number;
    totalParticles: number;
}) => {
    const angle = (index / totalParticles) * Math.PI * 2;
    const radius = 120 + Math.random() * 180;
    const duration = 15 + Math.random() * 20;
    const delay = Math.random() * 5;
    const size = 1 + Math.random() * 2;
    const opacity = 0.2 + Math.random() * 0.4;

    return (
        <motion.div
            className="absolute rounded-full bg-white"
            style={{
                width: size,
                height: size,
                left: '50%',
                top: '50%',
            }}
            initial={{
                opacity: 0,
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            }}
            animate={{
                opacity: [0, opacity, opacity, 0],
                x: [
                    Math.cos(angle) * radius,
                    Math.cos(angle + Math.PI) * radius,
                    Math.cos(angle + Math.PI * 2) * radius,
                ],
                y: [
                    Math.sin(angle) * radius,
                    Math.sin(angle + Math.PI) * radius,
                    Math.sin(angle + Math.PI * 2) * radius,
                ],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
};

// Orbital ring component
const OrbitalRing = ({
    radius,
    duration,
    delay,
    clockwise = true,
    opacity = 0.1,
    dashArray = false,
}: {
    radius: number;
    duration: number;
    delay: number;
    clockwise?: boolean;
    opacity?: number;
    dashArray?: boolean;
}) => (
    <motion.div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
            width: radius * 2,
            height: radius * 2,
            marginLeft: -radius,
            marginTop: -radius,
            border: `1px ${dashArray ? 'dashed' : 'solid'} rgba(255, 255, 255, ${opacity})`,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
            opacity: 1,
            scale: 1,
            rotate: clockwise ? 360 : -360
        }}
        transition={{
            opacity: { duration: 0.8, delay },
            scale: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] },
            rotate: { duration, repeat: Infinity, ease: "linear" }
        }}
    />
);

// Ambient glow component
const AmbientGlow = ({ phase }: { phase: OnboardingPhase }) => (
    <>
        {/* Core glow */}
        <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(255,42,42,0.3) 0%, rgba(255,42,42,0.1) 40%, transparent 70%)',
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
                width: phase === 'atmosphere' ? 300 : phase === 'reveal' ? 500 : 600,
                height: phase === 'atmosphere' ? 300 : phase === 'reveal' ? 500 : 600,
                opacity: phase === 'atmosphere' ? 0.5 : phase === 'transitioning' || phase === 'complete' ? 0 : 1,
            }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Outer subtle glow */}
        <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 60%)',
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
                width: 800,
                height: 800,
                opacity: phase !== 'atmosphere' && phase !== 'transitioning' && phase !== 'complete' ? 0.6 : 0,
            }}
            transition={{ duration: 2.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Pulsing inner core */}
        <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-redmoon-crimson/20"
            initial={{ width: 0, height: 0 }}
            animate={{
                width: [80, 100, 80],
                height: [80, 100, 80],
                opacity: phase !== 'atmosphere' && phase !== 'transitioning' && phase !== 'complete' ? [0.3, 0.6, 0.3] : 0,
            }}
            transition={{
                width: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                height: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
        />
    </>
);

// Typewriter text component
const TypewriterText = ({
    text,
    delay = 0,
    className = "",
}: {
    text: string;
    delay?: number;
    className?: string;
}) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayedText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 50);
            return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(timeout);
    }, [text, delay]);

    return (
        <span className={className}>
            {displayedText}
            <motion.span
                className="inline-block w-0.5 h-[1em] bg-redmoon-crimson/60 ml-0.5 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ display: displayedText.length < text.length ? 'inline-block' : 'none' }}
            />
        </span>
    );
};

export default function HeroOverlay() {
    const [phase, setPhase] = useState<OnboardingPhase>('atmosphere');
    const [shouldShow, setShouldShow] = useState(true);
    const logoRef = useRef<HTMLDivElement>(null);

    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);

    // Mouse position for parallax effect - MUST be called unconditionally
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 20, stiffness: 80 };
    const parallaxX = useSpring(useTransform(mouseX, [-500, 500], [-50, 50]), springConfig);
    const parallaxY = useSpring(useTransform(mouseY, [-500, 500], [-50, 50]), springConfig);

    // Pre-compute all transforms - hooks must be called unconditionally
    const contentParallaxX = useTransform(parallaxX, v => v * 0.25);
    const contentParallaxY = useTransform(parallaxY, v => v * 0.25);

    // Number of floating particles
    const particleCount = useMemo(() => {
        if (typeof window === 'undefined') return 20;
        return window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 18 : 25;
    }, []);

    // Check if user has completed onboarding before
    useEffect(() => {
        if (hasCompletedOnboarding()) {
            setPhase('complete');
            setShouldShow(false);
            setOnboardingComplete(true);
        }
    }, [setOnboardingComplete]);

    // Auto-dismiss when asteroid is selected
    useEffect(() => {
        if (activeAsteroid && phase !== 'complete' && phase !== 'transitioning') {
            handleComplete();
        }
    }, [activeAsteroid, phase]);

    // Phase progression with balanced timing
    useEffect(() => {
        if (phase === 'complete' || phase === 'transitioning') return;

        const timings: Record<OnboardingPhase, number> = {
            'atmosphere': 1800,  // 1.8s atmospheric build-up
            'reveal': 2500,      // 2.5s for logo reveal
            'invitation': 0,     // Stay until user action
            'transitioning': 0,
            'complete': 0,
        };

        const timing = timings[phase];
        if (timing > 0) {
            const timer = setTimeout(() => {
                if (phase === 'atmosphere') setPhase('reveal');
                else if (phase === 'reveal') setPhase('invitation');
            }, timing);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Handle mouse move for parallax
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    }, [mouseX, mouseY]);

    // Handle completion with logo transition
    const handleComplete = useCallback(() => {
        markOnboardingComplete();
        setPhase('transitioning');

        // Signal navigation to start its animation after a brief moment
        // This creates the seamless handoff for the layoutId animation
        setTimeout(() => {
            setOnboardingComplete(true);
        }, 100);

        // Complete the transition after logo animation finishes
        setTimeout(() => {
            setPhase('complete');
            setShouldShow(false);
        }, 1200);
    }, [setOnboardingComplete]);

    // Don't render if complete - but hooks are already called above
    if (!shouldShow) return null;

    // Determine if logo should be shown in onboarding
    const showLogoInOnboarding = phase !== 'atmosphere' && phase !== 'complete';

    return (
        <AnimatePresence>
            {phase !== 'complete' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    onMouseMove={handleMouseMove}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-deep-void overflow-hidden"
                >
                    {/* Animated background layer */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ x: parallaxX, y: parallaxY }}
                        animate={{ opacity: phase === 'transitioning' ? 0 : 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Ambient glows */}
                        <AmbientGlow phase={phase} />

                        {/* Floating particles */}
                        {Array.from({ length: particleCount }).map((_, i) => (
                            <FloatingParticle key={i} index={i} totalParticles={particleCount} />
                        ))}

                        {/* Orbital rings (appear in reveal phase) */}
                        {phase !== 'atmosphere' && phase !== 'transitioning' && (
                            <>
                                <OrbitalRing radius={60} duration={20} delay={0} opacity={0.15} />
                                <OrbitalRing radius={100} duration={30} delay={0.2} clockwise={false} opacity={0.1} dashArray />
                                <OrbitalRing radius={150} duration={40} delay={0.4} opacity={0.08} />
                            </>
                        )}
                    </motion.div>

                    {/* Central content */}
                    <motion.div
                        className="relative z-10 text-center max-w-2xl mx-auto px-6"
                        style={{ x: contentParallaxX, y: contentParallaxY }}
                    >
                        {/* Logo reveal (Phase 2+) with layoutId for shared element transition */}
                        <AnimatePresence mode="wait">
                            {showLogoInOnboarding && (
                                <motion.div
                                    ref={logoRef}
                                    layoutId="redmoon-logo"
                                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                                    animate={{
                                        opacity: phase === 'transitioning' ? 0 : 1,
                                        scale: 1,
                                        filter: 'blur(0px)',
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                        layout: { duration: 1, ease: [0.16, 1, 0.3, 1] }
                                    }}
                                    className="mb-8"
                                >
                                    <motion.div
                                        className="relative h-16 sm:h-20 md:h-24 mx-auto mb-6"
                                        layout
                                    >
                                        <Image
                                            src="/redmoon-logo.png"
                                            alt="Redmoon"
                                            width={400}
                                            height={100}
                                            className="h-full w-auto mx-auto object-contain drop-shadow-[0_0_30px_rgba(255,42,42,0.7)]"
                                            priority
                                        />
                                    </motion.div>

                                    {/* Tagline with typewriter effect - hidden during transition */}
                                    {phase !== 'transitioning' && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-orbital-grey/80 uppercase"
                                        >
                                            <TypewriterText text="Software Agency Portfolio" delay={0.8} />
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Invitation content (Phase 3) */}
                        <AnimatePresence>
                            {phase === 'invitation' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {/* Main headline */}
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="font-orbitron text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                                    >
                                        Explore Our
                                        <motion.span
                                            className="block bg-clip-text text-transparent bg-gradient-to-r from-redmoon-crimson via-redmoon-glow to-redmoon-crimson"
                                            animate={{
                                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                            }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                            style={{ backgroundSize: '200% 200%' }}
                                        >
                                            Universe
                                        </motion.span>
                                    </motion.h1>

                                    {/* Subheadline */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.6 }}
                                        className="text-sm md:text-lg text-white/60 font-light mb-10 max-w-md mx-auto leading-relaxed"
                                    >
                                        Discover our ecosystem of innovative applications orbiting around our vision.
                                    </motion.p>

                                    {/* CTA Button */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                        onClick={handleComplete}
                                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl overflow-hidden"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {/* Glow effect */}
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl"
                                            style={{
                                                background: 'radial-gradient(circle at center, rgba(255,42,42,0.3) 0%, transparent 70%)',
                                            }}
                                            animate={{
                                                opacity: [0.5, 0.8, 0.5],
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        />

                                        {/* Glass background */}
                                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500" />

                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />

                                        {/* Text */}
                                        <span className="relative font-orbitron text-sm tracking-widest text-white/90 group-hover:text-white transition-colors">
                                            BEGIN EXPLORATION
                                        </span>

                                        {/* Animated arrow */}
                                        <motion.span
                                            className="relative"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/60 group-hover:text-white transition-colors">
                                                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </motion.span>
                                    </motion.button>

                                    {/* Hint text */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.6 }}
                                        className="text-[9px] md:text-[10px] font-mono text-orbital-grey/40 mt-8 tracking-wider"
                                    >
                                        <span className="hidden sm:inline">CLICK ANY ORBITING APP TO LEARN MORE</span>
                                        <span className="sm:hidden">TAP ANY ORBITING APP TO LEARN MORE</span>
                                    </motion.p>

                                    {/* Skip button for power users */}
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.4 }}
                                        transition={{ delay: 2, duration: 0.5 }}
                                        onClick={handleComplete}
                                        className="mt-6 text-[9px] font-mono text-orbital-grey/30 hover:text-orbital-grey/60 transition-colors tracking-wider"
                                    >
                                        SKIP INTRO
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Initial atmosphere phase - subtle pulsing indicator */}
                        <AnimatePresence>
                            {phase === 'atmosphere' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <motion.div
                                        className="w-3 h-3 rounded-full bg-redmoon-crimson/60"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.4, 0.8, 0.4],
                                        }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Corner decorative elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === 'invitation' ? 0.3 : 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-8 left-8 hidden lg:flex flex-col gap-1.5"
                    >
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-6 h-[1px] bg-gradient-to-r from-white/30 to-transparent"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === 'invitation' ? 0.3 : 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-8 right-8 hidden lg:flex flex-col gap-1.5 items-end"
                    >
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-6 h-[1px] bg-gradient-to-l from-white/30 to-transparent"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, delay: i * 0.2 + 0.5, repeat: Infinity }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}