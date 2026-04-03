import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";
import { Palette } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

export default function DesignSettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [primaryColor, setPrimaryColor] = useState("");
  const [deliveryLabel, setDeliveryLabel] = useState("");
  const [pickupLabel, setPickupLabel] = useState("");
  const [digitalMenuLabel, setDigitalMenuLabel] = useState("");

  useEffect(() => {
    if (store) {
      setPrimaryColor((store as any).primary_color ?? "");
      setDeliveryLabel((store as any).delivery_label ?? "");
      setPickupLabel((store as any).pickup_label ?? "");
      setDigitalMenuLabel((store as any).digital_menu_label ?? "");
    }
  }, [store]);

  const handleSave = async () => {
    try {
      await updateStore.mutateAsync({
        primary_color: primaryColor || null,
        delivery_label: deliveryLabel || null,
        pickup_label: pickupLabel || null,
        digital_menu_label: digitalMenuLabel || null,
      });
      Alert.alert("Guardado", "Configuración de diseño actualizada");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="flex-row items-center gap-2 mb-6">
        <Palette size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Diseño</Text>
      </View>

      <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
        <Text className="text-cream-400 font-sans text-xs mb-1">Tienda</Text>
        <Text className="text-white font-sans-medium text-sm">{(store as any)?.name ?? "—"}</Text>
      </View>

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Color primario (hex)</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={primaryColor}
        onChangeText={setPrimaryColor}
        placeholder="#FFC300"
        placeholderTextColor="#666"
        autoCapitalize="characters"
        maxLength={7}
      />

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Etiqueta Delivery</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={deliveryLabel}
        onChangeText={setDeliveryLabel}
        placeholder="Delivery"
        placeholderTextColor="#666"
      />

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Etiqueta Pickup</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={pickupLabel}
        onChangeText={setPickupLabel}
        placeholder="Pickup"
        placeholderTextColor="#666"
      />

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Etiqueta Menu Digital</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={digitalMenuLabel}
        onChangeText={setDigitalMenuLabel}
        placeholder="Menu Digital"
        placeholderTextColor="#666"
      />

      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <Text className="text-cream-400 font-sans text-xs">
          Cambia logo y banner desde el panel web.
        </Text>
      </View>

      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${updateStore.isPending ? "bg-gold-700" : "bg-gold-500"}`}
        onPress={handleSave}
        disabled={updateStore.isPending}
        activeOpacity={0.8}
      >
        {updateStore.isPending ? <ActivityIndicator color="#1A1A2E" /> : <Text className="text-elegant-dark font-sans-bold text-base">Guardar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
