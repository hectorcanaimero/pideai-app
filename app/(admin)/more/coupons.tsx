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
import {
  Ticket,
  Percent,
  DollarSign,
  Info,
  Plus,
  X,
  Trash2,
} from "lucide-react-native";

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: string;
  value: number;
  is_active: boolean | null;
  usage_count: number | null;
  usage_limit: number | null;
  minimum_order_amount: number | null;
  maximum_discount: number | null;
  start_date: string | null;
  end_date: string | null;
}

interface CouponFormData {
  code: string;
  name: string;
  type: string;
  value: string;
  minimum_order_amount: string;
  maximum_discount: string;
  usage_limit: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const emptyForm: CouponFormData = {
  code: "",
  name: "",
  type: "percentage",
  value: "",
  minimum_order_amount: "",
  maximum_discount: "",
  usage_limit: "",
  start_date: "",
  end_date: "",
  is_active: true,
};

function formatValue(type: string, value: number): string {
  if (type === "percentage") return `${value}%`;
  return `$${value.toFixed(2)}`;
}

function formatType(type: string): string {
  switch (type) {
    case "percentage":
      return "Porcentaje";
    case "fixed_amount":
      return "Monto fijo";
    default:
      return type;
  }
}

export default function CouponsScreen() {
  const { store } = useStore();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponFormData>(emptyForm);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["coupons", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select(
          "id, code, name, description, type, value, is_active, usage_count, usage_limit, minimum_order_amount, maximum_discount, start_date, end_date"
        )
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Coupon[];
    },
    enabled: !!store?.id,
  });

  const toggleActive = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const createCoupon = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { error } = await supabase
        .from("coupons")
        .insert({ ...data, store_id: store!.id });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const updateCoupon = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Record<string, unknown> & { id: string }) => {
      const { error } = await supabase
        .from("coupons")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCoupon(null);
    setShowForm(false);
  };

  const startEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      value: String(coupon.value),
      minimum_order_amount: coupon.minimum_order_amount
        ? String(coupon.minimum_order_amount)
        : "",
      maximum_discount: coupon.maximum_discount
        ? String(coupon.maximum_discount)
        : "",
      usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : "",
      start_date: coupon.start_date ?? "",
      end_date: coupon.end_date ?? "",
      is_active: coupon.is_active ?? true,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      Alert.alert("Error", "El código del cupón es requerido");
      return;
    }
    if (!form.name.trim()) {
      Alert.alert("Error", "El nombre del cupón es requerido");
      return;
    }
    if (!form.value || parseFloat(form.value) <= 0) {
      Alert.alert("Error", "El valor del cupón debe ser mayor a 0");
      return;
    }

    const couponData = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      type: form.type,
      value: parseFloat(form.value),
      minimum_order_amount: form.minimum_order_amount
        ? parseFloat(form.minimum_order_amount)
        : null,
      maximum_discount: form.maximum_discount
        ? parseFloat(form.maximum_discount)
        : null,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit, 10) : null,
      start_date: form.start_date.trim() || null,
      end_date: form.end_date.trim() || null,
      is_active: form.is_active,
    };

    try {
      if (editingCoupon) {
        await updateCoupon.mutateAsync({ id: editingCoupon.id, ...couponData });
      } else {
        await createCoupon.mutateAsync(couponData);
      }
      resetForm();
    } catch {
      Alert.alert("Error", "No se pudo guardar el cupón");
    }
  };

  const handleDelete = () => {
    if (!editingCoupon) return;
    Alert.alert(
      "Eliminar cupón",
      `¿Eliminar "${editingCoupon.code}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCoupon.mutateAsync(editingCoupon.id);
              resetForm();
            } catch {
              Alert.alert("Error", "No se pudo eliminar el cupón");
            }
          },
        },
      ]
    );
  };

  const isSaving = createCoupon.isPending || updateCoupon.isPending;

  const renderForm = () => {
    if (!showForm) return null;

    return (
      <View className="bg-elegant-gray rounded-2xl p-4 mx-4 mb-3 border border-gold-500/30">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gold-500 font-sans-semibold text-sm">
            {editingCoupon ? "Editar cupón" : "Nuevo cupón"}
          </Text>
          <TouchableOpacity onPress={resetForm}>
            <X size={18} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Code */}
        <Text className="text-cream-300 font-sans text-xs mb-1">Código *</Text>
        <TextInput
          className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
          value={form.code}
          onChangeText={(t) => setForm((f) => ({ ...f, code: t.toUpperCase() }))}
          placeholder="Ej: DESCUENTO10"
          placeholderTextColor="#666"
          autoCapitalize="characters"
          autoFocus
        />

        {/* Name */}
        <Text className="text-cream-300 font-sans text-xs mb-1">Nombre *</Text>
        <TextInput
          className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
          value={form.name}
          onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
          placeholder="Ej: 10% de descuento"
          placeholderTextColor="#666"
        />

        {/* Type selector */}
        <Text className="text-cream-300 font-sans text-xs mb-1">Tipo</Text>
        <View className="flex-row gap-2 mb-3">
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl items-center ${
              form.type === "percentage" ? "bg-gold-500" : "bg-elegant-dark"
            }`}
            onPress={() => setForm((f) => ({ ...f, type: "percentage" }))}
            activeOpacity={0.7}
          >
            <Text
              className={`font-sans-medium text-xs ${
                form.type === "percentage"
                  ? "text-elegant-dark"
                  : "text-cream-300"
              }`}
            >
              Porcentaje
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl items-center ${
              form.type === "fixed_amount" ? "bg-gold-500" : "bg-elegant-dark"
            }`}
            onPress={() => setForm((f) => ({ ...f, type: "fixed_amount" }))}
            activeOpacity={0.7}
          >
            <Text
              className={`font-sans-medium text-xs ${
                form.type === "fixed_amount"
                  ? "text-elegant-dark"
                  : "text-cream-300"
              }`}
            >
              Monto fijo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Value */}
        <Text className="text-cream-300 font-sans text-xs mb-1">
          Valor {form.type === "percentage" ? "(%)" : "($)"} *
        </Text>
        <TextInput
          className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
          value={form.value}
          onChangeText={(t) => setForm((f) => ({ ...f, value: t }))}
          keyboardType="decimal-pad"
          placeholder={form.type === "percentage" ? "10" : "5.00"}
          placeholderTextColor="#666"
        />

        {/* Minimum order amount */}
        <Text className="text-cream-300 font-sans text-xs mb-1">
          Monto mínimo de orden ($)
        </Text>
        <TextInput
          className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
          value={form.minimum_order_amount}
          onChangeText={(t) =>
            setForm((f) => ({ ...f, minimum_order_amount: t }))
          }
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#666"
        />

        {/* Maximum discount (only for percentage) */}
        {form.type === "percentage" && (
          <>
            <Text className="text-cream-300 font-sans text-xs mb-1">
              Descuento máximo ($)
            </Text>
            <TextInput
              className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
              value={form.maximum_discount}
              onChangeText={(t) =>
                setForm((f) => ({ ...f, maximum_discount: t }))
              }
              keyboardType="decimal-pad"
              placeholder="Sin límite"
              placeholderTextColor="#666"
            />
          </>
        )}

        {/* Usage limit */}
        <Text className="text-cream-300 font-sans text-xs mb-1">
          Límite de usos
        </Text>
        <TextInput
          className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
          value={form.usage_limit}
          onChangeText={(t) => setForm((f) => ({ ...f, usage_limit: t }))}
          keyboardType="number-pad"
          placeholder="Sin límite"
          placeholderTextColor="#666"
        />

        {/* Start date */}
        <Text className="text-cream-300 font-sans text-xs mb-1">
          Fecha inicio (YYYY-MM-DD)
        </Text>
        <TextInput
          className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
          value={form.start_date}
          onChangeText={(t) => setForm((f) => ({ ...f, start_date: t }))}
          placeholder="2026-01-01"
          placeholderTextColor="#666"
        />

        {/* End date */}
        <Text className="text-cream-300 font-sans text-xs mb-1">
          Fecha fin (YYYY-MM-DD)
        </Text>
        <TextInput
          className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
          value={form.end_date}
          onChangeText={(t) => setForm((f) => ({ ...f, end_date: t }))}
          placeholder="2026-12-31"
          placeholderTextColor="#666"
        />

        {/* Is active */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-cream-300 font-sans text-xs">Activo</Text>
          <Switch
            value={form.is_active}
            onValueChange={(val) => setForm((f) => ({ ...f, is_active: val }))}
            trackColor={{ false: "#444", true: "#EB1C8D" }}
            thumbColor="#fff"
          />
        </View>

        {/* Actions */}
        <TouchableOpacity
          className="bg-gold-500 py-2.5 rounded-xl items-center"
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          <Text className="text-elegant-dark font-sans-bold text-sm">
            {isSaving
              ? "Guardando..."
              : editingCoupon
              ? "Actualizar"
              : "Crear cupón"}
          </Text>
        </TouchableOpacity>

        {editingCoupon && (
          <TouchableOpacity
            className="flex-row items-center justify-center gap-1.5 py-2.5 mt-2 rounded-xl border border-red-500/30"
            onPress={handleDelete}
            disabled={deleteCoupon.isPending}
            activeOpacity={0.8}
          >
            <Trash2 size={14} color="#EF4444" />
            <Text className="text-red-500 font-sans-medium text-sm">
              {deleteCoupon.isPending ? "Eliminando..." : "Eliminar cupón"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: Coupon }) => {
      const usageCount = item.usage_count ?? 0;
      const usageLimit = item.usage_limit;
      const usageText = usageLimit
        ? `${usageCount}/${usageLimit} usos`
        : `${usageCount} usos`;
      const usageProgress = usageLimit
        ? Math.min(usageCount / usageLimit, 1)
        : 0;

      return (
        <TouchableOpacity
          className="bg-elegant-gray rounded-xl p-4 mb-3"
          onLongPress={() => startEdit(item)}
          activeOpacity={0.8}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-gold font-sans-bold text-lg tracking-wider">
                {item.code}
              </Text>
              <Text className="text-white font-sans text-sm mt-1">
                {item.name}
              </Text>
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
              {item.type === "percentage" ? (
                <Percent size={14} color="#EB1C8D" />
              ) : (
                <DollarSign size={14} color="#EB1C8D" />
              )}
              <Text className="text-cream-400 font-sans text-xs ml-1">
                {formatType(item.type)} · {formatValue(item.type, item.value)}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ticket size={14} color="#EB1C8D" />
              <Text className="text-cream-400 font-sans text-xs ml-1">
                {usageText}
              </Text>
            </View>
          </View>

          {/* Usage progress bar */}
          {usageLimit ? (
            <View className="mt-3">
              <View className="h-1.5 bg-elegant-dark rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${usageProgress * 100}%`,
                    backgroundColor:
                      usageProgress >= 0.9 ? "#EF4444" : "#EB1C8D",
                  }}
                />
              </View>
            </View>
          ) : null}
        </TouchableOpacity>
      );
    },
    [toggleActive]
  );

  return (
    <View className="flex-1 bg-elegant-dark">
      {/* Header row */}
      <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
        <Text className="text-cream-400 font-sans text-xs">
          {data?.length ?? 0} cupones
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
            Nuevo
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EB1C8D" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#EB1C8D"
              colors={["#EB1C8D"]}
            />
          }
          ListHeaderComponent={renderForm()}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ticket size={48} color="#444" />
              <Text className="text-cream-400 font-sans text-base mt-4">
                No hay cupones
              </Text>
            </View>
          }
          ListFooterComponent={
            <View className="flex-row items-center bg-elegant-gray/50 rounded-xl p-3 mt-2">
              <Info size={16} color="#EB1C8D" />
              <Text className="text-cream-400 font-sans text-xs ml-2 flex-1">
                Los cupones permiten a tus clientes aplicar descuentos al
                momento de pagar.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
