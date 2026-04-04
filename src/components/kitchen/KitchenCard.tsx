import { View, Text, TouchableOpacity } from "react-native";
import { Clock, ChevronRight, StickyNote } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { NEXT_STATUS, STATUS_LABELS, STATUS_COLORS, type OrderWithItems } from "@/lib/orderConstants";
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
  const isUrgent = minutesAgo > 15;
  const statusColor = STATUS_COLORS[order.status];

  const handleAdvance = async () => {
    if (!nextStatus) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateStatus.mutate({ orderId: order.id, newStatus: nextStatus });
  };

  return (
    <View
      className="bg-white rounded-2xl mb-3 overflow-hidden"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: statusColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Text className="text-text-primary font-sans-bold text-lg">
            #{orderNumber}
          </Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <View
          className="flex-row items-center rounded-full px-2.5 py-1"
          style={{ backgroundColor: isUrgent ? "rgba(239,68,68,0.1)" : "rgba(0,0,0,0.04)" }}
        >
          <Clock size={12} color={isUrgent ? "#EF4444" : "#6B6B6B"} />
          <Text
            className="font-sans-semibold text-xs ml-1"
            style={{ color: isUrgent ? "#EF4444" : "#6B6B6B" }}
          >{minutesAgo}min</Text>
        </View>
      </View>

      {/* Customer */}
      <Text className="text-text-secondary font-sans-medium text-sm px-4 pb-2">
        {order.customer_name}
      </Text>

      {/* Items */}
      <View className="bg-background-main mx-3 rounded-xl p-3 mb-2">
        {order.order_items?.map((item) => (
          <View key={item.id} className="mb-1.5">
            <View className="flex-row items-baseline">
              <View
                className="rounded-md px-1.5 py-0.5 mr-2"
                style={{ backgroundColor: "rgba(235,28,141,0.1)" }}
              >
                <Text className="text-brand-pink font-sans-bold text-xs">{item.quantity}x</Text>
              </View>
              <Text className="text-text-primary font-sans-medium text-sm flex-1">
                {item.item_name}
              </Text>
            </View>
            {item.extras && item.extras.length > 0 && (
              <View className="ml-8 mt-0.5">
                {item.extras.map((extra, idx) => (
                  <Text key={idx} className="text-text-secondary font-sans text-xs">
                    + {extra.name}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )) ?? (
          <Text className="text-text-secondary font-sans text-sm italic">
            Sin items cargados
          </Text>
        )}
      </View>

      {/* Notes */}
      {order.notes ? (
        <View
          className="flex-row items-start mx-3 rounded-xl p-2.5 mb-2"
          style={{ backgroundColor: "rgba(234,179,8,0.08)" }}
        >
          <StickyNote size={14} color="#EAB308" style={{ marginTop: 1 }} />
          <Text className="text-text-primary font-sans text-sm flex-1 ml-2">
            {order.notes}
          </Text>
        </View>
      ) : null}

      {/* Action button */}
      {nextStatus && order.status !== "delivered" && order.status !== "cancelled" ? (
        <TouchableOpacity
          className="flex-row items-center justify-center mx-3 mb-3 py-3 rounded-xl"
          style={{ backgroundColor: STATUS_COLORS[nextStatus] }}
          onPress={handleAdvance}
          disabled={updateStatus.isPending}
          activeOpacity={0.8}
        >
          <Text className="text-white font-sans-bold text-sm">
            Mover a {STATUS_LABELS[nextStatus]}
          </Text>
          <ChevronRight size={16} color="#fff" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
