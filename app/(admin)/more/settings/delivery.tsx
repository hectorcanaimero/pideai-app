import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {
  Truck,
  Info,
  Gift,
  MapPin,
  DollarSign,
  Plus,
  X,
  Trash2,
  Edit3,
} from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

type DeliveryPriceMode = "fixed" | "by_zone";

interface DeliveryZone {
  id: string;
  store_id: string;
  zone_name: string;
  delivery_price: number;
  free_delivery_enabled: boolean | null;
  free_delivery_min_amount: number | null;
  display_order: number | null;
}

export default function DeliverySettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();
  const queryClient = useQueryClient();
  const currency = (store as any)?.currency ?? "USD";

  // Store settings state
  const [estimatedTime, setEstimatedTime] = useState("");
  const [priceMode, setPriceMode] = useState<DeliveryPriceMode>("fixed");
  const [fixedPrice, setFixedPrice] = useState("");
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(false);
  const [freeDeliveryMinAmount, setFreeDeliveryMinAmount] = useState("");

  // Zone form state
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [zoneName, setZoneName] = useState("");
  const [zonePrice, setZonePrice] = useState("");
  const [zoneFreeEnabled, setZoneFreeEnabled] = useState(false);
  const [zoneFreeMinAmount, setZoneFreeMinAmount] = useState("");

  useEffect(() => {
    if (store) {
      const s = store as any;
      setEstimatedTime(String(s.estimated_delivery_time ?? ""));
      setPriceMode((s.delivery_price_mode as DeliveryPriceMode) ?? "fixed");
      setFixedPrice(String(s.fixed_delivery_price ?? ""));
      setFreeDeliveryEnabled(s.free_delivery_enabled === true);
      setFreeDeliveryMinAmount(String(s.global_free_delivery_min_amount ?? ""));
    }
  }, [store]);

  // Fetch zones
  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ["delivery-zones", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_zones")
        .select("*")
        .eq("store_id", store!.id)
        .order("display_order", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as DeliveryZone[];
    },
    enabled: !!store?.id,
  });

  // Create zone
  const createZone = useMutation({
    mutationFn: async (data: {
      zone_name: string;
      delivery_price: number;
      free_delivery_enabled: boolean;
      free_delivery_min_amount: number | null;
    }) => {
      const { error } = await supabase.from("delivery_zones").insert({
        ...data,
        store_id: store!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["delivery-zones"] }),
  });

  // Update zone
  const updateZone = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      zone_name: string;
      delivery_price: number;
      free_delivery_enabled: boolean;
      free_delivery_min_amount: number | null;
    }) => {
      const { error } = await supabase
        .from("delivery_zones")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["delivery-zones"] }),
  });

  // Delete zone
  const deleteZone = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("delivery_zones").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["delivery-zones"] }),
  });

  const resetZoneForm = () => {
    setZoneName("");
    setZonePrice("");
    setZoneFreeEnabled(false);
    setZoneFreeMinAmount("");
    setEditingZone(null);
    setShowZoneForm(false);
  };

  const startEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setZoneName(zone.zone_name);
    setZonePrice(String(zone.delivery_price));
    setZoneFreeEnabled(zone.free_delivery_enabled === true);
    setZoneFreeMinAmount(String(zone.free_delivery_min_amount ?? ""));
    setShowZoneForm(true);
  };

  const handleSaveZone = async () => {
    if (!zoneName.trim()) {
      Alert.alert("Error", "El nombre de la zona es requerido");
      return;
    }

    const zoneData = {
      zone_name: zoneName.trim(),
      delivery_price: parseFloat(zonePrice) || 0,
      free_delivery_enabled: zoneFreeEnabled,
      free_delivery_min_amount: zoneFreeEnabled
        ? parseFloat(zoneFreeMinAmount) || null
        : null,
    };

    try {
      if (editingZone) {
        await updateZone.mutateAsync({ id: editingZone.id, ...zoneData });
      } else {
        await createZone.mutateAsync(zoneData);
      }
      resetZoneForm();
    } catch {
      Alert.alert("Error", "No se pudo guardar la zona");
    }
  };

  const handleDeleteZone = (zone: DeliveryZone) => {
    Alert.alert(
      "Eliminar zona",
      `¿Eliminar "${zone.zone_name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteZone.mutate(zone.id),
        },
      ]
    );
  };

  const handleSaveSettings = async () => {
    if (freeDeliveryEnabled && !freeDeliveryMinAmount.trim()) {
      Alert.alert("Error", "Ingresá el monto mínimo para envío gratis");
      return;
    }

    try {
      await updateStore.mutateAsync({
        estimated_delivery_time: parseInt(estimatedTime) || null,
        delivery_price_mode: priceMode,
        fixed_delivery_price:
          priceMode === "fixed" ? parseFloat(fixedPrice) || 0 : null,
        free_delivery_enabled: freeDeliveryEnabled,
        global_free_delivery_min_amount: freeDeliveryEnabled
          ? parseFloat(freeDeliveryMinAmount) || null
          : null,
      });
      Alert.alert("Guardado", "Configuración de entrega actualizada");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <View className="flex-row items-center gap-2 mb-6">
        <Truck size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Entrega</Text>
      </View>

      {/* Estimated delivery time */}
      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
        Tiempo estimado de entrega (minutos)
      </Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-2"
        value={estimatedTime}
        onChangeText={setEstimatedTime}
        keyboardType="number-pad"
        placeholder="30"
        placeholderTextColor="#666"
      />
      <View className="flex-row items-start gap-1.5 mb-6">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Tiempo aproximado que se le muestra al cliente cuando hace un pedido de
          delivery.
        </Text>
      </View>

      {/* Delivery price mode */}
      <View className="flex-row items-center gap-2 mb-3">
        <DollarSign size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-sm">
          Modo de precio de entrega
        </Text>
      </View>

      <View className="flex-row gap-2 mb-2">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl items-center ${
            priceMode === "fixed" ? "bg-gold-500" : "bg-elegant-gray"
          }`}
          onPress={() => setPriceMode("fixed")}
          activeOpacity={0.7}
        >
          <Text
            className={`font-sans-medium text-sm ${
              priceMode === "fixed" ? "text-elegant-dark" : "text-cream-300"
            }`}
          >
            Precio fijo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl items-center ${
            priceMode === "by_zone" ? "bg-gold-500" : "bg-elegant-gray"
          }`}
          onPress={() => setPriceMode("by_zone")}
          activeOpacity={0.7}
        >
          <Text
            className={`font-sans-medium text-sm ${
              priceMode === "by_zone" ? "text-elegant-dark" : "text-cream-300"
            }`}
          >
            Por zona
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-start gap-1.5 mb-4">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          {priceMode === "fixed"
            ? "Se cobra el mismo precio de envío para todos los pedidos."
            : "El precio de envío depende de la zona del cliente."}
        </Text>
      </View>

      {/* Fixed price input */}
      {priceMode === "fixed" && (
        <>
          <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
            Precio fijo de envío ({currency})
          </Text>
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-2"
            value={fixedPrice}
            onChangeText={setFixedPrice}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="#666"
          />
          <View className="flex-row items-start gap-1.5 mb-4">
            <Info size={12} color="#888" style={{ marginTop: 2 }} />
            <Text className="text-cream-400/60 font-sans text-xs flex-1">
              Este monto se suma automáticamente al total del pedido en órdenes
              de delivery.
            </Text>
          </View>
        </>
      )}

      {/* ============ DELIVERY ZONES (by_zone mode) ============ */}
      {priceMode === "by_zone" && (
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <MapPin size={16} color="#FFC300" />
              <Text className="text-white font-sans-semibold text-sm">
                Zonas de envío
              </Text>
            </View>
            <TouchableOpacity
              className="bg-gold-500 px-3 py-1.5 rounded-lg flex-row items-center gap-1"
              onPress={() => {
                resetZoneForm();
                setShowZoneForm(true);
              }}
              activeOpacity={0.8}
            >
              <Plus size={14} color="#1A1A2E" />
              <Text className="text-elegant-dark font-sans-bold text-xs">
                Nueva
              </Text>
            </TouchableOpacity>
          </View>

          {/* Zone form (create/edit) */}
          {showZoneForm && (
            <View className="bg-elegant-gray rounded-2xl p-4 mb-3 border border-gold-500/30">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gold-500 font-sans-semibold text-sm">
                  {editingZone ? "Editar zona" : "Nueva zona"}
                </Text>
                <TouchableOpacity onPress={resetZoneForm}>
                  <X size={18} color="#888" />
                </TouchableOpacity>
              </View>

              <Text className="text-cream-300 font-sans text-xs mb-1">
                Nombre de la zona *
              </Text>
              <TextInput
                className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
                value={zoneName}
                onChangeText={setZoneName}
                placeholder="Ej: Centro, Zona Norte"
                placeholderTextColor="#666"
                autoFocus
              />

              <Text className="text-cream-300 font-sans text-xs mb-1">
                Precio de envío ({currency})
              </Text>
              <TextInput
                className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
                value={zonePrice}
                onChangeText={setZonePrice}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#666"
              />

              {/* Zone-level free delivery */}
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-cream-300 font-sans text-xs">
                  Envío gratis en esta zona
                </Text>
                <Switch
                  value={zoneFreeEnabled}
                  onValueChange={setZoneFreeEnabled}
                  trackColor={{ false: "#444", true: "#FFC300" }}
                  thumbColor="#fff"
                />
              </View>

              {zoneFreeEnabled && (
                <>
                  <Text className="text-cream-300 font-sans text-xs mb-1">
                    Monto mínimo ({currency})
                  </Text>
                  <TextInput
                    className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
                    value={zoneFreeMinAmount}
                    onChangeText={setZoneFreeMinAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#666"
                  />
                </>
              )}

              <TouchableOpacity
                className="bg-gold-500 py-2.5 rounded-xl items-center"
                onPress={handleSaveZone}
                disabled={createZone.isPending || updateZone.isPending}
                activeOpacity={0.8}
              >
                <Text className="text-elegant-dark font-sans-bold text-sm">
                  {createZone.isPending || updateZone.isPending
                    ? "Guardando..."
                    : editingZone
                    ? "Actualizar"
                    : "Crear zona"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Zones list */}
          {zonesLoading ? (
            <ActivityIndicator size="small" color="#FFC300" />
          ) : zones && zones.length > 0 ? (
            zones.map((zone) => (
              <View
                key={zone.id}
                className="bg-elegant-gray rounded-xl p-3 mb-2 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-white font-sans-medium text-sm">
                    {zone.zone_name}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-0.5">
                    <Text className="text-gold-500 font-sans text-xs">
                      {currency} {zone.delivery_price.toFixed(2)}
                    </Text>
                    {zone.free_delivery_enabled && (
                      <View className="bg-green-500/20 px-1.5 py-0.5 rounded">
                        <Text className="text-green-400 font-sans text-[10px]">
                          Gratis desde {currency}{" "}
                          {zone.free_delivery_min_amount?.toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  className="p-2 mr-1"
                  onPress={() => startEditZone(zone)}
                >
                  <Edit3 size={15} color="#FFC300" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2"
                  onPress={() => handleDeleteZone(zone)}
                >
                  <Trash2 size={15} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="bg-elegant-gray rounded-xl p-4 items-center">
              <Text className="text-cream-400 font-sans text-sm">
                No hay zonas configuradas
              </Text>
              <Text className="text-cream-400/60 font-sans text-xs mt-1">
                Tocá "Nueva" para agregar tu primera zona
              </Text>
            </View>
          )}

          <View className="flex-row items-start gap-1.5 mt-2">
            <Info size={12} color="#888" style={{ marginTop: 2 }} />
            <Text className="text-cream-400/60 font-sans text-xs flex-1">
              Cada zona tiene su propio precio de envío. El cliente selecciona su
              zona al hacer el pedido.
            </Text>
          </View>
        </View>
      )}

      {/* ============ FREE DELIVERY (global) ============ */}
      <View className="flex-row items-center gap-2 mb-3 mt-2">
        <Gift size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-sm">
          Envío gratis global
        </Text>
      </View>

      <View className="bg-elegant-gray rounded-2xl p-4 mb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-medium text-sm">
              Habilitar envío gratis
            </Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">
              Envío sin costo cuando el pedido supera un monto mínimo
            </Text>
          </View>
          <Switch
            value={freeDeliveryEnabled}
            onValueChange={setFreeDeliveryEnabled}
            trackColor={{ false: "#444", true: "#FFC300" }}
            thumbColor="#fff"
          />
        </View>

        {freeDeliveryEnabled && (
          <View className="mt-4 pt-4 border-t border-elegant-dark">
            <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
              Monto mínimo para envío gratis ({currency})
            </Text>
            <TextInput
              className="bg-elegant-dark text-white px-4 py-2.5 rounded-xl font-sans text-sm"
              value={freeDeliveryMinAmount}
              onChangeText={setFreeDeliveryMinAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#666"
            />
          </View>
        )}
      </View>

      <View className="flex-row items-start gap-1.5 mb-6">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          {freeDeliveryEnabled
            ? `Los clientes con pedidos mayores a ${currency} ${
                freeDeliveryMinAmount || "0"
              } no pagan envío. Esta regla aplica a todas las zonas.`
            : "Cuando está deshabilitado, todos los pedidos de delivery tienen costo de envío."}
        </Text>
      </View>

      {/* Save */}
      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${
          updateStore.isPending ? "bg-gold-700" : "bg-gold-500"
        }`}
        onPress={handleSaveSettings}
        disabled={updateStore.isPending}
        activeOpacity={0.8}
      >
        {updateStore.isPending ? (
          <ActivityIndicator color="#1A1A2E" />
        ) : (
          <Text className="text-elegant-dark font-sans-bold text-base">
            Guardar
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
