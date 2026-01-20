'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from './AdminProvider';
import { useAppStore } from '@/store/useAppStore';
import { AsteroidData } from '@/types';
import ProjectForm from './ProjectForm';
import CompanySettings from './CompanySettings';

export default function AdminPanel() {
    const { isAdmin, clientIP, authMethod } = useAdmin();
    const asteroids = useAppStore((state) => state.asteroids);
    const refreshAsteroids = useAppStore((state) => state.refreshAsteroids);

    const [isOpen, setIsOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<AsteroidData | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isCompanySettingsOpen, setIsCompanySettingsOpen] = useState(false);


    const handleDelete = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setDeleteConfirm(null);
                refreshAsteroids();
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    }, [refreshAsteroids]);

    const handleFormClose = useCallback(() => {
        setEditingProject(null);
        setIsCreating(false);
        refreshAsteroids();
    }, [refreshAsteroids]);

    if (!isAdmin) return null;

    return (
        <>
            {/* Admin Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-4 bottom-20 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-redmoon-crimson to-red-800 text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center pointer-events-auto"
                title="Admin Panel"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>

            {/* Admin Panel Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -400 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 h-full w-full md:w-[420px] z-40 glass-panel border-r border-white/10 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <h2 className="font-orbitron text-2xl font-bold text-white">Admin Panel</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-orbital-grey hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-orbital-grey mt-2 font-mono">
                                {authMethod === 'ip' ? `IP: ${clientIP}` : 'PIN authenticated'}
                            </p>

                            {/* Quick Actions */}
                            <button
                                onClick={() => setIsCompanySettingsOpen(true)}
                                className="mt-4 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-tech-blue/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-tech-blue">
                                        <path d="M3 21h18" />
                                        <path d="M9 8h1" />
                                        <path d="M9 12h1" />
                                        <path d="M9 16h1" />
                                        <path d="M14 8h1" />
                                        <path d="M14 12h1" />
                                        <path d="M14 16h1" />
                                        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                                    </svg>
                                </div>
                                <div className="text-left flex-1">
                                    <span className="text-sm text-white font-medium group-hover:text-tech-blue transition-colors">Company Settings</span>
                                    <p className="text-xs text-orbital-grey">Legal, contact &amp; branding info</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orbital-grey group-hover:text-white transition-colors">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>

                        {/* Project List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-mono text-orbital-grey uppercase tracking-wider">
                                    Projects ({asteroids.length})
                                </h3>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="px-4 py-2 bg-neon-green/20 border border-neon-green text-neon-green text-xs font-mono rounded hover:bg-neon-green/30 transition-colors"
                                >
                                    + Add New
                                </button>
                            </div>

                            <div className="space-y-3">
                                {asteroids.map((project) => (
                                    <div
                                        key={project.id}
                                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-orbitron text-white font-medium truncate">
                                                    {project.name}
                                                </h4>
                                                <p className="text-xs text-orbital-grey mt-1 truncate">
                                                    {project.tagline}
                                                </p>
                                                <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-mono rounded ${project.status === 'Live' ? 'bg-neon-green/20 text-neon-green' :
                                                    project.status === 'Beta' ? 'bg-solar-yellow/20 text-solar-yellow' :
                                                        'bg-sunset-orange/20 text-sunset-orange'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 ml-3">
                                                <button
                                                    onClick={() => setEditingProject(project)}
                                                    className="p-2 text-tech-blue hover:bg-tech-blue/20 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(project.id)}
                                                    className="p-2 text-redmoon-crimson hover:bg-redmoon-crimson/20 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 6h18" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Delete Confirmation */}
                                        {deleteConfirm === project.id && (
                                            <div className="mt-3 p-3 bg-redmoon-crimson/10 border border-redmoon-crimson/30 rounded">
                                                <p className="text-xs text-redmoon-crimson mb-2">Delete this project?</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="px-3 py-1 bg-redmoon-crimson text-white text-xs rounded"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-3 py-1 bg-white/10 text-white text-xs rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Project Form Modal */}
            <AnimatePresence>
                {(editingProject || isCreating) && (
                    <ProjectForm
                        project={editingProject}
                        onClose={handleFormClose}
                    />
                )}
            </AnimatePresence>

            {/* Company Settings Modal */}
            <AnimatePresence>
                {isCompanySettingsOpen && (
                    <CompanySettings
                        onClose={() => setIsCompanySettingsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
