import { View, Text } from "react-native";
import { UtensilsCrossed } from "lucide-react-native";

export default function MenuScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-elegant-dark">
      <UtensilsCrossed size={48} color="#FFC300" />
      <Text className="text-white font-sans-semibold text-lg mt-4">Menú</Text>
      <Text className="text-cream-400 font-sans mt-1">Próximamente</Text>
    </View>
  );
}
