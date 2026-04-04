module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|nativewind|react-native-css-interop|@supabase/supabase-js|lucide-react-native|react-native-qrcode-svg|react-native-svg|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@tanstack/react-query|zustand|expo-haptics|expo-secure-store|expo-notifications|expo-av|expo-image-picker|expo-local-authentication|expo-device|expo-constants|expo-linking|expo-router|@react-native-community/netinfo)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/integrations/**",
  ],
  coverageReporters: ["html", "text", "text-summary", "lcov"],
  coverageDirectory: "coverage",
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
};
