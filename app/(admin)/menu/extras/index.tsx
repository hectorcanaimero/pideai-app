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
  Switch,
  ScrollView,
} from "react-native";
import {
  Layers,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Pencil,
  Info,
  ChevronDown,
} from "lucide-react-native";
import { router } from "expo-router";
import {
  useExtraGroups,
  useCreateExtraGroup,
  useUpdateExtraGroup,
  useDeleteExtraGroup,
  type ExtraGroup,
} from "@/hooks/useExtras";
import { useStore } from "@/contexts/StoreContext";
import { useCategories, type Category } from "@/hooks/useCategories";

type FormData = {
  name: string;
  selection_type: "single" | "multiple";
  is_required: boolean;
  min_selections: string;
  max_selections: string;
  assignment_type: "none" | "category";
  category_id: string | null;
};

const defaultForm: FormData = {
  name: "",
  selection_type: "single",
  is_required: false,
  min_selections: "0",
  max_selections: "",
  assignment_type: "none",
  category_id: null,
};

function formFromGroup(group: ExtraGroup): FormData {
  return {
    name: group.name,
    selection_type: group.selection_type,
    is_required: group.is_required,
    min_selections: String(group.min_selections ?? 0),
    max_selections: group.max_selections != null ? String(group.max_selections) : "",
    assignment_type: group.category_id ? "category" : "none",
    category_id: group.category_id,
  };
}

