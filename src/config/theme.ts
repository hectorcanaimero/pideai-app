// src/config/theme.ts
export const colors = {
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
  elegantDark: "#1A1A2E",
  elegantGray: "#2D2D44",
  status: {
    pending: "#EAB308",
    confirmed: "#3B82F6",
    preparing: "#A855F7",
    ready: "#22C55E",
    outForDelivery: "#F97316",
    delivered: "#6B7280",
    cancelled: "#EF4444",
  },
} as const;

export const fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;
