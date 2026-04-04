import { View, Text, ScrollView, ActivityIndicator, Linking, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Phone, MapPin, MessageCircle, CreditCard, StickyNote } from "lucide-react-native";
import { useOrderDetail } from "@/hooks/useOrders";
import { useStore } from "@/contexts/StoreContext";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderItemsList } from "@/components/orders/OrderItemsList";
import { OrderStatusSelector } from "@/components/orders/OrderStatusSelector";
import { ORDER_TYPE_LABELS } from "@/lib/orderConstants";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading } = useOrderDetail(id);
  const { store } = useStore();
  const currency = store?.currency ?? "USD";

  if (isLoading || !order) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark">
        <ActivityIndicator size="large" color="#EB1C8D" />
      </View>
    );
  }

  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleString("es", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-text-primary font-sans-bold text-2xl">#{orderNumber}</Text>
          <Text className="text-cream-400 font-sans text-sm">{orderDate}</Text>
        </View>
        <OrderStatusBadge status={order.status} size="md" />
      </View>

      {/* Order Type */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <Text className="text-cream-400 font-sans text-sm mb-1">Tipo de pedido</Text>
        <Text className="text-text-primary font-sans-medium text-base">
          {ORDER_TYPE_LABELS[order.order_type ?? ""] ?? order.order_type}
        </Text>
      </View>

      {/* Customer Info */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <Text className="text-cream-400 font-sans text-sm mb-2">Cliente</Text>
        <Text className="text-text-primary font-sans-medium text-base mb-2">
          {order.customer_name}
        </Text>

        {order.customer_phone && (
          <TouchableOpacity
            className="flex-row items-center gap-2 mb-2"
            onPress={() => Linking.openURL(`tel:${order.customer_phone}`)}
          >
            <Phone size={14} color="#EB1C8D" />
            <Text className="text-gold-400 font-sans text-sm">{order.customer_phone}</Text>
          </TouchableOpacity>
        )}

        {order.customer_phone && (
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => Linking.openURL(`https://wa.me/${order.customer_phone?.replace(/\D/g, "")}`)}
          >
            <MessageCircle size={14} color="#22C55E" />
            <Text className="text-green-400 font-sans text-sm">WhatsApp</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delivery Address */}
      {order.order_type === "delivery" && order.delivery_address && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
          <Text className="text-cream-400 font-sans text-sm mb-1">Dirección</Text>
          <View className="flex-row items-start gap-2">
            <MapPin size={14} color="#EB1C8D" />
            <Text className="text-text-primary font-sans text-sm flex-1">{order.delivery_address}</Text>
          </View>
        </View>
      )}

      {/* Order Items */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <Text className="text-cream-400 font-sans text-sm mb-3">Productos</Text>
        <OrderItemsList items={order.order_items ?? []} currency={currency} />

        <View className="border-t border-elegant-dark mt-3 pt-3">
          {order.delivery_price != null && order.delivery_price > 0 && (
            <View className="flex-row justify-between mb-1">
              <Text className="text-cream-400 font-sans text-sm">Delivery</Text>
              <Text className="text-cream-300 font-sans text-sm">
                {currency} {order.delivery_price.toFixed(2)}
              </Text>
            </View>
          )}
          {order.coupon_discount != null && order.coupon_discount > 0 && (
            <View className="flex-row justify-between mb-1">
              <Text className="text-cream-400 font-sans text-sm">Cupón ({order.coupon_code})</Text>
              <Text className="text-green-400 font-sans text-sm">
                -{currency} {order.coupon_discount.toFixed(2)}
              </Text>
            </View>
          )}
          <View className="flex-row justify-between">
            <Text className="text-text-primary font-sans-bold text-xl">Total</Text>
            <Text className="text-gold-500 font-sans-bold text-xl">
              {currency} {order.total_amount?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment */}
      {order.payment_method && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
          <View className="flex-row items-center gap-2">
            <CreditCard size={14} color="#EB1C8D" />
            <Text className="text-cream-400 font-sans text-sm">Pago</Text>
          </View>
          <Text className="text-text-primary font-sans text-sm mt-1">{order.payment_method}</Text>
        </View>
      )}

      {/* Notes */}
      {order.notes && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
          <View className="flex-row items-center gap-2 mb-1">
            <StickyNote size={14} color="#EB1C8D" />
            <Text className="text-cream-400 font-sans text-sm">Notas</Text>
          </View>
          <Text className="text-text-primary font-sans text-sm">{order.notes}</Text>
        </View>
      )}

      {/* Status Actions */}
      <View className="mt-4">
        <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
      </View>
    </ScrollView>
  );
}
