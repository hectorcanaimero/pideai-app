import { View, Text, TouchableOpacity } from "react-native";
import { Clock, MapPin, Phone, ChevronRight } from "lucide-react-native";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { STATUS_COLORS, ORDER_TYPE_LABELS, type OrderWithItems } from "@/lib/orderConstants";
import { router } from "expo-router";

interface OrderCardProps {
  order: OrderWithItems;
}

export function OrderCard({ order }: OrderCardProps) {
  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const orderType = ORDER_TYPE_LABELS[order.order_type ?? ""] ?? order.order_type;
  const timeAgo = getTimeAgo(order.created_at);

  return (
    <TouchableOpacity
      className="bg-elegant-gray rounded-2xl p-4 mb-3"
      style={{ borderLeftWidth: 3, borderLeftColor: STATUS_COLORS[order.status] }}
      onPress={() => router.push(`/(admin)/orders/${order.id}`)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-text-primary font-sans-bold text-xl">#{orderNumber}</Text>
          <Text className="text-cream-400 font-sans text-sm">{orderType}</Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>

      <Text className="text-text-secondary font-sans text-sm mb-1">
        {order.customer_name}
      </Text>

      {order.customer_phone && (
        <View className="flex-row items-center gap-1.5 mb-1">
          <Phone size={12} color="#F7EBF4" />
          <Text className="text-cream-400 font-sans text-sm">{order.customer_phone}</Text>
        </View>
      )}

      {order.order_type === "delivery" && order.delivery_address && (
        <View className="flex-row items-center gap-1.5 mb-1">
          <MapPin size={12} color="#F7EBF4" />
          <Text className="text-cream-400 font-sans text-sm flex-1" numberOfLines={1}>
            {order.delivery_address}
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-elegant-dark">
        <Text className="text-gold-500 font-sans-bold text-xl">
          ${order.total_amount?.toFixed(2)}
        </Text>
        <View className="flex-row items-center gap-1">
          <Clock size={12} color="#888" />
          <Text className="text-cream-400 font-sans text-sm">{timeAgo}</Text>
          <ChevronRight size={14} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
