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
        "redmoon-crimson": "#FF2A2A",
        "hud-silver": "#E0E0E0",
        "orbital-grey": "#6B7280",

        // Semantic Colors
        "neon-green": "#00FF94",    // Success/Live
        "solar-yellow": "#FFD600",  // Warning/Beta
        "tech-blue": "#2A9DFF",     // Info/Tech
        "sunset-orange": "#FF8800", // Status/Sunset
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backdropBlur: {
        glass: "10px",
      },
    },
  },
  plugins: [],
};
export default config;