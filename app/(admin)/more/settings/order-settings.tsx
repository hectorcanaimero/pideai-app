import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator,
} from "react-native";
import { ClipboardList } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

export default function OrderSettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [minimumOrderPrice, setMinimumOrderPrice] = useState("");
  const [redirectToWhatsapp, setRedirectToWhatsapp] = useState(false);

  useEffect(() => {
    if (store) {
      setMinimumOrderPrice(String((store as any).minimum_order_price ?? ""));
      setRedirectToWhatsapp((store as any).redirect_to_whatsapp === true);
    }
  }, [store]);

  const handleSave = async () => {
    try {
      await updateStore.mutateAsync({
        minimum_order_price: parseFloat(minimumOrderPrice) || 0,
        redirect_to_whatsapp: redirectToWhatsapp,
      });
      Alert.alert("Guardado", "Configuración de pedidos actualizada");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="flex-row items-center gap-2 mb-6">
        <ClipboardList size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Pedidos</Text>
      </View>

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Monto mínimo de pedido</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={minimumOrderPrice}
        onChangeText={setMinimumOrderPrice}
        keyboardType="decimal-pad"
        placeholder="0.00"
        placeholderTextColor="#666"
      />

      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-medium text-sm">Redirigir a WhatsApp</Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">Enviar pedido por WhatsApp</Text>
          </View>
          <Switch value={redirectToWhatsapp} onValueChange={setRedirectToWhatsapp} trackColor={{ false: "#444", true: "#FFC300" }} thumbColor="#fff" />
        </View>
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
