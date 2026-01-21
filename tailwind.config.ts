import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette
        "deep-void": "#0A0A0A",
        "void-dark": "#050505",
        "redmoon-crimson": "#FF2A2A",
        "redmoon-glow": "#FF4444",
        "hud-silver": "#E0E0E0",
        "orbital-grey": "#6B7280",
        "surface": "#141414",
        "surface-elevated": "#1A1A1A",

        // Semantic Colors
        "neon-green": "#00FF94",    // Success/Live
        "solar-yellow": "#FFD600",  // Warning/Beta
        "tech-blue": "#2A9DFF",     // Info/Tech
        "sunset-orange": "#FF8800", // Status/Sunset

        // Premium Accent Gradients (for reference)
        "accent-purple": "#8B5CF6",
        "accent-cyan": "#06B6D4",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        // Refined typography scale
        "display": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "headline": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "title": ["1.75rem", { lineHeight: "1.3", letterSpacing: "0" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
      },
      spacing: {
        // Extended spacing for refined layouts
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Premium gradients
        "gradient-premium": "linear-gradient(135deg, rgba(255,42,42,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.1) 100%)",
        "gradient-shine": "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
      },
      backdropBlur: {
        glass: "12px",
        "glass-heavy": "24px",
      },
      boxShadow: {
        // Premium shadows
        "glow": "0 0 20px rgba(255, 42, 42, 0.3)",
        "glow-lg": "0 0 40px rgba(255, 42, 42, 0.4)",
        "glow-subtle": "0 0 30px rgba(255, 255, 255, 0.05)",
        "elevated": "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)",
        "panel": "0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 42, 42, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 42, 42, 0.6)" },
        },
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};
export default config;