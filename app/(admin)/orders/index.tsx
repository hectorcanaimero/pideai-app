import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { ChefHat } from "lucide-react-native";
import { router } from "expo-router";
import { useOrders } from "@/hooks/useOrders";
import { useStore } from "@/contexts/StoreContext";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderFilters } from "@/components/orders/OrderFilters";
import type { OrderStatus, OrderWithItems } from "@/lib/orderConstants";

export default function OrdersScreen() {
  const { store } = useStore();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const { data: orders, isLoading, refetch, isRefetching } = useOrders(statusFilter);

  const pendingCount = orders?.filter((o) => o.status === "pending").length ?? 0;

  const renderOrder = useCallback(
    ({ item }: { item: OrderWithItems }) => <OrderCard order={item} />,
    []
  );

  return (
    <View className="flex-1 bg-elegant-dark">
      {/* Top actions */}
      <View className="flex-row justify-end px-4 pt-2 gap-2">
        {store?.is_food_business && (
          <TouchableOpacity
            className="bg-elegant-gray px-3 py-2 rounded-xl flex-row items-center gap-1.5"
            onPress={() => router.push("/(admin)/orders/kitchen")}
            activeOpacity={0.7}
          >
            <ChefHat size={16} color="#EB1C8D" />
            <Text className="text-gold-500 font-sans-medium text-base">Cocina</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <OrderFilters
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        pendingCount={statusFilter === null ? pendingCount : undefined}
      />

      {/* Orders List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EB1C8D" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
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
              <Text className="text-cream-400 font-sans text-base">
                No hay pedidos{statusFilter ? ` con estado "${statusFilter}"` : ""}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
