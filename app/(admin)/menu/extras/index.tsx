import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { Layers, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { useExtraGroups } from "@/hooks/useExtras";
import { useStore } from "@/contexts/StoreContext";

export default function ExtraGroupsScreen() {
  const { store } = useStore();
  const { data: groups, isLoading, refetch, isRefetching } = useExtraGroups(store?.id);

  return (
    <View className="flex-1 bg-elegant-dark">
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FFC300" colors={["#FFC300"]} />}
        ListHeaderComponent={
          <View className="flex-row items-center gap-2 mb-4">
            <Layers size={20} color="#FFC300" />
            <Text className="text-white font-sans-bold text-lg">Grupos de Extra</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-elegant-gray rounded-xl p-4 mb-2 flex-row items-center"
            onPress={() => router.push(`/(admin)/menu/extras/${item.id}`)}
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text className="text-white font-sans-medium text-sm">{item.name}</Text>
              <Text className="text-cream-400 font-sans text-xs mt-0.5">
                {item.selection_type === "single" ? "Selección única" : "Selección múltiple"}
                {item.is_required ? " · Requerido" : " · Opcional"}
              </Text>
            </View>
            <ChevronRight size={16} color="#666" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#FFC300" />
          ) : (
            <View className="items-center py-20">
              <Text className="text-cream-400 font-sans">No hay grupos de extras</Text>
            </View>
          )
        }
      />
    </View>
  );
}
