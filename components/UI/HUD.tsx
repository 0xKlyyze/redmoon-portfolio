"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { AsteroidData } from "@/types";

export default function HUD() {
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const asteroids = useAppStore((state) => state.asteroids);
    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);

    // Find the data for the selected asteroid
    const data = asteroids.find((a) => a.id === activeAsteroid);

    // Helper for status colors
    const getStatusColor = (status: AsteroidData["status"]) => {
        switch (status) {
            case "Live": return "border-neon-green text-neon-green";
            case "Beta": return "border-solar-yellow text-solar-yellow";
            case "Sunset": return "border-sunset-orange text-sunset-orange";
            default: return "border-white text-white";
        }
    };

    return (
        <AnimatePresence>
            {data && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed right-0 top-0 h-full w-full md:w-[480px] z-40 flex items-center justify-end p-0 md:p-8 pointer-events-none"
                >
                    {/* The Card Container */}
                    <div className="glass-panel pointer-events-auto w-full max-h-[80vh] overflow-y-auto p-8 md:rounded-xl flex flex-col gap-6 relative border-l-4 border-l-redmoon-crimson">

                        {/* Header Section */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-orbitron text-4xl font-bold text-white mb-2">
                                    {data.name}
                                </h2>
                                <div className={`inline-block px-3 py-1 border text-[10px] font-mono uppercase tracking-widest rounded-full ${getStatusColor(data.status)}`}>
                                    STATUS: {data.status}
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveAsteroid(null)}
                                className="text-orbital-grey hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Tagline */}
                        <p className="font-orbitron text-lg text-hud-silver/80 border-b border-white/10 pb-4">
                            {data.tagline}
                        </p>

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-mono text-orbital-grey uppercase tracking-widest">Mission Brief</h3>
                            <p className="text-sm font-inter text-hud-silver leading-relaxed">
                                {data.metadata.description}
                            </p>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-xs font-mono text-orbital-grey uppercase tracking-widest mb-2">Pricing Model</h3>
                                <span className="text-sm font-inter text-white">{data.metadata.pricingModel}</span>
                            </div>
                            <div>
                                <h3 className="text-xs font-mono text-orbital-grey uppercase tracking-widest mb-2">Orbit Distance</h3>
                                <span className="text-sm font-inter text-white">{data.orbitDistance} AU</span>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <h3 className="text-xs font-mono text-orbital-grey uppercase tracking-widest mb-3">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.metadata.techStack.map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-tech-blue rounded">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Links */}
                        <div className="pt-6 mt-auto border-t border-white/10 flex gap-4">
                            {data.metadata.links.liveUrl && (
                                <a href={data.metadata.links.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-3 text-xs flex-1 text-center">
                                    Launch App
                                </a>
                            )}
                            {data.metadata.links.githubUrl && (
                                <a href={data.metadata.links.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-6 py-3 text-xs flex-1 text-center">
                                    Source Code
                                </a>
                            )}
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}