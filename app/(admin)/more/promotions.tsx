import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Switch,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";
import { Tag, Calendar, Percent, Info, Plus, X, Trash2 } from "lucide-react-native";

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  type: string;
  value: number;
  is_active: boolean | null;
  start_date: string | null;
  end_date: string | null;
  product_ids: string[] | null;
  category_ids: string[] | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatType(type: string): string {
  switch (type) {
    case "percentage":
      return "Porcentaje";
    case "fixed":
      return "Monto fijo";
    case "buy_x_get_y":
      return "Llevá X pagá Y";
    default:
      return type;
  }
}

function formatValue(type: string, value: number): string {
  if (type === "percentage") return `${value}%`;
  return `$${value.toFixed(2)}`;
}

export default function PromotionsScreen() {
  const { store } = useStore();
  const queryClient = useQueryClient();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<"percentage" | "fixed">("percentage");
  const [formValue, setFormValue] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["promotions", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("id, name, description, type, value, is_active, start_date, end_date, product_ids, category_ids")
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Promotion[];
    },
    enabled: !!store?.id,
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("promotions")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });

  const createPromotion = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string | null;
      type: string;
      value: number;
      is_active: boolean;
      start_date: string | null;
      end_date: string | null;
    }) => {
      const { error } = await supabase.from("promotions").insert({
        ...data,
        store_id: store!.id,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });

  const updatePromotion = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name: string;
      description: string | null;
      type: string;
      value: number;
      is_active: boolean;
      start_date: string | null;
      end_date: string | null;
    }) => {
      const { error } = await supabase
        .from("promotions")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });

  const deletePromotion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("promotions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormType("percentage");
    setFormValue("");
    setFormStartDate("");
    setFormEndDate("");
    setFormIsActive(true);
    setEditingPromotion(null);
    setShowForm(false);
  };

  const startEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setFormName(promo.name);
    setFormDescription(promo.description ?? "");
    setFormType(promo.type === "fixed" ? "fixed" : "percentage");
    setFormValue(String(promo.value));
    setFormStartDate(promo.start_date ?? "");
    setFormEndDate(promo.end_date ?? "");
    setFormIsActive(promo.is_active ?? true);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert("Error", "El nombre de la promoción es requerido");
      return;
    }
    if (!formValue.trim() || isNaN(parseFloat(formValue))) {
      Alert.alert("Error", "El valor de la promoción es requerido");
      return;
    }

    const promoData = {
      name: formName.trim(),
      description: formDescription.trim() || null,
      type: formType,
      value: parseFloat(formValue),
      is_active: formIsActive,
      start_date: formStartDate.trim() || null,
      end_date: formEndDate.trim() || null,
    };

    try {
      if (editingPromotion) {
        await updatePromotion.mutateAsync({ id: editingPromotion.id, ...promoData });
      } else {
        await createPromotion.mutateAsync(promoData);
      }
      resetForm();
    } catch {
      Alert.alert("Error", "No se pudo guardar la promoción");
    }
  };

  const handleDelete = () => {
    if (!editingPromotion) return;
    Alert.alert(
      "Eliminar promoción",
      `¿Eliminar "${editingPromotion.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePromotion.mutateAsync(editingPromotion.id);
              resetForm();
            } catch {
              Alert.alert("Error", "No se pudo eliminar la promoción");
            }
          },
        },
      ]
    );
  };

  const isSaving = createPromotion.isPending || updatePromotion.isPending;

  const renderItem = useCallback(
    ({ item }: { item: Promotion }) => (
      <TouchableOpacity
        className="bg-elegant-gray rounded-xl p-4 mb-3"
        onLongPress={() => startEdit(item)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-bold text-base">
              {item.name}
            </Text>
            {item.description ? (
              <Text className="text-cream-400 font-sans text-sm mt-1">
                {item.description}
              </Text>
            ) : null}
          </View>
          <Switch
            value={item.is_active ?? false}
            onValueChange={(val) =>
              toggleActive.mutate({ id: item.id, is_active: val })
            }
            trackColor={{ false: "#333", true: "#EB1C8D" }}
            thumbColor="#fff"
          />
        </View>

        <View className="flex-row items-center mt-3 flex-wrap gap-y-2">
          <View className="flex-row items-center mr-4">
            <Percent size={14} color="#EB1C8D" />
            <Text className="text-cream-400 font-sans text-xs ml-1">
              {formatType(item.type)} · {formatValue(item.type, item.value)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Calendar size={14} color="#EB1C8D" />
            <Text className="text-cream-400 font-sans text-xs ml-1">
              {formatDate(item.start_date)} → {formatDate(item.end_date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [toggleActive]
  );

  const ListHeader = () => (
    <View>
      {/* Header with count and Nueva button */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-cream-400 font-sans text-xs">
          {data?.length ?? 0} promociones
        </Text>
        <TouchableOpacity
          className="bg-gold-500 px-3 py-1.5 rounded-lg flex-row items-center gap-1"
          onPress={() => {
            resetForm();
            setShowForm(true);
          }}
          activeOpacity={0.8}
        >
          <Plus size={14} color="#1A1A1A" />
          <Text className="text-elegant-dark font-sans-bold text-xs">
            Nueva
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info text */}
      <View className="flex-row items-start bg-elegant-gray/50 rounded-xl p-3 mb-3">
        <Info size={16} color="#EB1C8D" />
        <Text className="text-cream-400 font-sans text-xs ml-2 flex-1">
          Las promociones te permiten ofrecer descuentos a tus clientes. Podés
          crear descuentos por porcentaje o monto fijo, y definir fechas de
          vigencia. Mantené presionada una promoción para editarla.
        </Text>
      </View>

      {/* Inline form */}
      {showForm && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-3 border border-gold-500/30">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gold-500 font-sans-semibold text-sm">
              {editingPromotion ? "Editar promoción" : "Nueva promoción"}
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <X size={18} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text className="text-cream-300 font-sans text-xs mb-1">
            Nombre *
          </Text>
          <TextInput
            className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
            value={formName}
            onChangeText={setFormName}
            placeholder="Ej: 2x1 en hamburguesas"
            placeholderTextColor="#666"
            autoFocus
          />

          {/* Description */}
          <Text className="text-cream-300 font-sans text-xs mb-1">
            Descripción
          </Text>
          <TextInput
            className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
            value={formDescription}
            onChangeText={setFormDescription}
            placeholder="Descripción opcional"
            placeholderTextColor="#666"
            multiline
          />

          {/* Type selector */}
          <Text className="text-cream-300 font-sans text-xs mb-1">Tipo *</Text>
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              className={`flex-1 py-2.5 rounded-xl items-center ${
                formType === "percentage" ? "bg-gold-500" : "bg-elegant-dark"
              }`}
              onPress={() => setFormType("percentage")}
              activeOpacity={0.7}
            >
              <Text
                className={`font-sans-medium text-sm ${
                  formType === "percentage"
                    ? "text-elegant-dark"
                    : "text-cream-300"
                }`}
              >
                Porcentaje
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2.5 rounded-xl items-center ${
                formType === "fixed" ? "bg-gold-500" : "bg-elegant-dark"
              }`}
              onPress={() => setFormType("fixed")}
              activeOpacity={0.7}
            >
              <Text
                className={`font-sans-medium text-sm ${
                  formType === "fixed" ? "text-elegant-dark" : "text-cream-300"
                }`}
              >
                Monto fijo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Value */}
          <Text className="text-cream-300 font-sans text-xs mb-1">
            Valor * {formType === "percentage" ? "(%)" : "($)"}
          </Text>
          <TextInput
            className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
            value={formValue}
            onChangeText={setFormValue}
            keyboardType="decimal-pad"
            placeholder={formType === "percentage" ? "10" : "5.00"}
            placeholderTextColor="#666"
          />

          {/* Start date */}
          <Text className="text-cream-300 font-sans text-xs mb-1">
            Fecha inicio
          </Text>
          <TextInput
            className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
            value={formStartDate}
            onChangeText={setFormStartDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#666"
          />

          {/* End date */}
          <Text className="text-cream-300 font-sans text-xs mb-1">
            Fecha fin
          </Text>
          <TextInput
            className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
            value={formEndDate}
            onChangeText={setFormEndDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#666"
          />

          {/* Is active toggle */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-cream-300 font-sans text-xs">Activa</Text>
            <Switch
              value={formIsActive}
              onValueChange={setFormIsActive}
              trackColor={{ false: "#444", true: "#EB1C8D" }}
              thumbColor="#fff"
            />
          </View>

          {/* Delete button (only when editing) */}
          {editingPromotion && (
            <TouchableOpacity
              className="flex-row items-center justify-center py-2.5 rounded-xl mb-3 border border-red-500/30"
              onPress={handleDelete}
              disabled={deletePromotion.isPending}
              activeOpacity={0.7}
            >
              <Trash2 size={15} color="#EF4444" />
              <Text className="text-red-500 font-sans-medium text-sm ml-2">
                {deletePromotion.isPending ? "Eliminando..." : "Eliminar promoción"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Save button */}
          <TouchableOpacity
            className="bg-gold-500 py-2.5 rounded-xl items-center"
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <Text className="text-elegant-dark font-sans-bold text-sm">
              {isSaving
                ? "Guardando..."
                : editingPromotion
                ? "Actualizar"
                : "Crear promoción"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-elegant-dark">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EB1C8D" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
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
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Tag size={48} color="#444" />
              <Text className="text-cream-400 font-sans text-base mt-4">
                No hay promociones
              </Text>
              <Text className="text-cream-400/60 font-sans text-xs mt-1">
                Tocá "Nueva" para crear tu primera promoción
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
