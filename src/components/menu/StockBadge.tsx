import { View, Text } from "react-native";

interface StockBadgeProps {
  trackStock: boolean;
  quantity: number | null;
  minimum: number | null;
}

export function StockBadge({ trackStock, quantity, minimum }: StockBadgeProps) {
  if (!trackStock) return null;

  const isOutOfStock = quantity !== null && quantity <= 0;
  const isLowStock =
    quantity !== null && minimum !== null && quantity <= minimum && quantity > 0;

  if (isOutOfStock) {
    return (
      <View className="bg-red-500/20 px-2 py-0.5 rounded-full">
        <Text className="text-red-400 font-sans-medium text-xs">
          Agotado
        </Text>
      </View>
    );
  }

  if (isLowStock) {
    return (
      <View className="bg-yellow-500/20 px-2 py-0.5 rounded-full">
        <Text className="text-yellow-400 font-sans-medium text-xs">
          Stock: {quantity}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-green-500/20 px-2 py-0.5 rounded-full">
      <Text className="text-green-400 font-sans-medium text-xs">
        Stock: {quantity}
      </Text>
    </View>
  );
}
