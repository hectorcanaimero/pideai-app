import { View, Text, TouchableOpacity } from "react-native";
import { ClipboardList } from "lucide-react-native";
import { router } from "expo-router";
import { useOrders } from "@/hooks/useOrders";
import { STATUS_LABELS, STATUS_COLORS, ORDER_STATUSES, type OrderStatus } from "@/lib/orderConstants";

interface StatusRowProps {
  status: OrderStatus;
  count: number;
}

function StatusRow({ status, count }: StatusRowProps) {
  return (
    <View className="flex-row items-center justify-between py-2.5">
      <View className="flex-row items-center">
        <View
          className="w-2.5 h-2.5 rounded-full mr-3"
          style={{ backgroundColor: STATUS_COLORS[status] }}
        />
        <Text className="text-text-primary font-sans text-sm">{STATUS_LABELS[status]}</Text>
      </View>
      <Text
        className="font-sans-bold text-sm"
        style={{ color: count > 0 ? STATUS_COLORS[status] : "#A3A3A3" }}
      >{count}</Text>
    </View>
  );
}

export function OrdersByStatus() {
  const { data: orders } = useOrders();

  const countByStatus = ORDER_STATUSES.reduce(
    (acc, status) => {
      acc[status] = orders?.filter((o) => o.status === status).length ?? 0;
      return acc;
    },
    {} as Record<OrderStatus, number>,
  );

  const total = orders?.length ?? 0;

  return (
    <View className="bg-white rounded-2xl p-4 mt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <ClipboardList size={18} color="#EB1C8D" />
          <Text className="text-text-primary font-sans-semibold text-base ml-2">
            Pedidos por Estado
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(admin)/orders")}
          activeOpacity={0.7}
        >
          <Text className="text-brand-pink font-sans-medium text-sm">Ver todos</Text>
        </TouchableOpacity>
      </View>

      {/* Total */}
      <View className="bg-background-main rounded-xl p-3 mb-3 items-center">
        <Text className="text-text-secondary font-sans text-xs">Total hoy</Text>
        <Text className="text-text-primary font-sans-bold text-2xl">{total}</Text>
      </View>

      {/* Status rows */}
      <View className="px-1">
        {ORDER_STATUSES.map((status, idx) => (
          <View key={status}>
            <StatusRow status={status} count={countByStatus[status]} />
            {idx < ORDER_STATUSES.length - 1 ? (
              <View className="border-b" style={{ borderBottomColor: "rgba(0,0,0,0.04)" }} />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
