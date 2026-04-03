import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { WifiOff } from "lucide-react-native";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!(state.isConnected && state.isInternetReachable !== false));
    });

    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View className="bg-red-600 px-4 py-2 flex-row items-center justify-center gap-2">
      <WifiOff size={14} color="#fff" />
      <Text className="text-white font-sans-medium text-xs">Sin conexión a internet</Text>
    </View>
  );
}
