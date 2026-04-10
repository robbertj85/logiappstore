import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B3054",
          light: "#2A4A7F",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#7AB648",
          dark: "#5A9A2F",
          foreground: "#FFFFFF",
        },
        highlight: "#00A3E0",
        surface: "#FFFFFF",
        background: "#F5F6F8",
        border: "#E2E5EB",
        danger: "#DC2626",
        warning: "#F59E0B",
        muted: {
          DEFAULT: "#F5F6F8",
          foreground: "#6B7280",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1B3054",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
