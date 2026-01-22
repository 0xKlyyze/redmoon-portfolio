import { create } from 'zustand';
import { AsteroidData } from '@/types';
import { ASTEROIDS } from '@/data/asteroids';

interface AppState {
    // Selection State
    activeAsteroid: string | null; // ID of the currently selected asteroid
    setActiveAsteroid: (id: string | null) => void;

    // Camera Animation State
    isTransitioning: boolean;
    setIsTransitioning: (value: boolean) => void;

    // UI Modal State
    isCompanyModalOpen: boolean;
    setCompanyModalOpen: (value: boolean) => void;

    // Data Repository
    asteroids: AsteroidData[];
    isLoading: boolean;
    dataSource: 'static' | 'firestore';

    // Data Actions
    fetchAsteroids: () => Promise<void>;
    refreshAsteroids: () => Promise<void>;
    setAsteroids: (asteroids: AsteroidData[]) => void;

    // Animation Triggers
    lastInteractionTime: number;
    triggerPulse: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial State
    activeAsteroid: null,
    isTransitioning: false,
    isCompanyModalOpen: false,
    asteroids: ASTEROIDS, // Load static data as fallback
    isLoading: false,
    dataSource: 'static',

    // Animation Triggers
    // Animation Triggers
    lastInteractionTime: 0,

    // Actions
    setActiveAsteroid: (id) => set({ activeAsteroid: id }),
    setIsTransitioning: (value) => set({ isTransitioning: value }),
    setCompanyModalOpen: (value) => set({ isCompanyModalOpen: value }),
    setAsteroids: (asteroids) => set({ asteroids }),
    triggerPulse: () => set({ lastInteractionTime: Date.now() }),

    // Fetch asteroids from API
    fetchAsteroids: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();

            if (data.projects && data.projects.length > 0) {
                set({
                    asteroids: data.projects,
                    dataSource: data.source || 'firestore',
                    isLoading: false
                });
            } else {
                // Keep static data as fallback
                set({ isLoading: false, dataSource: 'static' });
            }
        } catch (error) {
            console.error('Failed to fetch asteroids:', error);
            // Keep static data on error
            set({ isLoading: false, dataSource: 'static' });
        }
    },

    // Refresh asteroids after CRUD operations
    refreshAsteroids: async () => {
        await get().fetchAsteroids();
    },
}));
