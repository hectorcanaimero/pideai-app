import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { CreditCard, Calendar, Package, ShoppingBag, Layers, ExternalLink, Crown } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: "Activo", bg: "bg-green-900/40", text: "text-green-400" },
  trialing: { label: "Prueba", bg: "bg-blue-900/40", text: "text-blue-400" },
  cancelled: { label: "Cancelado", bg: "bg-red-900/40", text: "text-red-400" },
  past_due: { label: "Pago vencido", bg: "bg-yellow-900/40", text: "text-yellow-400" },
  pending_payment: { label: "Pago pendiente", bg: "bg-orange-900/40", text: "text-orange-400" },
};

const STATUS_BAR_COLORS: Record<string, string> = {
  active: "#22c55e",
  trialing: "#3b82f6",
  cancelled: "#ef4444",
  past_due: "#eab308",
  pending_payment: "#f97316",
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" });
}

function ProgressBar({ label, icon, used, limit }: { label: string; icon: React.ReactNode; used: number; limit: number | null }) {
  const percentage = limit ? Math.min((used / limit) * 100, 100) : 0;
  const isUnlimited = limit === null || limit === undefined || limit === 0;
  const barColor = percentage >= 90 ? "#ef4444" : percentage >= 70 ? "#eab308" : "#FFC300";

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-1.5">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="text-cream-300 font-sans-medium text-sm">{label}</Text>
        </View>
        <Text className="text-cream-400 font-sans text-sm">
          {used} / {isUnlimited ? "Ilimitado" : limit}
        </Text>
      </View>
      <View className="bg-elegant-gray rounded-full h-2.5 overflow-hidden">
        {isUnlimited ? (
          <View className="h-full rounded-full w-full" style={{ backgroundColor: "#FFC300", opacity: 0.3 }} />
        ) : (
          <View
            className="h-full rounded-full"
            style={{ width: `${percentage}%`, backgroundColor: barColor }}
          />
        )}
      </View>
    </View>
  );
}

export default function SubscriptionScreen() {
  const { store } = useStore();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, subscription_plans(*)")
        .eq("store_id", store!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id,
  });

  const { data: usage } = useQuery({
    queryKey: ["usage", store?.id],
    queryFn: async () => {
      const [products, categories, orders] = await Promise.all([
        supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("store_id", store!.id),
        supabase.from("categories").select("id", { count: "exact", head: true }).eq("store_id", store!.id),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("store_id", store!.id),
      ]);
      return {
        products: products.count ?? 0,
        categories: categories.count ?? 0,
        orders: orders.count ?? 0,
      };
    },
    enabled: !!store?.id,
  });

  const plan = subscription?.subscription_plans as any;
  const status = subscription?.status ?? "active";
  const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;

  const handleUpgrade = () => {
    const url = `https://${store?.subdomain}.pideai.com/admin/subscription`;
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-elegant-dark items-center justify-center">
        <ActivityIndicator size="large" color="#FFC300" />
      </View>
    );
  }

  if (!subscription) {
    return (
      <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="bg-elegant-gray rounded-2xl p-6 items-center">
          <Crown size={40} color="#FFC300" />
          <Text className="text-white font-sans-bold text-lg mt-3">Sin suscripcion</Text>
          <Text className="text-cream-400 font-sans text-sm text-center mt-2">
            No tienes una suscripcion activa. Activa un plan para desbloquear todas las funcionalidades.
          </Text>
          <TouchableOpacity
            className="bg-gold-500 py-3 px-8 rounded-xl mt-5"
            onPress={handleUpgrade}
            activeOpacity={0.8}
          >
            <Text className="text-elegant-dark font-sans-bold text-base">Ver planes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Plan Card */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
        <View className="flex-row items-center gap-2 mb-3">
          <CreditCard size={20} color="#FFC300" />
          <Text className="text-white font-sans-bold text-lg">Plan actual</Text>
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-sans-bold text-xl">
            {plan?.name ?? "Plan"}
          </Text>
          <View className={`px-3 py-1 rounded-full ${statusConfig.bg}`}>
            <Text className={`font-sans-medium text-xs ${statusConfig.text}`}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {plan?.price !== undefined && (
          <Text className="text-cream-400 font-sans text-sm">
            ${plan.price}/{plan?.billing_period === "yearly" ? "anual" : "mes"}
          </Text>
        )}
      </View>

      {/* Dates Card */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Calendar size={20} color="#FFC300" />
          <Text className="text-white font-sans-bold text-base">Periodo de facturacion</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-cream-400 font-sans text-sm">Inicio</Text>
          <Text className="text-white font-sans-medium text-sm">
            {formatDate(subscription.current_period_start)}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-cream-400 font-sans text-sm">Vencimiento</Text>
          <Text className="text-white font-sans-medium text-sm">
            {formatDate(subscription.current_period_end)}
          </Text>
        </View>

        {status === "trialing" && (subscription as any).trial_end && (
          <View className="flex-row justify-between mt-1 pt-2 border-t border-white/10">
            <Text className="text-blue-400 font-sans text-sm">Fin de prueba</Text>
            <Text className="text-blue-400 font-sans-medium text-sm">
              {formatDate((subscription as any).trial_end)}
            </Text>
          </View>
        )}
      </View>

      {/* Usage Section */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <Text className="text-white font-sans-bold text-base mb-4">Uso del plan</Text>

        <ProgressBar
          label="Productos"
          icon={<Package size={16} color="#FFC300" />}
          used={usage?.products ?? 0}
          limit={plan?.max_products ?? null}
        />

        <ProgressBar
          label="Categorias"
          icon={<Layers size={16} color="#FFC300" />}
          used={usage?.categories ?? 0}
          limit={plan?.max_categories ?? null}
        />

        <ProgressBar
          label="Pedidos"
          icon={<ShoppingBag size={16} color="#FFC300" />}
          used={usage?.orders ?? 0}
          limit={plan?.max_orders ?? null}
        />
      </View>

      {/* Upgrade Button */}
      <TouchableOpacity
        className="bg-gold-500 py-4 rounded-xl flex-row items-center justify-center gap-2"
        onPress={handleUpgrade}
        activeOpacity={0.8}
      >
        <ExternalLink size={18} color="#1A1A2E" />
        <Text className="text-elegant-dark font-sans-bold text-base">
          {status === "active" ? "Gestionar suscripcion" : "Mejorar plan"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
