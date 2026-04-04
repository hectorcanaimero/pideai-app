import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator,
} from "react-native";
import { CreditCard } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

export default function PaymentSettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [currency, setCurrency] = useState("USD");
  const [acceptCash, setAcceptCash] = useState(true);
  const [requireProof, setRequireProof] = useState(false);

  useEffect(() => {
    if (store) {
      setCurrency((store as any).currency ?? "USD");
      setAcceptCash((store as any).accept_cash !== false);
      setRequireProof((store as any).require_payment_proof === true);
    }
  }, [store]);

  const handleSave = async () => {
    try {
      await updateStore.mutateAsync({
        currency,
        accept_cash: acceptCash,
        require_payment_proof: requireProof,
      });
      Alert.alert("Guardado", "Configuración de pago actualizada");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="flex-row items-center gap-2 mb-6">
        <CreditCard size={20} color="#EB1C8D" />
        <Text className="text-white font-sans-bold text-lg">Pagos</Text>
      </View>

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Moneda</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={currency}
        onChangeText={setCurrency}
        autoCapitalize="characters"
        maxLength={3}
      />

      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-sans-medium text-sm">Aceptar efectivo</Text>
          <Switch value={acceptCash} onValueChange={setAcceptCash} trackColor={{ false: "#444", true: "#EB1C8D" }} thumbColor="#fff" />
        </View>
      </View>

      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-medium text-sm">Requerir comprobante de pago</Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">El cliente debe subir comprobante</Text>
          </View>
          <Switch value={requireProof} onValueChange={setRequireProof} trackColor={{ false: "#444", true: "#EB1C8D" }} thumbColor="#fff" />
        </View>
      </View>

      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${updateStore.isPending ? "bg-gold-700" : "bg-gold-500"}`}
        onPress={handleSave}
        disabled={updateStore.isPending}
        activeOpacity={0.8}
      >
        {updateStore.isPending ? <ActivityIndicator color="#1A1A1A" /> : <Text className="text-elegant-dark font-sans-bold text-base">Guardar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
