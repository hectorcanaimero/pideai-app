import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";
import { Truck } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

export default function DeliverySettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");

  useEffect(() => {
    if (store) {
      setEstimatedDeliveryTime(String((store as any).estimated_delivery_time ?? ""));
    }
  }, [store]);

  const handleSave = async () => {
    try {
      await updateStore.mutateAsync({
        estimated_delivery_time: parseInt(estimatedDeliveryTime) || null,
      });
      Alert.alert("Guardado", "Configuración de delivery actualizada");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="flex-row items-center gap-2 mb-6">
        <Truck size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Delivery</Text>
      </View>

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Tiempo estimado de entrega (minutos)</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={estimatedDeliveryTime}
        onChangeText={setEstimatedDeliveryTime}
        keyboardType="number-pad"
        placeholder="30"
        placeholderTextColor="#666"
      />

      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <Text className="text-cream-400 font-sans text-xs">
          Configura zonas de delivery desde el panel web para definir precios por zona.
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
