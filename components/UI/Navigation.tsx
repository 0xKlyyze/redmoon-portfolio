"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navigation() {
    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);
    const setCompanyModalOpen = useAppStore((state) => state.setCompanyModalOpen);
    const triggerPulse = useAppStore((state) => state.triggerPulse);
    const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);

    return (
        <AnimatePresence>
            {isOnboardingComplete && (
                <>
                    {/* Premium Header Bar */}
                    <motion.header
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-0 left-0 right-0 z-50 safe-area-top"
                    >
                        {/* Gradient accent line at top */}
                        <motion.div
                            className="h-[2px] w-full bg-gradient-to-r from-transparent via-redmoon-crimson/50 to-transparent"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />

                        {/* Header content */}
                        <div className="px-4 md:px-10 py-3 md:py-5 flex items-center justify-between">
                            {/* Left: Brand - Logo animates in from center */}
                            <motion.button
                                onClick={() => {
                                    setActiveAsteroid(null);
                                    triggerPulse();
                                }}
                                className="group relative touch-active"
                                initial={{
                                    opacity: 0,
                                    x: typeof window !== 'undefined' ? (window.innerWidth / 2 - 120) : 400,
                                    y: typeof window !== 'undefined' ? (window.innerHeight / 2 - 60) : 300,
                                    scale: 1.5,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 1,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: 0.1,
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {/* Ambient glow on hover */}
                                <motion.div
                                    className="absolute -inset-4 bg-redmoon-crimson/20 blur-3xl rounded-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.7 }}
                                />

                                {/* Logo */}
                                <div className="relative h-10 sm:h-12 md:h-14 lg:h-16 w-auto">
                                    <Image
                                        src="/redmoon-logo.png"
                                        alt="Redmoon"
                                        width={280}
                                        height={64}
                                        className="h-full w-auto object-contain drop-shadow-[0_0_20px_rgba(255,42,42,0.6)] group-hover:drop-shadow-[0_0_40px_rgba(255,42,42,0.9)] transition-all duration-500"
                                        priority
                                    />
                                </div>
                            </motion.button>

                            {/* Right: Navigation Actions */}
                            <motion.div
                                className="flex items-center gap-2 md:gap-4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* Scroll hint - hidden on mobile and tablet for cleanliness */}
                                <motion.div
                                    className="hidden lg:flex items-center gap-2 text-orbital-grey/60"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    <span className="text-[10px] font-mono tracking-wider">EXPLORE</span>
                                    <motion.div
                                        animate={{ y: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
                                            <path d="M6 2V10M6 10L10 6M6 10L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </motion.div>
                                </motion.div>

                                {/* Divider - hidden on mobile */}
                                <motion.div
                                    className="hidden lg:block w-px h-6 bg-white/10"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ delay: 0.7, duration: 0.4 }}
                                />

                                {/* Company Intel Button */}
                                <motion.button
                                    onClick={() => setCompanyModalOpen(true)}
                                    className="group relative flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl overflow-hidden touch-target touch-active"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Background */}
                                    <div className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-lg md:rounded-xl group-hover:bg-white/[0.06] group-hover:border-white/20 transition-all duration-300" />

                                    {/* Shimmer effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                    {/* Content */}
                                    <span className="relative w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_rgba(0,255,148,0.5)]">
                                        <span className="absolute inset-0 rounded-full bg-neon-green animate-ping opacity-40" />
                                    </span>
                                    {/* Show abbreviated text on mobile */}
                                    <span className="relative text-[10px] md:text-xs font-orbitron font-medium tracking-wider text-hud-silver group-hover:text-white transition-colors">
                                        <span className="hidden sm:inline">COMPANY_INTEL</span>
                                        <span className="sm:hidden">INFO</span>
                                    </span>
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Bottom fade gradient */}
                        <motion.div
                            className="h-12 md:h-16 bg-gradient-to-b from-deep-void/80 to-transparent pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        />
                    </motion.header>
                </>
            )}
        </AnimatePresence>
    );
}