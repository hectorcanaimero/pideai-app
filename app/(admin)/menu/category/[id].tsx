import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useProductsByCategory } from "@/hooks/useProducts";
import { ProductCard } from "@/components/menu/ProductCard";

export default function CategoryProductsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: products,
    isLoading,
    refetch,
    isRefetching,
  } = useProductsByCategory(id);

  return (
    <View className="flex-1 bg-elegant-dark">
      <View className="px-4 pt-3 pb-1 flex-row justify-end">
        <TouchableOpacity
          className="bg-gold-500 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
          onPress={() =>
            router.push({
              pathname: "/(admin)/menu/product/create",
              params: { categoryId: id },
            })
          }
          activeOpacity={0.8}
        >
          <Plus size={16} color="#1A1A1A" />
          <Text className="text-elegant-dark font-sans-bold text-sm">
            Nuevo Producto
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EB1C8D" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#EB1C8D"
              colors={["#EB1C8D"]}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-cream-400 font-sans text-base">
                No hay productos
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