export default function ExtraGroupsScreen() {
  const { store } = useStore();
  const { data: groups, isLoading, refetch, isRefetching } = useExtraGroups(store?.id);
  const { data: categories } = useCategories();
  const createGroup = useCreateExtraGroup();
  const updateGroup = useUpdateExtraGroup();
  const deleteGroup = useDeleteExtraGroup();

  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ExtraGroup | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [showHelp, setShowHelp] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const openCreate = () => {
    setEditingGroup(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (group: ExtraGroup) => {
    setEditingGroup(group);
    setForm(formFromGroup(group));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingGroup(null);
    setForm(defaultForm);
    setShowCategoryPicker(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "El nombre del grupo es obligatorio");
      return;
    }

    const payload = {
      name: form.name.trim(),
      selection_type: form.selection_type as "single" | "multiple",
      is_required: form.is_required,
      min_selections: parseInt(form.min_selections) || 0,
      max_selections: form.max_selections ? parseInt(form.max_selections) : null,
      category_id: form.assignment_type === "category" ? form.category_id : null,
    };

    try {
      if (editingGroup) {
        await updateGroup.mutateAsync({ id: editingGroup.id, ...payload });
      } else {
        await createGroup.mutateAsync(payload);
      }
      closeForm();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo guardar el grupo");
    }
  };

  const handleDelete = (group: ExtraGroup) => {
    Alert.alert(
      "Eliminar grupo",
      `¿Eliminar "${group.name}" y todos sus extras?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteGroup.mutate(group.id),
        },
      ],
    );
  };

  const selectedCategory = categories?.find((c) => c.id === form.category_id);

  const renderGroupItem = ({ item }: { item: ExtraGroup }) => {
    const assignedCat = categories?.find((c) => c.id === item.category_id);

    return (
      <TouchableOpacity
        className="bg-elegant-gray rounded-xl p-4 mb-2 flex-row items-center"
        onPress={() => router.push(`/(admin)/menu/extras/${item.id}`)}
        onLongPress={() => openEdit(item)}
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <Text className="text-white font-sans-medium text-sm">{item.name}</Text>
          <Text className="text-cream-400 font-sans text-xs mt-0.5">
            {item.selection_type === "single" ? "Seleccion unica" : "Seleccion multiple"}
            {item.is_required ? " - Requerido" : " - Opcional"}
          </Text>
          {assignedCat && (
            <Text className="text-gold-500 font-sans text-xs mt-0.5">
              Categoria: {assignedCat.name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="p-2 mr-1"
          onPress={() => openEdit(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Pencil size={14} color="#FFC300" />
        </TouchableOpacity>
        <TouchableOpacity
          className="p-2 mr-1"
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Trash2 size={14} color="#EF4444" />
        </TouchableOpacity>
        <ChevronRight size={16} color="#666" />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-elegant-dark">
      <FlatList
        data={groups}
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
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Layers size={20} color="#FFC300" />
                <Text className="text-white font-sans-bold text-lg">Grupos de Extra</Text>
              </View>
              <TouchableOpacity
                className="bg-gold-500 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
                onPress={showForm ? closeForm : openCreate}
                activeOpacity={0.8}
              >
                {showForm ? (
                  <X size={16} color="#1A1A2E" />
                ) : (
                  <Plus size={16} color="#1A1A2E" />
                )}
                <Text className="text-elegant-dark font-sans-bold text-sm">
                  {showForm ? "Cancelar" : "Crear grupo"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Help section */}
            <TouchableOpacity
              className="bg-elegant-gray/50 rounded-xl p-3 mb-3 flex-row items-start gap-2"
              onPress={() => setShowHelp(!showHelp)}
              activeOpacity={0.8}
            >
              <Info size={16} color="#FFC300" style={{ marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-gold-500 font-sans-medium text-xs mb-1">
                  Como funcionan los extras?
                </Text>
                {showHelp && (
                  <View>
                    <Text className="text-cream-400 font-sans text-xs leading-5 mb-2">
                      Los grupos de extras permiten que tus clientes personalicen sus pedidos.
                    </Text>
                    <Text className="text-cream-400 font-sans text-xs leading-5">
                      {"\u2022"} Crea un grupo (ej: "Tamano", "Ingredientes Extra", "Salsas"){"\n"}
                      {"\u2022"} Defini si la seleccion es unica (radio) o multiple (checkbox){"\n"}
                      {"\u2022"} Marca si es obligatorio u opcional{"\n"}
                      {"\u2022"} Asignalo a una categoria completa o a productos individuales{"\n"}
                      {"\u2022"} Agrega las opciones dentro del grupo con su precio
                    </Text>
                    <Text className="text-cream-400/70 font-sans text-xs leading-5 mt-2 italic">
                      Ejemplo: Grupo "Tamano" con opciones "Pequeno ($0)", "Mediano ($2)", "Grande ($4)"
                    </Text>
                  </View>
                )}
              </View>
              <ChevronDown
                size={14}
                color="#999"
                style={{
                  marginTop: 2,
                  transform: [{ rotate: showHelp ? "180deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>

            {/* Create / Edit form */}
            {showForm && (
              <View className="bg-elegant-gray rounded-xl p-4 mb-4 gap-3">
                <Text className="text-white font-sans-bold text-sm mb-1">
                  {editingGroup ? "Editar grupo" : "Nuevo grupo de extras"}
                </Text>
                <Text className="text-cream-400 font-sans text-xs -mt-2 mb-1">
                  Los grupos de extras permiten que tus clientes personalicen sus pedidos. Podes crear opciones como "Tamano", "Ingredientes Extra", "Salsas", etc.
                </Text>

                {/* Name */}
                <TextInput
                  className="bg-elegant-dark text-white px-4 py-3 rounded-xl font-sans text-sm"
                  placeholder="Nombre del grupo (ej: Tamano, Salsas)"
                  placeholderTextColor="#666"
                  value={form.name}
                  onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                  autoFocus
                />

                {/* Selection type */}
                <View>
                  <Text className="text-cream-400 font-sans text-xs mb-2">Tipo de seleccion</Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className={`flex-1 py-2.5 rounded-xl items-center ${
                        form.selection_type === "single"
                          ? "bg-gold-500"
                          : "bg-elegant-dark"
                      }`}
                      onPress={() =>
                        setForm((f) => ({ ...f, selection_type: "single" }))
                      }
                    >
                      <Text
                        className={`font-sans-medium text-xs ${
                          form.selection_type === "single"
                            ? "text-elegant-dark"
                            : "text-cream-400"
                        }`}
                      >
                        Unica (radio)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 py-2.5 rounded-xl items-center ${
                        form.selection_type === "multiple"
                          ? "bg-gold-500"
                          : "bg-elegant-dark"
                      }`}
                      onPress={() =>
                        setForm((f) => ({ ...f, selection_type: "multiple" }))
                      }
                    >
                      <Text
                        className={`font-sans-medium text-xs ${
                          form.selection_type === "multiple"
                            ? "text-elegant-dark"
                            : "text-cream-400"
                        }`}
                      >
                        Multiple (checkbox)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Required toggle */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-cream-400 font-sans text-xs">Obligatorio</Text>
                  <Switch
                    value={form.is_required}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, is_required: v }))
                    }
                    trackColor={{ false: "#444", true: "#FFC300" }}
                    thumbColor="#fff"
                  />
                </View>

                {/* Min / Max selections */}
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="text-cream-400 font-sans text-xs mb-1">
                      Min. selecciones
                    </Text>
                    <TextInput
                      className="bg-elegant-dark text-white px-4 py-3 rounded-xl font-sans text-sm"
                      placeholder="0"
                      placeholderTextColor="#666"
                      value={form.min_selections}
                      onChangeText={(v) =>
                        setForm((f) => ({ ...f, min_selections: v }))
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-cream-400 font-sans text-xs mb-1">
                      Max. selecciones
                    </Text>
                    <TextInput
                      className="bg-elegant-dark text-white px-4 py-3 rounded-xl font-sans text-sm"
                      placeholder="Sin limite"
                      placeholderTextColor="#666"
                      value={form.max_selections}
                      onChangeText={(v) =>
                        setForm((f) => ({ ...f, max_selections: v }))
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                {/* Assignment section */}
                <View>
                  <Text className="text-cream-400 font-sans text-xs mb-2">Asignar a</Text>
                  <View className="flex-row gap-2 mb-2">
                    <TouchableOpacity
                      className={`flex-1 py-2.5 rounded-xl items-center ${
                        form.assignment_type === "none"
                          ? "bg-gold-500"
                          : "bg-elegant-dark"
                      }`}
                      onPress={() =>
                        setForm((f) => ({
                          ...f,
                          assignment_type: "none",
                          category_id: null,
                        }))
                      }
                    >
                      <Text
                        className={`font-sans-medium text-xs ${
                          form.assignment_type === "none"
                            ? "text-elegant-dark"
                            : "text-cream-400"
                        }`}
                      >
                        Productos especificos
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 py-2.5 rounded-xl items-center ${
                        form.assignment_type === "category"
                          ? "bg-gold-500"
                          : "bg-elegant-dark"
                      }`}
                      onPress={() =>
                        setForm((f) => ({ ...f, assignment_type: "category" }))
                      }
                    >
                      <Text
                        className={`font-sans-medium text-xs ${
                          form.assignment_type === "category"
                            ? "text-elegant-dark"
                            : "text-cream-400"
                        }`}
                      >
                        Categoria
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {form.assignment_type === "category" && (
                    <View>
                      <TouchableOpacity
                        className="bg-elegant-dark rounded-xl px-4 py-3 flex-row items-center justify-between"
                        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                      >
                        <Text
                          className={`font-sans text-sm ${
                            selectedCategory ? "text-white" : "text-cream-400/50"
                          }`}
                        >
                          {selectedCategory?.name ?? "Seleccionar categoria"}
                        </Text>
                        <ChevronDown
                          size={14}
                          color="#999"
                          style={{
                            transform: [
                              { rotate: showCategoryPicker ? "180deg" : "0deg" },
                            ],
                          }}
                        />
                      </TouchableOpacity>

                      {showCategoryPicker && (
                        <View className="bg-elegant-dark rounded-xl mt-1 overflow-hidden">
                          {categories?.map((cat) => (
                            <TouchableOpacity
                              key={cat.id}
                              className={`px-4 py-3 border-b border-white/5 ${
                                form.category_id === cat.id ? "bg-gold-500/20" : ""
                              }`}
                              onPress={() => {
                                setForm((f) => ({ ...f, category_id: cat.id }));
                                setShowCategoryPicker(false);
                              }}
                            >
                              <Text
                                className={`font-sans text-sm ${
                                  form.category_id === cat.id
                                    ? "text-gold-500"
                                    : "text-cream-400"
                                }`}
                              >
                                {cat.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                          {(!categories || categories.length === 0) && (
                            <Text className="text-cream-400/50 font-sans text-xs px-4 py-3">
                              No hay categorias creadas
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  )}

                  {form.assignment_type === "none" && (
                    <Text className="text-cream-400/50 font-sans text-xs mt-1">
                      Asigna productos individuales desde la pantalla del producto
                    </Text>
                  )}
                </View>

                {/* Save button */}
                <TouchableOpacity
                  className="bg-gold-500 py-3 rounded-xl items-center mt-1"
                  onPress={handleSave}
                  disabled={createGroup.isPending || updateGroup.isPending}
                  activeOpacity={0.8}
                >
                  <Text className="text-elegant-dark font-sans-bold text-sm">
                    {createGroup.isPending || updateGroup.isPending
                      ? "Guardando..."
                      : editingGroup
                        ? "Guardar cambios"
                        : "Crear grupo"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        renderItem={renderGroupItem}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#FFC300" />
          ) : (
            <View className="items-center py-20">
              <Text className="text-cream-400 font-sans">No hay grupos de extras</Text>
              <Text className="text-cream-400/50 font-sans text-xs mt-2">
                Toca "Crear grupo" para empezar
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
