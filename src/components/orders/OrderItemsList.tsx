import { View, Text } from "react-native";
import type { OrderItem } from "@/lib/orderConstants";

interface OrderItemsListProps {
  items: OrderItem[];
  currency?: string;
}

export function OrderItemsList({ items, currency = "USD" }: OrderItemsListProps) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item.id} className="flex-row justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-white font-sans text-sm">
              {item.quantity}x {item.item_name}
            </Text>
            {item.extras && item.extras.length > 0 && (
              <View className="ml-4 mt-0.5">
                {item.extras.map((extra, idx) => (
                  <Text key={idx} className="text-cream-400 font-sans text-xs">
                    + {extra.name} ({currency} {extra.price.toFixed(2)})
                  </Text>
                ))}
              </View>
            )}
          </View>
          <Text className="text-cream-300 font-sans text-sm">
            {currency} {(item.price_at_time * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
}
