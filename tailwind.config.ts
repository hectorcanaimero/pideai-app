import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EB1C8D",
          600: "#D6187F",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
        },
        surface: {
          50: "#FFFFFF",
          100: "#F7EBF4",
          200: "#F0EFEF",
          300: "#E5E5E5",
          400: "#D4D4D4",
        },
        neutral: {
          dark: "#1A1A1A",
          gray: "#2A2A2A",
          muted: "#6B6B6B",
          light: "#A3A3A3",
        },
        badge: {
          pink: "#FADADF",
        },
        // Keep gold as alias for backward compat during migration
        gold: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EB1C8D",
          600: "#D6187F",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
        },
        cream: {
          50: "#FFFFFF",
          100: "#F7EBF4",
          200: "#F0EFEF",
          300: "#E5E5E5",
          400: "#D4D4D4",
          500: "#A3A3A3",
        },
        "elegant-dark": "#1A1A1A",
        "elegant-gray": "#2A2A2A",
      },
      fontFamily: {
        sans: ["Poppins-Regular"],
        "sans-medium": ["Poppins-Medium"],
        "sans-semibold": ["Poppins-SemiBold"],
        "sans-bold": ["Poppins-Bold"],
      },
    },
  },
  plugins: [],
} satisfies Config;
