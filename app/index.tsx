import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (session) {
      router.replace("/(admin)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [session, loading]);

  return (
    <View className="flex-1 items-center justify-center bg-elegant-dark">
      <ActivityIndicator size="large" color="#EB1C8D" />
    </View>
  );
}
