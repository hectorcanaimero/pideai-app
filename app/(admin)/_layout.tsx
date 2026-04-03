import { Tabs } from "expo-router";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  MoreHorizontal,
} from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { View, Text, ActivityIndicator } from "react-native";

export default function AdminLayout() {
  const { store, loading, isStoreOwner } = useStore();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark">
        <ActivityIndicator size="large" color="#FFC300" />
        <Text className="text-cream-300 mt-4 font-sans">
          Cargando tienda...
        </Text>
      </View>
    );
  }

  if (!store || !isStoreOwner) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark px-8">
        <Text className="text-xl font-sans-bold text-white text-center">
          No tenés acceso a ninguna tienda
        </Text>
        <Text className="text-cream-400 mt-2 text-center font-sans">
          Contactá al soporte si creés que es un error.
        </Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopColor: "#2D2D44",
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#FFC300",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontFamily: "Poppins-Medium",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menú",
          tabBarIcon: ({ color, size }) => (
            <UtensilsCrossed size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Más",
          tabBarIcon: ({ color, size }) => (
            <MoreHorizontal size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
