import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#EB1C8D",
        headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Menú" }} />
      <Stack.Screen name="category/[id]" options={{ title: "Categoría" }} />
      <Stack.Screen name="product/[id]" options={{ title: "Producto" }} />
      <Stack.Screen name="product/create" options={{ title: "Nuevo Producto" }} />
    </Stack>
  );
}
