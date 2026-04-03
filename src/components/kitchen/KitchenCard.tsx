import { View, Text, TouchableOpacity } from "react-native";
import { Clock } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { NEXT_STATUS, STATUS_LABELS, STATUS_COLORS, type OrderWithItems, type OrderStatus } from "@/lib/orderConstants";
import { useUpdateOrderStatus } from "@/hooks/useOrders";

interface KitchenCardProps {
  order: OrderWithItems;
}

export function KitchenCard({ order }: KitchenCardProps) {
  const updateStatus = useUpdateOrderStatus();
  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const nextStatus = NEXT_STATUS[order.status];
  const minutesAgo = order.created_at
    ? Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000)
    : 0;

  const handleAdvance = async () => {
    if (!nextStatus) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateStatus.mutate({ orderId: order.id, newStatus: nextStatus });
  };

  return (
    <View
      className="bg-elegant-gray rounded-2xl p-4 mb-3"
      style={{ borderTopWidth: 3, borderTopColor: STATUS_COLORS[order.status] }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-white font-sans-bold text-lg">#{orderNumber}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <View className="flex-row items-center gap-1">
          <Clock size={14} color={minutesAgo > 15 ? "#EF4444" : "#888"} />
          <Text
            className={`font-sans-medium text-sm ${
              minutesAgo > 15 ? "text-red-400" : "text-cream-400"
            }`}
          >
            {minutesAgo}m
          </Text>
        </View>
      </View>

      <Text className="text-cream-200 font-sans-medium text-sm mb-2">
        {order.customer_name}
      </Text>

      <View className="bg-elegant-dark rounded-xl p-3 mb-3">
        {order.order_items?.map((item) => (
          <View key={item.id} className="mb-1.5">
            <Text className="text-white font-sans text-base">
              {item.quantity}x {item.item_name}
            </Text>
            {item.extras && item.extras.length > 0 && (
              <View className="ml-4">
                {item.extras.map((extra, idx) => (
                  <Text key={idx} className="text-cream-400 font-sans text-xs">
                    + {extra.name}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )) ?? (
          <Text className="text-cream-400 font-sans text-sm italic">
            Sin items cargados
          </Text>
        )}
      </View>

      {order.notes && (
        <View className="bg-yellow-500/10 rounded-xl p-2.5 mb-3">
          <Text className="text-yellow-400 font-sans text-xs font-sans-medium">📝 {order.notes}</Text>
        </View>
      )}

      {nextStatus && order.status !== "delivered" && order.status !== "cancelled" && (
        <TouchableOpacity
          className="py-3 rounded-xl items-center"
          style={{ backgroundColor: STATUS_COLORS[nextStatus] }}
          onPress={handleAdvance}
          disabled={updateStatus.isPending}
          activeOpacity={0.8}
        >
          <Text className="text-white font-sans-bold text-sm">
            {STATUS_LABELS[nextStatus]} →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
