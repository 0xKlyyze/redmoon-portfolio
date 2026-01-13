"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

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
                    className="group flex flex-col items-start"
                >
                    <h1 className="font-orbitron text-2xl font-bold tracking-widest text-hud-silver group-hover:text-white transition-colors">
                        REDMOON
                    </h1>
                    <span className="text-[10px] font-mono text-orbital-grey tracking-[0.2em] group-hover:text-redmoon-crimson transition-colors">
                        DIGITAL HOLDING
                    </span>
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
                    className="glass-panel px-6 py-3 text-xs font-orbitron font-bold tracking-wider text-hud-silver hover:bg-white/10 hover:border-redmoon-crimson/50 transition-all duration-300"
                >
                    COMPANY_INTEL
                </button>
            </motion.div>
        </>
    );
}