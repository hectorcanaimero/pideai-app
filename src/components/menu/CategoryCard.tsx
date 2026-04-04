import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, Package } from "lucide-react-native";
import { router } from "expo-router";
import type { Category } from "@/hooks/useCategories";

interface CategoryCardProps {
  category: Category;
  onLongPress?: () => void;
}

export function CategoryCard({ category, onLongPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      className="bg-elegant-gray rounded-2xl p-4 mb-3 flex-row items-center"
      onPress={() => router.push(`/(admin)/menu/category/${category.id}`)}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <Text className="text-text-primary font-sans-semibold text-lg">{category.name}</Text>
        {category.description && (
          <Text className="text-cream-400 font-sans text-sm mt-0.5" numberOfLines={1}>
            {category.description}
          </Text>
        )}
        <View className="flex-row items-center gap-1 mt-1.5">
          <Package size={12} color="#EB1C8D" />
          <Text className="text-gold-500 font-sans text-sm">
            {category.product_count ?? 0} productos
          </Text>
        </View>
      </View>
      <ChevronRight size={18} color="#666" />
    </TouchableOpacity>
  );
}
