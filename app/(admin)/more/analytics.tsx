import { useState } from "react";
import {
  View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity,
} from "react-native";
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, Trophy } from "lucide-react-native";
import { useAnalytics, type Period } from "@/hooks/useAnalytics";
import { useStore } from "@/contexts/StoreContext";
import { ORDER_TYPE_LABELS } from "@/lib/orderConstants";

export default function AnalyticsScreen() {
  const { store } = useStore();
  const [period, setPeriod] = useState<Period>("week");
  const { data, isLoading, refetch, isRefetching } = useAnalytics(period);
  const currency = store?.currency ?? "USD";

  const periods: { key: Period; label: string }[] = [
    { key: "today", label: "Hoy" },
    { key: "week", label: "7 dias" },
    { key: "month", label: "30 dias" },
  ];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark">
        <ActivityIndicator size="large" color="#EB1C8D" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#EB1C8D" colors={["#EB1C8D"]} />}
    >
      {/* Period selector */}
      <View className="flex-row gap-2 mb-6">
        {periods.map((p) => (
          <TouchableOpacity
            key={p.key}
            className={`flex-1 py-2.5 rounded-xl items-center ${period === p.key ? "bg-gold-500" : "bg-elegant-gray"}`}
            onPress={() => setPeriod(p.key)}
          >
            <Text className={`font-sans-medium text-sm ${period === p.key ? "text-elegant-dark" : "text-cream-300"}`}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main stats */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-elegant-gray rounded-2xl p-4">
          <View className="flex-row items-center gap-1.5 mb-1">
            <DollarSign size={14} color="#22C55E" />
            <Text className="text-cream-400 font-sans text-xs">Ventas</Text>
          </View>
          <Text className="text-white font-sans-bold text-xl">
            {currency} {data?.totalRevenue.toFixed(2)}
          </Text>
        </View>
        <View className="flex-1 bg-elegant-gray rounded-2xl p-4">
          <View className="flex-row items-center gap-1.5 mb-1">
            <ShoppingBag size={14} color="#EB1C8D" />
            <Text className="text-cream-400 font-sans text-xs">Pedidos</Text>
          </View>
          <Text className="text-white font-sans-bold text-xl">{data?.totalOrders}</Text>
        </View>
      </View>

      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <View className="flex-row items-center gap-1.5 mb-1">
          <TrendingUp size={14} color="#F59E0B" />
          <Text className="text-cream-400 font-sans text-xs">Ticket promedio</Text>
        </View>
        <Text className="text-white font-sans-bold text-xl">
          {currency} {data?.avgOrderValue.toFixed(2)}
        </Text>
      </View>

      {/* By order type */}
      <Text className="text-white font-sans-semibold text-base mb-3">Por tipo de pedido</Text>
      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        {Object.entries(data?.byType ?? {}).map(([type, count]) => (
          <View key={type} className="flex-row items-center justify-between py-2 border-b border-elegant-dark last:border-b-0">
            <Text className="text-cream-300 font-sans text-sm">
              {ORDER_TYPE_LABELS[type] ?? type}
            </Text>
            <Text className="text-white font-sans-bold text-sm">{count as number}</Text>
          </View>
        ))}
        {Object.keys(data?.byType ?? {}).length === 0 && (
          <Text className="text-cream-400 font-sans text-sm text-center py-2">Sin datos</Text>
        )}
      </View>

      {/* Top products */}
      <View className="flex-row items-center gap-2 mb-3">
        <Trophy size={16} color="#EB1C8D" />
        <Text className="text-white font-sans-semibold text-base">Productos mas vendidos</Text>
      </View>
      <View className="bg-elegant-gray rounded-2xl p-4">
        {(data?.topProducts ?? []).map((p, i) => (
          <View key={p.name} className="flex-row items-center justify-between py-2 border-b border-elegant-dark last:border-b-0">
            <View className="flex-row items-center gap-2">
              <Text className="text-gold-500 font-sans-bold text-sm w-6">#{i + 1}</Text>
              <Text className="text-cream-200 font-sans text-sm">{p.name}</Text>
            </View>
            <Text className="text-cream-400 font-sans text-sm">{p.quantity} uds</Text>
          </View>
        ))}
        {(data?.topProducts ?? []).length === 0 && (
          <Text className="text-cream-400 font-sans text-sm text-center py-2">Sin datos</Text>
        )}
      </View>
    </ScrollView>
  );
}
