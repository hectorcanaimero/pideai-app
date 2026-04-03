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
        gold: {
          50: "#FFF9E6",
          100: "#FFF3CC",
          200: "#FFE799",
          300: "#FFDB66",
          400: "#FFCF33",
          500: "#FFC300",
          600: "#CC9C00",
          700: "#997500",
          800: "#664E00",
          900: "#332700",
        },
        cream: {
          50: "#FFFDF7",
          100: "#FFFBEF",
          200: "#FFF7DF",
          300: "#FFF3CF",
          400: "#FFEFBF",
          500: "#FFEBAF",
        },
        "elegant-dark": "#1A1A2E",
        "elegant-gray": "#2D2D44",
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
