import { useState } from "react";
import {
  View, Text, FlatList, RefreshControl, ActivityIndicator,
  TouchableOpacity, Alert, TextInput,
} from "react-native";
import { Plus, X } from "lucide-react-native";
import { useCategories, useCreateCategory, useDeleteCategory, type Category } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/menu/CategoryCard";

export default function MenuScreen() {
  const { data: categories, isLoading, refetch, isRefetching } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createCategory.mutateAsync({ name: newName.trim() });
    setNewName("");
    setShowCreate(false);
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      "Eliminar categoria",
      `¿Eliminar "${category.name}"? Los productos no se eliminaran.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteCategory.mutate(category.id),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-elegant-dark">
      {/* Create button */}
      <View className="px-4 pt-3 pb-1 flex-row justify-end">
        <TouchableOpacity
          className="bg-gold-500 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
          onPress={() => setShowCreate(!showCreate)}
          activeOpacity={0.8}
        >
          {showCreate ? <X size={16} color="#1A1A2E" /> : <Plus size={16} color="#1A1A2E" />}
          <Text className="text-elegant-dark font-sans-bold text-sm">
            {showCreate ? "Cancelar" : "Nueva"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inline create form */}
      {showCreate && (
        <View className="px-4 pb-3 flex-row gap-2">
          <TextInput
            className="flex-1 bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-sm"
            placeholder="Nombre de la categoria"
            placeholderTextColor="#666"
            value={newName}
            onChangeText={setNewName}
            autoFocus
            onSubmitEditing={handleCreate}
          />
          <TouchableOpacity
            className="bg-gold-500 px-4 rounded-xl items-center justify-center"
            onPress={handleCreate}
            disabled={createCategory.isPending}
          >
            <Text className="text-elegant-dark font-sans-bold text-sm">
              {createCategory.isPending ? "..." : "Crear"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Categories list */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFC300" />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategoryCard category={item} onLongPress={() => handleDelete(item)} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FFC300" colors={["#FFC300"]} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-cream-400 font-sans text-base">No hay categorias</Text>
              <Text className="text-cream-400 font-sans text-sm mt-1">Toca "Nueva" para crear una</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
