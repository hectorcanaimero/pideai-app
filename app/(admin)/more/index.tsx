import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Settings,
  BarChart3,
  Tag,
  Ticket,
  CreditCard,
  MessageCircle,
  Truck,
  Sparkles,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/contexts/StoreContext";
import { router } from "expo-router";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function MoreScreen() {
  const { signOut } = useAuth();
  const { store } = useStore();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Settings size={22} color="#FFC300" />,
      label: "Configuración",
      onPress: () => {},
    },
    {
      icon: <BarChart3 size={22} color="#FFC300" />,
      label: "Analíticas",
      onPress: () => {},
    },
    {
      icon: <Tag size={22} color="#FFC300" />,
      label: "Promociones",
      onPress: () => {},
    },
    {
      icon: <Ticket size={22} color="#FFC300" />,
      label: "Cupones",
      onPress: () => {},
    },
    {
      icon: <CreditCard size={22} color="#FFC300" />,
      label: "Suscripción",
      onPress: () => {},
    },
    {
      icon: <MessageCircle size={22} color="#FFC300" />,
      label: "WhatsApp",
      onPress: () => {},
    },
    {
      icon: <Truck size={22} color="#FFC300" />,
      label: "Delivery",
      onPress: () => {},
    },
    {
      icon: <Sparkles size={22} color="#FFC300" />,
      label: "AI Studio",
      onPress: () => {},
    },
    {
      icon: <HelpCircle size={22} color="#FFC300" />,
      label: "Ayuda",
      onPress: () => {},
    },
  ];

  return (
    <ScrollView className="flex-1 bg-elegant-dark">
      <View className="px-4 py-6 border-b border-elegant-gray">
        <Text className="text-white font-sans-bold text-xl">
          {store?.name ?? "Mi Tienda"}
        </Text>
        <Text className="text-cream-400 font-sans text-sm mt-1">
          {store?.subdomain}.pideai.com
        </Text>
      </View>

      <View className="mt-2">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center px-4 py-4 border-b border-elegant-gray"
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View className="w-10">{item.icon}</View>
            <Text className="flex-1 text-white font-sans text-base">
              {item.label}
            </Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="flex-row items-center px-4 py-4 mt-4 border-t border-elegant-gray"
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <View className="w-10">
          <LogOut size={22} color="#EF4444" />
        </View>
        <Text className="flex-1 text-red-500 font-sans text-base">
          Cerrar Sesión
        </Text>
      </TouchableOpacity>

      <View className="h-8" />
    </ScrollView>
  );
}
