import { View, Text } from "react-native";
import { STATUS_LABELS, STATUS_COLORS, STATUS_BG_COLORS, type OrderStatus } from "@/lib/orderConstants";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status;
  const bgClass = STATUS_BG_COLORS[status] ?? "bg-gray-500/20";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <View className={`px-2.5 py-1 rounded-full ${bgClass}`}>
      <Text style={{ color: STATUS_COLORS[status] }} className={`font-sans-medium ${textSize}`}>
        {label}
      </Text>
    </View>
  );
}
