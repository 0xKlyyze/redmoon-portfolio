"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-void">
            {/* Orbital rings animation */}
            <div className="relative w-32 h-32 mb-8">
                {/* Outer ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-white/5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Middle ring */}
                <motion.div
                    className="absolute inset-3 rounded-full border border-white/10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner ring */}
                <motion.div
                    className="absolute inset-6 rounded-full border border-redmoon-crimson/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Core glow */}
                <motion.div
                    className="absolute inset-10 rounded-full bg-redmoon-crimson/20"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Orbiting dot */}
                <motion.div
                    className="absolute w-2 h-2 rounded-full bg-redmoon-crimson shadow-[0_0_10px_rgba(255,42,42,0.5)]"
                    style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}
                    animate={{
                        x: [0, 40, 0, -40, 0],
                        y: [-40, 0, 40, 0, -40]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Brand text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="font-orbitron text-3xl md:text-4xl font-bold tracking-[0.2em] mb-3">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-redmoon-crimson via-redmoon-glow to-redmoon-crimson">
                        REDMOON
                    </span>
                </h1>

                {/* Loading dots */}
                <div className="flex items-center justify-center gap-1.5 mt-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="h-1.5 w-1.5 bg-white/40 rounded-full"
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [0.8, 1, 0.8]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.15
                            }}
                        />
                    ))}
                </div>

                <motion.p
                    className="mt-5 font-mono text-[10px] text-orbital-grey/60 tracking-[0.25em] uppercase"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Initializing System
                </motion.p>
            </motion.div>
        </div>
    );
}