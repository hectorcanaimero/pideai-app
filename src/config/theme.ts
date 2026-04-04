export const colors = {
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
    white: "#FFFFFF",
    roseSoft: "#F7EBF4",
    grayPearl: "#F0EFEF",
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
