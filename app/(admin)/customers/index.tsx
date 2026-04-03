import { View, Text } from "react-native";
import { Users } from "lucide-react-native";

export default function CustomersScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-elegant-dark">
      <Users size={48} color="#FFC300" />
      <Text className="text-white font-sans-semibold text-lg mt-4">
        Clientes
      </Text>
      <Text className="text-cream-400 font-sans mt-1">Próximamente</Text>
    </View>
  );
}
