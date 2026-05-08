import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Bell,
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
import { useState } from "react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

type Tab = "herramientas" | "configuracion";

export default function MoreScreen() {
  const { signOut } = useAuth();
  const { store } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("herramientas");

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

  const toolItems: MenuItem[] = [
    { icon: <Bell size={22} color="#EB1C8D" />, label: "Notificaciones", onPress: () => router.push("/(admin)/notifications") },
    { icon: <BarChart3 size={22} color="#EB1C8D" />, label: "Analíticas", onPress: () => router.push("/(admin)/more/analytics") },
    { icon: <Tag size={22} color="#EB1C8D" />, label: "Promociones", onPress: () => router.push("/(admin)/more/promotions") },
    { icon: <Ticket size={22} color="#EB1C8D" />, label: "Cupones", onPress: () => router.push("/(admin)/more/coupons") },
    { icon: <CreditCard size={22} color="#EB1C8D" />, label: "Suscripción", onPress: () => router.push("/(admin)/more/subscription") },
    { icon: <Layers size={22} color="#EB1C8D" />, label: "Grupos de Extra", onPress: () => router.push("/(admin)/more/extras") },
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

  const isCatalogOnly = store?.catalog_mode === true;

  const settingsItems: MenuItem[] = [
    { icon: <Store size={22} color="#EB1C8D" />, label: "Info de tienda", onPress: () => router.push("/(admin)/more/settings/store-info") },
    { icon: <Clock size={22} color="#EB1C8D" />, label: "Horarios", onPress: () => router.push("/(admin)/more/settings/business-hours") },
    ...(!isCatalogOnly
      ? [
          { icon: <CreditCard size={22} color="#EB1C8D" />, label: "Pagos", onPress: () => router.push("/(admin)/more/settings/payment") },
          { icon: <Wallet size={22} color="#EB1C8D" />, label: "Métodos de pago", onPress: () => router.push("/(admin)/more/settings/payment-methods") },
        ]
      : []),
    { icon: <DollarSign size={22} color="#EB1C8D" />, label: "Conversión de moneda", onPress: () => router.push("/(admin)/more/settings/currency") },
    ...(!isCatalogOnly
      ? [
          { icon: <ShoppingBag size={22} color="#EB1C8D" />, label: "Config. de pedidos", onPress: () => router.push("/(admin)/more/settings/order-settings") },
          { icon: <Truck size={22} color="#EB1C8D" />, label: "Entrega", onPress: () => router.push("/(admin)/more/settings/delivery") },
        ]
      : []),
    { icon: <Palette size={22} color="#EB1C8D" />, label: "Diseño", onPress: () => router.push("/(admin)/more/settings/design") },
    { icon: <Wrench size={22} color="#EB1C8D" />, label: "Avanzado", onPress: () => router.push("/(admin)/more/settings/advanced") },
  ];

  const activeItems = activeTab === "herramientas" ? toolItems : settingsItems;

  return (
    <ScrollView className="flex-1 bg-elegant-dark">
      {/* Store Info Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-text-primary font-sans-bold text-lg">
          {store?.name ?? "Mi Tienda"}
        </Text>
        <Text className="text-cream-400 font-sans text-sm">
          {store?.subdomain}.pideai.com
        </Text>
      </View>

      {/* Tab Switcher */}
      <View className="flex-row mx-4 mt-3 mb-4 bg-elegant-gray rounded-xl p-1">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg items-center ${activeTab === "herramientas" ? "bg-primary" : ""}`}
          onPress={() => setActiveTab("herramientas")}
          activeOpacity={0.7}
        >
          <Text
            className={`font-sans-semibold text-sm ${activeTab === "herramientas" ? "text-white" : "text-cream-400"}`}
          >
            Herramientas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg items-center ${activeTab === "configuracion" ? "bg-primary" : ""}`}
          onPress={() => setActiveTab("configuracion")}
          activeOpacity={0.7}
        >
          <Text
            className={`font-sans-semibold text-sm ${activeTab === "configuracion" ? "text-white" : "text-cream-400"}`}
          >
            Configuración
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View>
        {activeItems.map((item, index) => (
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

      {/* Logout */}
      <View className="px-4 mt-6 mb-8">
        <TouchableOpacity
          className="bg-red-500 rounded-xl py-3 flex-row items-center justify-center"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={18} color="#FFFFFF" />
          <Text className="text-white font-sans-semibold text-base ml-2">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
