// Core Data Schema based on Project Overview
export interface AsteroidData {
    id: string;
    name: string;
    tagline: string;
    catchPhrase?: string; // Marketing catchphrase for landing page

    // Visual properties for the 3D scene
    visualAsset: {
        geometry: 'icosahedron' | 'dodecahedron' | 'octahedron';
        color: string;
        size: number;
        logo: string; // Path to SVG logo or Firebase Storage URL
    };

    // Branding colors for the project
    brandingColors?: {
        primary: string;   // Main brand color
        secondary: string; // Secondary accent
        accent: string;    // Highlight color
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
        description: string; // Short description for HUD
        longDescription?: string; // Full markdown description for landing page
        features?: {
            name: string;
            description: string;
            icon: string; // lucide icon name
        }[]; // Key features list
        links: {
            // Main Actions
            liveUrl?: string;
            forgeDashboardUrl?: string; // Forge Dashboard public view URL
            docsUrl?: string;

            // Social & Community
            githubUrl?: string;
            twitter?: string;
            productHunt?: string;
            facebook?: string;
            reddit?: string;
            discord?: string;
            supportEmail?: string;
        };
    };

    // Pricing plans for subscription/paid products (multiple tiers)
    pricingPlans?: {
        name: string;           // e.g., "Starter", "Pro", "Enterprise"
        price: number;
        billingCycle: 'monthly' | 'yearly' | 'one-time' | 'free';
        currency: string;       // e.g., "USD", "EUR"
        description: string;    // Brief tier description
        features: string[];     // Included features
        highlighted?: boolean;  // For "most popular" badge
    }[];

    // Legacy pricing (kept for backward compatibility)
    pricing?: {
        monthlyPrice?: number;
        yearlyPrice?: number;
        oneTimePrice?: number;
        currency: string; // e.g., "USD", "EUR"
        features?: string[]; // What's included
    };

    // Gallery images (Firebase Storage URLs)
    screenshots?: string[];

    // Timestamps
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
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

// Company Legal Information
export interface CompanyInfo {
    // Basic Info
    companyName: string;
    tagline?: string;
    foundedYear?: number;

    // Contact Information
    contact: {
        email?: string;
        phone?: string;
        supportEmail?: string;
    };

    // Address
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };

    // Social Links
    social?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        discord?: string;
        youtube?: string;
        instagram?: string;
    };

    // Legal Documents (Markdown content or URLs)
    legal?: {
        privacyPolicy?: string;
        termsOfService?: string;
        cookiePolicy?: string;
        refundPolicy?: string;
    };

    // Branding
    branding?: {
        logo?: string;
        favicon?: string;
        primaryColor?: string;
        secondaryColor?: string;
    };

    // SEO & Metadata
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
    };

    // Timestamps
    updatedAt?: string;
}