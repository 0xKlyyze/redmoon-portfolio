"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Navigation() {
    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);
    const setCompanyModalOpen = useAppStore((state) => state.setCompanyModalOpen);
    const triggerPulse = useAppStore((state) => state.triggerPulse);

    return (
        <>
            {/* Premium Header Bar */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                {/* Gradient accent line at top */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-redmoon-crimson/50 to-transparent" />

                {/* Header content */}
                <div className="px-6 md:px-10 py-4 md:py-5 flex items-center justify-between">
                    {/* Left: Brand */}
                    <motion.button
                        onClick={() => {
                            setActiveAsteroid(null);
                            triggerPulse();
                        }}
                        className="group flex flex-row items-center gap-4 relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Logo with glow effect */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-redmoon-crimson/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150" />
                            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-[360deg]">
                                <Image
                                    src="/favicon/favicon.svg"
                                    alt="Redmoon Logo"
                                    fill
                                    className="object-contain drop-shadow-[0_0_8px_rgba(255,42,42,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(255,42,42,0.8)] transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Brand text */}
                        <div className="flex flex-col items-start">
                            <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-[0.15em] text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-redmoon-crimson group-hover:via-redmoon-glow group-hover:to-redmoon-crimson transition-all duration-300 drop-shadow-none group-hover:drop-shadow-[0_0_10px_rgba(255,42,42,0.5)]">
                                REDMOON
                            </h1>
                            <span className="text-[9px] md:text-[10px] font-mono text-orbital-grey tracking-[0.25em] group-hover:text-redmoon-crimson/70 transition-colors duration-300">
                                DIGITAL HOLDING
                            </span>
                        </div>
                    </motion.button>

                    {/* Right: Navigation Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Scroll hint - hidden on mobile for cleanliness */}
                        <motion.div
                            className="hidden md:flex items-center gap-2 text-orbital-grey/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
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

                        {/* Divider */}
                        <div className="hidden md:block w-px h-6 bg-white/10" />

                        {/* Company Intel Button */}
                        <motion.button
                            onClick={() => setCompanyModalOpen(true)}
                            className="group relative flex items-center gap-2.5 px-4 md:px-5 py-2.5 md:py-3 rounded-xl overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Background */}
                            <div className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-xl group-hover:bg-white/[0.06] group-hover:border-white/20 transition-all duration-300" />

                            {/* Shimmer effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                            {/* Content */}
                            <span className="relative w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_rgba(0,255,148,0.5)]">
                                <span className="absolute inset-0 rounded-full bg-neon-green animate-ping opacity-40" />
                            </span>
                            <span className="relative text-[11px] md:text-xs font-orbitron font-medium tracking-wider text-hud-silver group-hover:text-white transition-colors">
                                COMPANY_INTEL
                            </span>
                        </motion.button>
                    </div>
                </div>

                {/* Bottom fade gradient */}
                <div className="h-16 bg-gradient-to-b from-deep-void/80 to-transparent pointer-events-none" />
            </motion.header>
        </>
    );
}