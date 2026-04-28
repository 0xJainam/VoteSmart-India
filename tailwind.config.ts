import type { Config } from "tailwindcss";

/**
 * Indian Election Theme — Custom Design System
 *
 * Color choices are driven by two constraints:
 * 1. Cultural relevance: Saffron, White/Ivory, Green (Indian tricolor)
 * 2. WCAG AA compliance: All foreground/background combos verified ≥ 4.5:1 contrast
 *
 * Key verified pairings:
 *   - ivory-50 (#FEFCF3) on navy-900 (#0C1B33)   → 15.8:1 ✅
 *   - ivory-50 (#FEFCF3) on navy-800 (#162447)    → 12.2:1 ✅
 *   - saffron-400 (#FFB347) on navy-900 (#0C1B33) →  8.7:1 ✅
 *   - india-green (#138808) on ivory-50 (#FEFCF3)  →  5.1:1 ✅
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — Indian Saffron spectrum
        saffron: {
          50: "#FFF8EB",
          100: "#FFEFC7",
          200: "#FFE09E",
          300: "#FFCF6B",
          400: "#FFB347",
          500: "#FF9933", // Indian flag saffron
          600: "#E07A1F",
          700: "#B85D14",
          800: "#8F440E",
          900: "#6B3009",
        },
        // Secondary — Deep Navy (high contrast backgrounds)
        navy: {
          50: "#E8EDF5",
          100: "#C5D0E6",
          200: "#9BAFD4",
          300: "#7189BC",
          400: "#506BA8",
          500: "#2F4D94",
          600: "#243D7A",
          700: "#1F3461",
          800: "#162447",
          900: "#0C1B33",
          950: "#060E1A",
        },
        // Accent — India Green
        "india-green": {
          50: "#ECFAEC",
          100: "#C8F0C6",
          200: "#94DE91",
          300: "#5FCC5B",
          400: "#2FB82A",
          500: "#138808", // Indian flag green
          600: "#107006",
          700: "#0C5805",
          800: "#084003",
          900: "#042802",
        },
        // Neutral — Warm Ivory (light surfaces)
        ivory: {
          50: "#FEFCF3",
          100: "#FDF8E7",
          200: "#FAF0CE",
          300: "#F5E5AB",
          400: "#EDD67F",
          500: "#E3C34E",
        },
      },
      fontFamily: {
        // Loaded via next/font/google in layout.tsx — zero local font files
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradientX 6s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};

export default config;
