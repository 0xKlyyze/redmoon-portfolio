"use client";

import { ASTEROIDS } from "@/data/asteroids";
import { motion } from "framer-motion";
import { AsteroidData } from "@/types";

export default function ListView() {
    // Helper for status colors (Same as HUD)
    const getStatusColor = (status: AsteroidData["status"]) => {
        switch (status) {
            case "Live": return "border-neon-green text-neon-green";
            case "Beta": return "border-solar-yellow text-solar-yellow";
            case "Sunset": return "border-sunset-orange text-sunset-orange";
            default: return "border-white text-white";
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen w-full bg-deep-void p-6 md:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <header className="mb-12 text-center md:text-left border-b border-white/10 pb-8">
                    <h1 className="font-orbitron text-3xl md:text-5xl font-bold tracking-widest text-white mb-2">
                        REDMOON
                    </h1>
                    <p className="font-mono text-sm text-redmoon-crimson tracking-[0.2em]">
                        TERMINAL VIEW // 3D SYSTEM OFFLINE
                    </p>
                </header>

                {/* Project Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6"
                >
                    {ASTEROIDS.map((asteroid) => (
                        <motion.article
                            key={asteroid.id}
                            variants={item}
                            className="glass-panel p-6 md:p-8 rounded-lg border-l-4 border-l-white/20 hover:border-l-redmoon-crimson transition-colors group"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="font-orbitron text-2xl font-bold text-white group-hover:text-redmoon-crimson transition-colors">
                                            {asteroid.name}
                                        </h2>
                                        <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase rounded-full ${getStatusColor(asteroid.status)}`}>
                                            {asteroid.status}
                                        </span>
                                    </div>
                                    <p className="font-orbitron text-sm text-hud-silver/70">
                                        {asteroid.tagline}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {asteroid.metadata.links.liveUrl && (
                                        <a
                                            href={asteroid.metadata.links.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-white border border-white/10 rounded transition-colors"
                                        >
                                            LAUNCH
                                        </a>
                                    )}
                                </div>
                            </div>

                            <p className="font-inter text-sm text-orbital-grey mb-6 leading-relaxed max-w-2xl">
                                {asteroid.metadata.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {asteroid.metadata.techStack.map((tech) => (
                                    <span key={tech} className="text-[10px] font-mono text-tech-blue bg-tech-blue/10 px-2 py-1 rounded">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                <footer className="mt-12 text-center font-mono text-[10px] text-orbital-grey/50">
                    SYSTEM ID: RM-2025-X // STATIC DATA FEED
                </footer>
            </div>
        </div>
    );
}