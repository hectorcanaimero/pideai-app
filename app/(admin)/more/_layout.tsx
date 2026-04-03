import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1A1A2E" },
        headerTintColor: "#FFC300",
        headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Más" }} />
      <Stack.Screen name="settings/store-info" options={{ title: "Info de tienda" }} />
      <Stack.Screen name="settings/business-hours" options={{ title: "Horarios" }} />
      <Stack.Screen name="settings/payment" options={{ title: "Pagos" }} />
      <Stack.Screen name="settings/currency" options={{ title: "Conversión" }} />
      <Stack.Screen name="settings/order-settings" options={{ title: "Pedidos" }} />
      <Stack.Screen name="settings/delivery" options={{ title: "Delivery" }} />
      <Stack.Screen name="settings/design" options={{ title: "Diseño" }} />
      <Stack.Screen name="settings/advanced" options={{ title: "Avanzado" }} />
      <Stack.Screen name="subscription" options={{ title: "Suscripción" }} />
      <Stack.Screen name="promotions" options={{ title: "Promociones" }} />
      <Stack.Screen name="coupons" options={{ title: "Cupones" }} />
    </Stack>
  );
}
