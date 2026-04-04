import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Store,
  Clock,
  CreditCard,
  Wallet,
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
  Layers,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/contexts/StoreContext";
import { supabase } from "@/services/supabase";
import { router } from "expo-router";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function MoreScreen() {
  const { signOut } = useAuth();
  const { store } = useStore();

  // Check module access for WhatsApp
  const { data: hasWhatsapp } = useQuery({
    queryKey: ["module-access", store?.id, "whatsapp"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_module_enabled", {
        p_store_id: store!.id,
        p_module_name: "whatsapp",
      });
      if (error) return false;
      return data as boolean;
    },
    enabled: !!store?.id,
  });

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
    { icon: <Store size={22} color="#EB1C8D" />, label: "Info de tienda", onPress: () => router.push("/(admin)/more/settings/store-info") },
    { icon: <Clock size={22} color="#EB1C8D" />, label: "Horarios", onPress: () => router.push("/(admin)/more/settings/business-hours") },
    { icon: <CreditCard size={22} color="#EB1C8D" />, label: "Pagos", onPress: () => router.push("/(admin)/more/settings/payment") },
    { icon: <Wallet size={22} color="#EB1C8D" />, label: "Métodos de pago", onPress: () => router.push("/(admin)/more/settings/payment-methods") },
    { icon: <DollarSign size={22} color="#EB1C8D" />, label: "Conversión de moneda", onPress: () => router.push("/(admin)/more/settings/currency") },
    { icon: <ShoppingBag size={22} color="#EB1C8D" />, label: "Config. de pedidos", onPress: () => router.push("/(admin)/more/settings/order-settings") },
    { icon: <Truck size={22} color="#EB1C8D" />, label: "Entrega", onPress: () => router.push("/(admin)/more/settings/delivery") },
    { icon: <Palette size={22} color="#EB1C8D" />, label: "Diseño", onPress: () => router.push("/(admin)/more/settings/design") },
    { icon: <Wrench size={22} color="#EB1C8D" />, label: "Avanzado", onPress: () => router.push("/(admin)/more/settings/advanced") },
  ];

  const otherItems: MenuItem[] = [
    { icon: <BarChart3 size={22} color="#EB1C8D" />, label: "Analíticas", onPress: () => router.push("/(admin)/more/analytics") },
    { icon: <Tag size={22} color="#EB1C8D" />, label: "Promociones", onPress: () => router.push("/(admin)/more/promotions") },
    { icon: <Ticket size={22} color="#EB1C8D" />, label: "Cupones", onPress: () => router.push("/(admin)/more/coupons") },
    { icon: <CreditCard size={22} color="#EB1C8D" />, label: "Suscripción", onPress: () => router.push("/(admin)/more/subscription") },
    { icon: <Layers size={22} color="#EB1C8D" />, label: "Grupos de Extra", onPress: () => router.push("/(admin)/more/extras") },
    // WhatsApp only shows if module is enabled in subscription
    ...(hasWhatsapp
      ? [
          {
            icon: <MessageCircle size={22} color="#EB1C8D" />,
            label: "WhatsApp",
            onPress: () => router.push("/(admin)/more/whatsapp"),
          },
        ]
      : []),
    { icon: <Sparkles size={22} color="#EB1C8D" />, label: "AI Studio", onPress: () => router.push("/(admin)/more/ai-studio") },
    { icon: <HelpCircle size={22} color="#EB1C8D" />, label: "Central de ayuda", onPress: () => router.push("/(admin)/more/help") },
  ];

  return (
    <ScrollView className="flex-1 bg-elegant-dark">
      <View className="px-4 py-6 border-b border-elegant-gray">
        <Text className="text-text-primary font-sans-bold text-xl">
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
            <Text className="flex-1 text-text-primary font-sans text-base">
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
            <Text className="flex-1 text-text-primary font-sans text-base">
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
