"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyModal() {
    const isOpen = useAppStore((state) => state.isCompanyModalOpen);
    const setOpen = useAppStore((state) => state.setCompanyModalOpen);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="glass-panel pointer-events-auto w-full max-w-lg p-8 md:p-12 relative flex flex-col gap-6 text-center">

                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 text-orbital-grey hover:text-white"
                            >
                                CLOSE [X]
                            </button>

                            <h2 className="font-orbitron text-3xl font-bold text-white tracking-widest text-redmoon-crimson">
                                REDMOON HOLDING
                            </h2>

                            <div className="space-y-4 text-hud-silver font-inter text-sm leading-relaxed">
                                <p>
                                    Established in 2024, Redmoon Digital Holding serves as the centralized governance body for a constellation of decentralized software products.
                                </p>
                                <p>
                                    Our mission is to explore the void of digital possibility, launching autonomous entities that orbit a shared vision of technological excellence.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left border-t border-white/10 pt-6 mt-2">
                                <div>
                                    <h4 className="text-[10px] font-mono text-orbital-grey uppercase">Registration</h4>
                                    <p className="text-sm font-mono text-white">DE-9284-X</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-mono text-orbital-grey uppercase">Contact</h4>
                                    <p className="text-sm font-mono text-white">hello@redmoon.xyz</p>
                                </div>
                            </div>

                            <div className="text-[10px] font-mono text-orbital-grey mt-4">
                                © 2025 REDMOON DIGITAL HOLDING. ALL RIGHTS RESERVED.
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}