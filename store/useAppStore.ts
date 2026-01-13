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
}

export const useAppStore = create<AppState>((set) => ({
    // Initial State
    activeAsteroid: null,
    isTransitioning: false,
    isCompanyModalOpen: false,
    asteroids: ASTEROIDS, // Load static data immediately

    // Actions
    setActiveAsteroid: (id) => set({ activeAsteroid: id }),
    setIsTransitioning: (value) => set({ isTransitioning: value }),
    setCompanyModalOpen: (value) => set({ isCompanyModalOpen: value }),
}));