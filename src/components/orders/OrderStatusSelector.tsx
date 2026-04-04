import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import {
  NEXT_STATUS,
  STATUS_LABELS,
  STATUS_COLORS,
  type OrderStatus,
} from "@/lib/orderConstants";
import { useUpdateOrderStatus } from "@/hooks/useOrders";

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
  const updateStatus = useUpdateOrderStatus();
  const nextStatus = NEXT_STATUS[currentStatus];

  const handleAdvance = () => {
    if (!nextStatus) return;

    Alert.alert(
      "Cambiar estado",
      `¿Cambiar de "${STATUS_LABELS[currentStatus]}" a "${STATUS_LABELS[nextStatus]}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            updateStatus.mutate({ orderId, newStatus: nextStatus });
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (currentStatus === "cancelled" || currentStatus === "delivered") return;

    Alert.alert("Cancelar pedido", "¿Estás seguro? Esta acción no se puede deshacer.", [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          updateStatus.mutate({ orderId, newStatus: "cancelled" });
        },
      },
    ]);
  };

  if (currentStatus === "delivered" || currentStatus === "cancelled") {
    return null;
  }

  return (
    <View className="gap-3">
      {nextStatus && (
        <TouchableOpacity
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: STATUS_COLORS[nextStatus] }}
          onPress={handleAdvance}
          disabled={updateStatus.isPending}
          activeOpacity={0.8}
        >
          <Text className="text-text-primary font-sans-bold text-base">
            {updateStatus.isPending ? "Actualizando..." : `Pasar a: ${STATUS_LABELS[nextStatus]}`}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="py-3 rounded-xl items-center border border-red-500/30"
        onPress={handleCancel}
        activeOpacity={0.7}
      >
        <Text className="text-red-400 font-sans-medium text-sm">Cancelar pedido</Text>
      </TouchableOpacity>
    </View>
  );
}
