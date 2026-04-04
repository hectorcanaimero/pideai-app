import { Stack } from "expo-router";

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1A1A1A" },
        headerTintColor: "#EB1C8D",
        headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pedidos" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle" }} />
      <Stack.Screen
        name="kitchen"
        options={{ title: "Cocina", headerStyle: { backgroundColor: "#000" } }}
      />
    </Stack>
  );
}
