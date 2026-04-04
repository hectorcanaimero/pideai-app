import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { STATUS_LABELS, STATUS_COLORS, ORDER_STATUSES, type OrderStatus } from "@/lib/orderConstants";

interface OrderFiltersProps {
  selectedStatus: OrderStatus | null;
  onStatusChange: (status: OrderStatus | null) => void;
  pendingCount?: number;
}

export function OrderFilters({ selectedStatus, onStatusChange, pendingCount }: OrderFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      className="py-3"
    >
      <TouchableOpacity
        className={`px-4 py-2 rounded-full ${
          selectedStatus === null ? "bg-gold-500" : "bg-elegant-gray"
        }`}
        onPress={() => onStatusChange(null)}
        activeOpacity={0.7}
      >
        <Text
          className={`font-sans-medium text-base ${
            selectedStatus === null ? "text-text-inverted" : "text-cream-300"
          }`}
        >
          Todos
        </Text>
      </TouchableOpacity>

      {ORDER_STATUSES.map((status) => {
        const isSelected = selectedStatus === status;
        const showBadge = status === "pending" && pendingCount && pendingCount > 0;

        return (
          <TouchableOpacity
            key={status}
            className={`px-4 py-2 rounded-full flex-row items-center ${isSelected ? "bg-gold-500" : "bg-elegant-gray"}`}
            onPress={() => onStatusChange(isSelected ? null : status)}
            activeOpacity={0.7}
          ><View
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            /><Text
              className={`font-sans-medium text-base ${isSelected ? "text-text-inverted" : "text-cream-300"}`}
            >{STATUS_LABELS[status]}</Text>{showBadge ? (
              <Text className="text-red-500 font-sans-bold text-xs ml-1">{pendingCount}</Text>
            ) : null}</TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
