import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Plus, X, Info } from "lucide-react-native";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
} from "@/hooks/useCategories";
import { CategoryCard } from "@/components/menu/CategoryCard";

export default function MenuScreen() {
  const { data: categories, isLoading, refetch, isRefetching } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setDisplayOrder("");
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (category: Category) => {
    setEditing(category);
    setName(category.name);
    setDescription(category.description ?? "");
    setDisplayOrder(
      category.display_order != null ? String(category.display_order) : ""
    );
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre es requerido");
      return;
    }

    try {
      if (editing) {
        await updateCategory.mutateAsync({
          id: editing.id,
          name: name.trim(),
          description: description.trim() || undefined,
          display_order: displayOrder ? parseInt(displayOrder) : undefined,
        });
      } else {
        await createCategory.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
          display_order: displayOrder ? parseInt(displayOrder) : undefined,
        });
      }
      resetForm();
    } catch {
      Alert.alert("Error", "No se pudo guardar la categoría");
    }
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      "Eliminar categoría",
      `¿Eliminar "${category.name}"? Los productos no se eliminarán.`,
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
      {/* Header */}
      <View className="px-4 pt-3 pb-1 flex-row justify-end">
        <TouchableOpacity
          className="bg-gold-500 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
          onPress={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          activeOpacity={0.8}
        >
          {showForm ? (
            <X size={16} color="#1A1A1A" />
          ) : (
            <Plus size={16} color="#1A1A1A" />
          )}
          <Text className="text-elegant-dark font-sans-bold text-sm">
            {showForm ? "Cancelar" : "Nueva"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Create/Edit Form */}
      {showForm && (
        <View className="px-4 pb-3">
          <View className="bg-elegant-gray rounded-2xl p-4 border border-gold-500/30">
            <Text className="text-gold-500 font-sans-semibold text-sm mb-3">
              {editing ? "Editar categoría" : "Nueva categoría"}
            </Text>

            {/* Name */}
            <Text className="text-cream-300 font-sans text-xs mb-1">
              Nombre *
            </Text>
            <TextInput
              className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
              placeholder="Ej: Hamburguesas, Bebidas, Postres"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              autoFocus
            />

            {/* Description */}
            <Text className="text-cream-300 font-sans text-xs mb-1">
              Descripción
            </Text>
            <TextInput
              className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
              placeholder="Descripción breve de la categoría"
              placeholderTextColor="#666"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />

            {/* Display Order */}
            <Text className="text-cream-300 font-sans text-xs mb-1">
              Orden de visualización
            </Text>
            <TextInput
              className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-2"
              placeholder="0"
              placeholderTextColor="#666"
              value={displayOrder}
              onChangeText={setDisplayOrder}
              keyboardType="number-pad"
              maxLength={3}
            />
            <View className="flex-row items-start gap-1.5 mb-4">
              <Info size={11} color="#888" style={{ marginTop: 2 }} />
              <Text className="text-cream-400/60 font-sans text-[10px] flex-1">
                Número menor = aparece primero. Usá 0 para la primera categoría
                del catálogo.
              </Text>
            </View>

            {/* Actions */}
            <View className="flex-row gap-2">
              {editing && (
                <TouchableOpacity
                  className="flex-1 py-2.5 rounded-xl items-center border border-red-500/30"
                  onPress={() => {
                    handleDelete(editing);
                    resetForm();
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-red-400 font-sans-medium text-sm">
                    Eliminar
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="flex-1 bg-gold-500 py-2.5 rounded-xl items-center"
                onPress={handleSave}
                disabled={createCategory.isPending || updateCategory.isPending}
                activeOpacity={0.8}
              >
                <Text className="text-elegant-dark font-sans-bold text-sm">
                  {createCategory.isPending || updateCategory.isPending
                    ? "Guardando..."
                    : editing
                    ? "Actualizar"
                    : "Crear"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Categories list */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EB1C8D" />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onLongPress={() => startEdit(item)}
            />
          )}
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
                No hay categorías
              </Text>
              <Text className="text-cream-400 font-sans text-sm mt-1">
                Tocá "Nueva" para crear una
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
