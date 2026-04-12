import "../global.css";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { AppState, AppStateStatus } from "react-native";
import { focusManager } from "@tanstack/react-query";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AnimatedSplash } from "@/components/shared/AnimatedSplash";
import { initSentry, captureError } from "@/lib/sentry";

// Initialize Sentry at module level
initSentry();

SplashScreen.preventAutoHideAsync();

function NotificationSetup({ children }: { children: ReactNode }) {
  useOrderNotifications();
  return <>{children}</>;
}

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontError) {
      captureError(fontError, { context: "font-loading" });
    }
    if (fontsLoaded || fontError) {
      // Hide native splash — animated splash takes over seamlessly
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Safety-net: force-hide splash if stuck for more than 8 seconds
  useEffect(() => {
    const safetyNet = setTimeout(() => {
      SplashScreen.hideAsync();
      setShowSplash(false);
    }, 8000);
    return () => clearTimeout(safetyNet);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StoreProvider>
            <NotificationSetup>
              <StatusBar style="dark" backgroundColor="#FFC300" />
              <OfflineBanner />
              <Slot />
              {showSplash && (
                <AnimatedSplash onComplete={handleSplashComplete} />
              )}
            </NotificationSetup>
          </StoreProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
