"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Navigation() {
    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);
    const setCompanyModalOpen = useAppStore((state) => state.setCompanyModalOpen);

    return (
        <>
            {/* Top Left: Brand / Reset Button */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 left-0 z-50 p-6 md:p-8"
            >
                <button
                    onClick={() => setActiveAsteroid(null)} // Reset camera to overview
                    className="group flex flex-row items-center gap-4"
                >
                    <div className="relative w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <Image
                            src="/favicon/favicon.svg"
                            alt="Redmoon Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <h1 className="font-orbitron text-2xl font-bold tracking-widest text-hud-silver group-hover:text-white transition-colors">
                            REDMOON
                        </h1>
                        <span className="text-[10px] font-mono text-orbital-grey tracking-[0.2em] group-hover:text-redmoon-crimson transition-colors">
                            DIGITAL HOLDING
                        </span>
                    </div>
                </button>
            </motion.div>

            {/* Bottom Right: Company Info Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 right-0 z-50 p-6 md:p-8"
            >
                <button
                    onClick={() => setCompanyModalOpen(true)}
                    className="glass-panel px-6 py-3 text-xs font-orbitron font-bold tracking-wider text-hud-silver hover:bg-white/10 hover:border-redmoon-crimson/50 hover:text-white transition-all duration-300 group flex items-center gap-2"
                >
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    COMPANY_INTEL
                </button>
            </motion.div>
        </>
    );
}