import { View, Text, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { ChefHat } from "lucide-react-native";
import { useOrders } from "@/hooks/useOrders";
import { KitchenCard } from "@/components/kitchen/KitchenCard";
import type { OrderWithItems } from "@/lib/orderConstants";
import { useCallback } from "react";

const KITCHEN_STATUSES = ["pending", "confirmed", "preparing", "ready"];

interface StatPillProps {
  count: number;
  label: string;
  color: string;
  bgColor: string;
}

function StatPill({ count, label, color, bgColor }: StatPillProps) {
  return (
    <View className="flex-1 rounded-2xl p-3 items-center" style={{ backgroundColor: bgColor }}>
      <Text className="font-sans-bold text-2xl" style={{ color }}>{count}</Text>
      <Text className="text-text-secondary font-sans text-xs mt-0.5">{label}</Text>
    </View>
  );
}

export default function KitchenScreen() {
  const { data: allOrders, isLoading, refetch, isRefetching } = useOrders();

  const kitchenOrders =
    allOrders?.filter((o) => KITCHEN_STATUSES.includes(o.status)) ?? [];

  const pendingCount = kitchenOrders.filter((o) => o.status === "pending").length;
  const preparingCount = kitchenOrders.filter((o) => o.status === "preparing").length;
  const readyCount = kitchenOrders.filter((o) => o.status === "ready").length;

  const renderItem = useCallback(
    ({ item }: { item: OrderWithItems }) => <KitchenCard order={item} />,
    [],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-main">
        <ActivityIndicator size="large" color="#EB1C8D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-main">
      {/* Stats row */}
      <View className="flex-row px-4 pt-4 pb-2" style={{ gap: 8 }}>
        <StatPill count={pendingCount} label="Nuevos" color="#EAB308" bgColor="rgba(234,179,8,0.1)" />
        <StatPill count={preparingCount} label="Preparando" color="#A855F7" bgColor="rgba(168,85,247,0.1)" />
        <StatPill count={readyCount} label="Listos" color="#22C55E" bgColor="rgba(34,197,94,0.1)" />
      </View>

      {/* Orders list */}
      <FlatList
        data={kitchenOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#EB1C8D"
            colors={["#EB1C8D"]}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <View className="bg-white rounded-3xl p-8 items-center" style={{ width: "100%" }}>
              <ChefHat size={48} color="#D4D4D4" />
              <Text className="text-text-primary font-sans-semibold text-lg mt-4">
                Todo al día
              </Text>
              <Text className="text-text-secondary font-sans text-sm text-center mt-1">
                No hay pedidos pendientes en cocina
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
