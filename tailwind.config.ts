import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          hover: "#F4C542",
        },
        premium: {
          bg: "#0B0B0B",
          card: "#161616",
          hover: "#1E1E1E",
          border: "#2A2A2A",
          muted: "#A0A0A0",
        },
        success: "#00C853",
        warning: "#FF9800",
        danger: "#FF5252",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0.8)", opacity: "0.5" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.4s ease-out both",
        fadeIn: "fadeIn 0.3s ease-out both",
        shimmer: "shimmer 1.6s infinite linear",
        bounceDot: "bounceDot 1.2s infinite ease-in-out",
      },
      boxShadow: {
        gold: "0 0 24px rgba(212,175,55,0.18)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-gold": "0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.08)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37, #F4C542)",
        "gold-gradient-r": "linear-gradient(to right, transparent, #D4AF37, transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
