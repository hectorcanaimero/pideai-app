import { View, Text, Image, TouchableOpacity, Switch } from "react-native";
import { router } from "expo-router";
import { StockBadge } from "./StockBadge";
import { useToggleAvailability, type Product } from "@/hooks/useProducts";
import { useStore } from "@/contexts/StoreContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { store } = useStore();
  const toggleAvailability = useToggleAvailability();
  const currency = store?.currency ?? "USD";
  const isStockEnabled = store?.is_food_business === false;

  return (
    <TouchableOpacity
      className="bg-elegant-gray rounded-2xl p-3 mb-3 flex-row"
      onPress={() => router.push(`/(admin)/menu/product/${product.id}`)}
      activeOpacity={0.7}
    >
      {/* Image */}
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          className="w-16 h-16 rounded-xl mr-3"
          resizeMode="cover"
        />
      ) : (
        <View className="w-16 h-16 rounded-xl mr-3 bg-elegant-dark items-center justify-center">
          <Text className="text-cream-400 text-2xl">🍽️</Text>
        </View>
      )}

      {/* Info */}
      <View className="flex-1 justify-center">
        <View className="flex-row items-center gap-2">
          <Text
            className="text-white font-sans-medium text-sm flex-1"
            numberOfLines={1}
          >
            {product.name}
          </Text>
          {isStockEnabled && (
            <StockBadge
              trackStock={product.track_stock}
              quantity={product.stock_quantity}
              minimum={product.stock_minimum}
            />
          )}
        </View>
        <Text className="text-gold-500 font-sans-bold text-sm mt-0.5">
          {currency} {product.price.toFixed(2)}
        </Text>
        {product.description && (
          <Text
            className="text-cream-400 font-sans text-xs mt-0.5"
            numberOfLines={1}
          >
            {product.description}
          </Text>
        )}
      </View>

      {/* Availability toggle */}
      <View className="justify-center ml-2">
        <Switch
          value={product.is_available !== false}
          onValueChange={(value) =>
            toggleAvailability.mutate({ id: product.id, is_available: value })
          }
          trackColor={{ false: "#444", true: "#EB1C8D" }}
          thumbColor="#fff"
        />
      </View>
    </TouchableOpacity>
  );
}
