import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { Plus, X, Trash2 } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import {
  useGroupExtras,
  useCreateExtra,
  useDeleteExtra,
  useUpdateExtra,
  type ProductExtra,
} from "@/hooks/useExtras";

export default function ExtrasGroupScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const {
    data: extras,
    isLoading,
    refetch,
    isRefetching,
  } = useGroupExtras(groupId);
  const createExtra = useCreateExtra();
  const deleteExtra = useDeleteExtra();
  const updateExtra = useUpdateExtra();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createExtra.mutateAsync({
      group_id: groupId!,
      name: newName.trim(),
      price: parseFloat(newPrice) || 0,
    });
    setNewName("");
    setNewPrice("");
    setShowCreate(false);
  };

  const handleDelete = (extra: ProductExtra) => {
    Alert.alert("Eliminar extra", `¿Eliminar "${extra.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExtra.mutate(extra.id),
      },
    ]);
  };

  const renderExtra = ({ item }: { item: ProductExtra }) => (
    <View className="bg-elegant-gray rounded-2xl p-4 mb-2 flex-row items-center">
      <View className="flex-1">
        <Text className="text-white font-sans-medium text-sm">{item.name}</Text>
        <Text className="text-gold-500 font-sans text-xs mt-0.5">
          +${item.price.toFixed(2)}
        </Text>
      </View>
      <Switch
        value={item.is_available !== false}
        onValueChange={(v) =>
          updateExtra.mutate({ id: item.id, is_available: v })
        }
        trackColor={{ false: "#444", true: "#FFC300" }}
        thumbColor="#fff"
      />
      <TouchableOpacity className="ml-3" onPress={() => handleDelete(item)}>
        <Trash2 size={16} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-elegant-dark">
      <View className="px-4 pt-3 pb-1 flex-row justify-end">
        <TouchableOpacity
          className="bg-gold-500 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
          onPress={() => setShowCreate(!showCreate)}
          activeOpacity={0.8}
        >
          {showCreate ? (
            <X size={16} color="#1A1A2E" />
          ) : (
            <Plus size={16} color="#1A1A2E" />
          )}
          <Text className="text-elegant-dark font-sans-bold text-sm">
            {showCreate ? "Cancelar" : "Nuevo Extra"}
          </Text>
        </TouchableOpacity>
      </View>

      {showCreate && (
        <View className="px-4 pb-3 gap-2">
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-sm"
            placeholder="Nombre del extra"
            placeholderTextColor="#666"
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-sm"
              placeholder="Precio (0.00)"
              placeholderTextColor="#666"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity
              className="bg-gold-500 px-6 rounded-xl items-center justify-center"
              onPress={handleCreate}
            >
              <Text className="text-elegant-dark font-sans-bold text-sm">
                Crear
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={extras}
        renderItem={renderExtra}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#FFC300"
            colors={["#FFC300"]}
          />
        }
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-cream-400 font-sans">
              No hay extras en este grupo
            </Text>
          </View>
        }
      />
    </View>
  );
}
