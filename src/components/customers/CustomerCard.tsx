import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, ShoppingBag, Mail } from "lucide-react-native";
import type { Customer } from "@/hooks/useCustomers";

interface CustomerCardProps {
  customer: Customer;
  currency?: string;
  onPress: () => void;
}

export function CustomerCard({
  customer,
  currency = "USD",
  onPress,
}: CustomerCardProps) {
  return (
    <TouchableOpacity
      className="bg-elegant-gray rounded-2xl p-4 mb-3 flex-row items-center"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View className="w-11 h-11 rounded-full bg-gold-500/20 items-center justify-center mr-3">
        <Text className="text-gold-500 font-sans-bold text-base">
          {customer.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-white font-sans-medium text-sm">
          {customer.name}
        </Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Mail size={10} color="#FFEFBF" />
          <Text
            className="text-cream-400 font-sans text-xs"
            numberOfLines={1}
          >
            {customer.email}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 mt-1">
          <View className="flex-row items-center gap-1">
            <ShoppingBag size={10} color="#FFC300" />
            <Text className="text-gold-500 font-sans text-xs">
              {customer.order_count} pedidos
            </Text>
          </View>
          <Text className="text-cream-400 font-sans text-xs">
            {currency} {customer.total_spent.toFixed(2)}
          </Text>
        </View>
      </View>

      <ChevronRight size={16} color="#666" />
    </TouchableOpacity>
  );
}
