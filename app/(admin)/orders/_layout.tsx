import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ChefHat } from "lucide-react-native";
import { useOrdersRealtime } from "@/hooks/useOrders";
import { useStore } from "@/contexts/StoreContext";

export default function OrdersLayout() {
  const { store } = useStore();
  useOrdersRealtime();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#EB1C8D",
        headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
          headerRight: store?.is_food_business
            ? () => (
                <TouchableOpacity
                  onPress={() => router.push("/(admin)/orders/kitchen")}
                  activeOpacity={0.7}
                  style={{ marginRight: 4 }}
                >
                  <ChefHat size={22} color="#EB1C8D" />
                </TouchableOpacity>
              )
            : undefined,
        }}
      />
      <Stack.Screen name="[id]" options={{ title: "Detalle" }} />
      <Stack.Screen
        name="kitchen"
        options={{ title: "Cocina", headerStyle: { backgroundColor: "#F0EFEF" } }}
      />
    </Stack>
  );
}
