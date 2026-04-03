import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Phone, Mail, MessageCircle, ShoppingBag } from "lucide-react-native";
import { useCustomerOrders, useCustomers } from "@/hooks/useCustomers";
import { useStore } from "@/contexts/StoreContext";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { ORDER_TYPE_LABELS, type OrderStatus } from "@/lib/orderConstants";

export default function CustomerDetailScreen() {
  const { id: identifier, name, phone: paramPhone } = useLocalSearchParams<{
    id: string;
    name: string;
    phone: string;
  }>();
  const { data: customers } = useCustomers();
  const { store } = useStore();
  const currency = store?.currency ?? "USD";

  // Find customer data from list — match by phone first, then email
  const customer = customers?.find(
    (c) => c.phone === paramPhone || c.email === identifier
  );
  const phone = customer?.phone ?? paramPhone;
  const email = customer?.email ?? identifier;

  const { data: orders, isLoading } = useCustomerOrders(phone, email);

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="items-center mb-6">
        <View className="w-20 h-20 rounded-full bg-gold-500/20 items-center justify-center mb-3">
          <Text className="text-gold-500 font-sans-bold text-3xl">
            {(name ?? "?").charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-white font-sans-bold text-xl">
          {name ?? "Cliente"}
        </Text>
        <Text className="text-cream-400 font-sans text-sm mt-0.5">
          {email}
        </Text>
      </View>

      {/* Quick Actions */}
      <View className="flex-row gap-3 mb-6">
        {phone && (
          <TouchableOpacity
            className="flex-1 bg-elegant-gray rounded-xl py-3 items-center flex-row justify-center gap-2"
            onPress={() => Linking.openURL(`tel:${phone}`)}
          >
            <Phone size={16} color="#FFC300" />
            <Text className="text-gold-500 font-sans-medium text-sm">
              Llamar
            </Text>
          </TouchableOpacity>
        )}
        {phone && (
          <TouchableOpacity
            className="flex-1 bg-elegant-gray rounded-xl py-3 items-center flex-row justify-center gap-2"
            onPress={() =>
              Linking.openURL(
                `https://wa.me/${phone.replace(/\D/g, "")}`
              )
            }
          >
            <MessageCircle size={16} color="#22C55E" />
            <Text className="text-green-400 font-sans-medium text-sm">
              WhatsApp
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="flex-1 bg-elegant-gray rounded-xl py-3 items-center flex-row justify-center gap-2"
          onPress={() => Linking.openURL(`mailto:${email}`)}
        >
          <Mail size={16} color="#3B82F6" />
          <Text className="text-blue-400 font-sans-medium text-sm">Email</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {customer && (
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-elegant-gray rounded-2xl p-4 items-center">
            <Text className="text-gold-500 font-sans-bold text-2xl">
              {customer.order_count}
            </Text>
            <Text className="text-cream-400 font-sans text-xs">Pedidos</Text>
          </View>
          <View className="flex-1 bg-elegant-gray rounded-2xl p-4 items-center">
            <Text className="text-gold-500 font-sans-bold text-lg">
              {currency} {customer.total_spent.toFixed(2)}
            </Text>
            <Text className="text-cream-400 font-sans text-xs">
              Total gastado
            </Text>
          </View>
        </View>
      )}

      {/* Order History */}
      <View className="flex-row items-center gap-2 mb-3">
        <ShoppingBag size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-base">
          Historial de pedidos
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#FFC300" />
      ) : orders && orders.length > 0 ? (
        orders.map((order) => {
          const orderNumber = order.id.slice(0, 8).toUpperCase();
          const date = order.created_at
            ? new Date(order.created_at).toLocaleDateString("es", {
                day: "2-digit",
                month: "short",
              })
            : "";
          return (
            <View
              key={order.id}
              className="bg-elegant-gray rounded-xl p-3 mb-2 flex-row items-center"
            >
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-sans-medium text-sm">
                    #{orderNumber}
                  </Text>
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </View>
                <Text className="text-cream-400 font-sans text-xs mt-0.5">
                  {ORDER_TYPE_LABELS[order.order_type ?? ""] ??
                    order.order_type}{" "}
                  · {date}
                </Text>
              </View>
              <Text className="text-gold-500 font-sans-bold text-sm">
                {currency} {order.total_amount?.toFixed(2)}
              </Text>
            </View>
          );
        })
      ) : (
        <Text className="text-cream-400 font-sans text-sm text-center py-8">
          Sin pedidos
        </Text>
      )}
    </ScrollView>
  );
}
