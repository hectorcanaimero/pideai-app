import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1A1A2E" },
        headerTintColor: "#FFC300",
        headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Menu" }} />
      <Stack.Screen name="category/[id]" options={{ title: "Categoria" }} />
      <Stack.Screen name="product/[id]" options={{ title: "Producto" }} />
      <Stack.Screen name="product/create" options={{ title: "Nuevo Producto" }} />
      <Stack.Screen name="extras/[groupId]" options={{ title: "Extras" }} />
    </Stack>
  );
}
