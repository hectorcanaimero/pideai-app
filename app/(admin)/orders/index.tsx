import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderFilters } from "@/components/orders/OrderFilters";
import type { OrderStatus, OrderWithItems } from "@/lib/orderConstants";

export default function OrdersScreen() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const { data: orders, isLoading, refetch, isRefetching } = useOrders(statusFilter);

  const pendingCount = orders?.filter((o) => o.status === "pending").length ?? 0;

  const renderOrder = useCallback(
    ({ item }: { item: OrderWithItems }) => <OrderCard order={item} />,
    []
  );

  return (
    <View className="flex-1 bg-elegant-dark">
      {/* Filters — fixed height, never stretches */}
      <View style={{ flexShrink: 0 }}>
        <OrderFilters
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          pendingCount={statusFilter === null ? pendingCount : undefined}
        />
      </View>

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
