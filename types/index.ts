// Core Data Schema based on Project Overview
export interface AsteroidData {
    id: string;
    name: string;
    tagline: string;

    // Visual properties for the 3D scene
    visualAsset: {
        geometry: 'icosahedron' | 'dodecahedron' | 'octahedron';
        color: string;
        size: number;
    };

    // Orbit physics
    orbitDistance: number; // Distance from Redmoon center (8-15 units)
    orbitSpeed: number;    // Rotation speed around Y axis

    // Product Status
    status: 'Live' | 'Beta' | 'Sunset';

    // Detailed metadata for the HUD Overlay
    metadata: {
        pricingModel: 'Subscription' | 'One-Time' | 'Free';
        techStack: string[];
        description: string; // Added description field for the HUD body text
        links: {
            liveUrl?: string;
            docsUrl?: string;
            githubUrl?: string;
        };
    };
}

// Props for the 3D Asteroid Component
export interface AsteroidProps {
    data: AsteroidData;
    // onClick is handled via global state, but we might pass local handlers if needed
}

// Props for the Scene Container
export interface SceneProps {
    asteroids: AsteroidData[];
}