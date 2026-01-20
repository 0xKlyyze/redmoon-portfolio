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
            logo: "/logos/favicon.svg",
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
                forgeDashboardUrl: "https://forge.redmoon.com/project/nexus",
            },
        },
        pricingPlans: [
            {
                name: "Developer",
                price: 0,
                billingCycle: "free",
                currency: "USD",
                description: "For personal projects",
                features: ["Up to 1,000 MAU", "Social Login", "Community Support"]
            },
            {
                name: "Startup",
                price: 49,
                billingCycle: "monthly",
                currency: "USD",
                description: "Growing teams",
                features: ["Up to 10,000 MAU", "Custom Domain", "Email Support", "MFA"],
                highlighted: true
            },
            {
                name: "Enterprise",
                price: 299,
                billingCycle: "monthly",
                currency: "USD",
                description: "Large scale apps",
                features: ["Unlimited MAU", "SLA 99.9%", "Dedicated Support", "SSO"]
            }
        ]
    },
    {
        id: "vertex",
        name: "VERTEX",
        tagline: "High-Frequency Trading Engine",
        visualAsset: {
            geometry: "octahedron",
            color: "#2A9DFF", // Tech Blue
            size: 0.6,
            logo: "/logos/favicon.svg",
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
                forgeDashboardUrl: "https://forge.redmoon.com/project/vertex",
            },
        },
        pricingPlans: [
            {
                name: "Pro Trader",
                price: 199,
                billingCycle: "monthly",
                currency: "USD",
                description: "For active traders",
                features: ["5ms Latency", "100 TPS", "Real-time Metrics"]
            },
            {
                name: "Institution",
                price: 999,
                billingCycle: "monthly",
                currency: "USD",
                description: "For funds & firms",
                features: ["<1ms Latency", "10,000 TPS", "Direct Market Access", "Co-location"],
                highlighted: true
            }
        ]
    },
    {
        id: "nova",
        name: "NOVA",
        tagline: "Generative Design System",
        visualAsset: {
            geometry: "dodecahedron",
            color: "#00FF94", // Neon Green
            size: 0.7,
            logo: "/logos/favicon.svg",
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
                forgeDashboardUrl: "https://forge.redmoon.com/project/nova",
            },
        },
        pricingPlans: [
            {
                name: "Standard License",
                price: 149,
                billingCycle: "one-time",
                currency: "USD",
                description: "Single project use",
                features: ["Component Generator", "Figma Export", "1 Year Updates"]
            },
            {
                name: "Extended License",
                price: 399,
                billingCycle: "one-time",
                currency: "USD",
                description: "Unlimited projects",
                features: ["Commercial Use", "Source Code Access", "Lifetime Updates", "Priority Support"],
                highlighted: true
            }
        ]
    },
    {
        id: "horizon",
        name: "HORIZON",
        tagline: "Decentralized Storage Network",
        visualAsset: {
            geometry: "icosahedron",
            color: "#E0E0E0", // HUD Silver
            size: 0.5,
            logo: "/logos/favicon.svg",
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
                forgeDashboardUrl: "https://forge.redmoon.com/project/horizon",
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
            logo: "/logos/favicon.svg",
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
                forgeDashboardUrl: "https://forge.redmoon.com/project/aegis",
            },
        },
        pricingPlans: [
            {
                name: "Auditor",
                price: 29,
                billingCycle: "monthly",
                currency: "USD",
                description: "Single contract monitoring",
                features: ["24/7 Monitoring", "Email Alerts", "Basic Reporting"]
            }
        ]
    },
];