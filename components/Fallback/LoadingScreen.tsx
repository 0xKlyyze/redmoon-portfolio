"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-void">
            <motion.div
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="text-center"
            >
                <h1 className="font-orbitron text-4xl font-bold tracking-[0.2em] text-redmoon-crimson mb-4">
                    REDMOON
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <div className="h-1 w-1 bg-hud-silver rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="h-1 w-1 bg-hud-silver rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="h-1 w-1 bg-hud-silver rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <p className="mt-4 font-mono text-xs text-orbital-grey tracking-widest">
                    INITIALIZING ORBITAL SYSTEM...
                </p>
            </motion.div>
        </div>
    );
}