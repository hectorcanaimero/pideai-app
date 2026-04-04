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
        primary: {
          DEFAULT: "#EB1C8D",
          hover: "#C9157A",
          light: "#F7EBF4",
          badge: "#FADADF",
        },
        background: {
          main: "#F0EFEF",
          soft: "#F7EBF4",
          surface: "#FFFFFF",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B6B6B",
          inverted: "#FFFFFF",
        },
        // Aliases for backward compat (used heavily in existing code)
        gold: {
          500: "#EB1C8D",
          700: "#C9157A",
        },
        cream: {
          100: "#F7EBF4",
          200: "#F0EFEF",
          300: "#D4D4D4",
          400: "#6B6B6B",
        },
        "elegant-dark": "#F0EFEF",
        "elegant-gray": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Poppins-Regular"],
        "sans-medium": ["Poppins-Medium"],
        "sans-semibold": ["Poppins-SemiBold"],
        "sans-bold": ["Poppins-Bold"],
      },
      borderRadius: {
        brand: "0.625rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
