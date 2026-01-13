import { AsteroidData } from "@/types";

export const ASTEROIDS: AsteroidData[] = [
    {
        id: "nexus",
        name: "NEXUS",
        tagline: "Centralized Identity Management",
        visualAsset: {
            geometry: "icosahedron",
            color: "#FF2A2A", // Redmoon Crimson
            size: 0.8,
        },
        orbitDistance: 8,
        orbitSpeed: 0.2,
        status: "Live",
        metadata: {
            pricingModel: "Subscription",
            techStack: ["Next.js", "Auth0", "PostgreSQL"],
            description: "A unified identity layer connecting all Redmoon ecosystem services through a single secure credential key.",
            links: {
                liveUrl: "https://example.com",
                docsUrl: "https://example.com/docs",
            },
        },
    },
    {
        id: "vertex",
        name: "VERTEX",
        tagline: "High-Frequency Trading Engine",
        visualAsset: {
            geometry: "octahedron",
            color: "#2A9DFF", // Tech Blue
            size: 0.6,
        },
        orbitDistance: 10,
        orbitSpeed: 0.35,
        status: "Beta",
        metadata: {
            pricingModel: "Subscription",
            techStack: ["Rust", "gRPC", "Redis"],
            description: "Low-latency order execution engine designed for institutional digital asset arbitrage.",
            links: {
                githubUrl: "https://github.com",
            },
        },
    },
    {
        id: "nova",
        name: "NOVA",
        tagline: "Generative Design System",
        visualAsset: {
            geometry: "dodecahedron",
            color: "#00FF94", // Neon Green
            size: 0.7,
        },
        orbitDistance: 12,
        orbitSpeed: 0.15,
        status: "Live",
        metadata: {
            pricingModel: "One-Time",
            techStack: ["React", "Three.js", "WebGL"],
            description: "AI-assisted design tool generating UI component libraries from simple text prompts.",
            links: {
                liveUrl: "https://example.com",
            },
        },
    },
    {
        id: "horizon",
        name: "HORIZON",
        tagline: "Decentralized Storage Network",
        visualAsset: {
            geometry: "icosahedron",
            color: "#E0E0E0", // HUD Silver
            size: 0.5,
        },
        orbitDistance: 14,
        orbitSpeed: 0.25,
        status: "Sunset",
        metadata: {
            pricingModel: "Free",
            techStack: ["IPFS", "Solidity", "Go"],
            description: "Legacy distributed file storage protocol. Currently in maintenance mode.",
            links: {
                githubUrl: "https://github.com",
            },
        },
    },
    {
        id: "aegis",
        name: "AEGIS",
        tagline: "Smart Contract Sentinel",
        visualAsset: {
            geometry: "octahedron",
            color: "#FFD600", // Solar Yellow
            size: 0.9,
        },
        orbitDistance: 16,
        orbitSpeed: 0.1,
        status: "Beta",
        metadata: {
            pricingModel: "Subscription",
            techStack: ["Python", "TensorFlow", "Ethereum"],
            description: "Real-time anomaly detection for smart contract interactions and transaction flows.",
            links: {
                docsUrl: "https://example.com",
            },
        },
    },
];