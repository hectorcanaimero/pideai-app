import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Store,
  Clock,
  CreditCard,
  DollarSign,
  ShoppingBag,
  Truck,
  Palette,
  Wrench,
  BarChart3,
  Tag,
  Ticket,
  MessageCircle,
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

  const settingsItems: MenuItem[] = [
    { icon: <Store size={22} color="#FFC300" />, label: "Info de tienda", onPress: () => router.push("/(admin)/more/settings/store-info") },
    { icon: <Clock size={22} color="#FFC300" />, label: "Horarios", onPress: () => router.push("/(admin)/more/settings/business-hours") },
    { icon: <CreditCard size={22} color="#FFC300" />, label: "Pagos", onPress: () => router.push("/(admin)/more/settings/payment") },
    { icon: <DollarSign size={22} color="#FFC300" />, label: "Conversión de moneda", onPress: () => router.push("/(admin)/more/settings/currency") },
    { icon: <ShoppingBag size={22} color="#FFC300" />, label: "Config. de pedidos", onPress: () => router.push("/(admin)/more/settings/order-settings") },
    { icon: <Truck size={22} color="#FFC300" />, label: "Delivery", onPress: () => router.push("/(admin)/more/settings/delivery") },
    { icon: <Palette size={22} color="#FFC300" />, label: "Diseño", onPress: () => router.push("/(admin)/more/settings/design") },
    { icon: <Wrench size={22} color="#FFC300" />, label: "Avanzado", onPress: () => router.push("/(admin)/more/settings/advanced") },
  ];

  const otherItems: MenuItem[] = [
    { icon: <BarChart3 size={22} color="#FFC300" />, label: "Analíticas", onPress: () => {} },
    { icon: <Tag size={22} color="#FFC300" />, label: "Promociones", onPress: () => router.push("/(admin)/more/promotions") },
    { icon: <Ticket size={22} color="#FFC300" />, label: "Cupones", onPress: () => router.push("/(admin)/more/coupons") },
    { icon: <CreditCard size={22} color="#FFC300" />, label: "Suscripción", onPress: () => {} },
    { icon: <MessageCircle size={22} color="#FFC300" />, label: "WhatsApp", onPress: () => {} },
    { icon: <Sparkles size={22} color="#FFC300" />, label: "AI Studio", onPress: () => {} },
    { icon: <HelpCircle size={22} color="#FFC300" />, label: "Ayuda", onPress: () => {} },
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

      {/* Settings Section */}
      <Text className="text-cream-400 font-sans-medium text-xs px-4 pt-4 pb-2 uppercase tracking-wider">
        Configuración
      </Text>
      <View>
        {settingsItems.map((item, index) => (
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

      {/* Tools Section */}
      <Text className="text-cream-400 font-sans-medium text-xs px-4 pt-6 pb-2 uppercase tracking-wider">
        Herramientas
      </Text>
      <View>
        {otherItems.map((item, index) => (
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
