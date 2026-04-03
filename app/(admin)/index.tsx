import { View, Text } from "react-native";
import { LayoutDashboard } from "lucide-react-native";

export default function DashboardScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-elegant-dark">
      <LayoutDashboard size={48} color="#FFC300" />
      <Text className="text-white font-sans-semibold text-lg mt-4">
        Inicio
      </Text>
      <Text className="text-cream-400 font-sans mt-1">Próximamente</Text>
    </View>
  );
}
