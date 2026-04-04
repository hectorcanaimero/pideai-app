import { Stack } from "expo-router";

export default function CustomersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#EB1C8D",
        headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Clientes" }} />
      <Stack.Screen name="[id]" options={{ title: "Cliente" }} />
    </Stack>
  );
}
