import { View, Text, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { useOrders } from "@/hooks/useOrders";
import { KitchenCard } from "@/components/kitchen/KitchenCard";
import type { OrderWithItems } from "@/lib/orderConstants";
import { useCallback } from "react";

const KITCHEN_STATUSES = ["pending", "confirmed", "preparing", "ready"];

export default function KitchenScreen() {
  const { data: allOrders, isLoading, refetch, isRefetching } = useOrders();

  const kitchenOrders = allOrders?.filter((o) =>
    KITCHEN_STATUSES.includes(o.status)
  ) ?? [];

  const renderItem = useCallback(
    ({ item }: { item: OrderWithItems }) => <KitchenCard order={item} />,
    []
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#FFC300" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row justify-around py-3 border-b border-elegant-gray">
        <View className="items-center">
          <Text className="text-yellow-400 font-sans-bold text-xl">
            {kitchenOrders.filter((o) => o.status === "pending").length}
          </Text>
          <Text className="text-cream-400 font-sans text-xs">Nuevos</Text>
        </View>
        <View className="items-center">
          <Text className="text-purple-400 font-sans-bold text-xl">
            {kitchenOrders.filter((o) => o.status === "preparing").length}
          </Text>
          <Text className="text-cream-400 font-sans text-xs">Preparando</Text>
        </View>
        <View className="items-center">
          <Text className="text-green-400 font-sans-bold text-xl">
            {kitchenOrders.filter((o) => o.status === "ready").length}
          </Text>
          <Text className="text-cream-400 font-sans text-xs">Listos</Text>
        </View>
      </View>

      <FlatList
        data={kitchenOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#FFC300"
            colors={["#FFC300"]}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-cream-400 font-sans text-lg">🎉</Text>
            <Text className="text-cream-400 font-sans text-base mt-2">
              No hay pedidos en cocina
            </Text>
          </View>
        }
      />
    </View>
  );
}
