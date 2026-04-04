import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator,
} from "react-native";
import { DollarSign } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

export default function CurrencySettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [enableConversion, setEnableConversion] = useState(false);
  const [useManualRate, setUseManualRate] = useState(false);
  const [manualRate, setManualRate] = useState("");
  const [hideOriginalPrice, setHideOriginalPrice] = useState(false);

  useEffect(() => {
    if (store) {
      setEnableConversion((store as any).enable_currency_conversion === true);
      setUseManualRate((store as any).use_manual_exchange_rate === true);
      setManualRate(String((store as any).manual_usd_ves_rate ?? ""));
      setHideOriginalPrice(store.hide_original_price === true);
    }
  }, [store]);

  const handleSave = async () => {
    try {
      await updateStore.mutateAsync({
        enable_currency_conversion: enableConversion,
        use_manual_exchange_rate: useManualRate,
        manual_usd_ves_rate: useManualRate ? parseFloat(manualRate) || 0 : null,
        hide_original_price: hideOriginalPrice,
      });
      Alert.alert("Guardado", "Configuración de conversión actualizada");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="flex-row items-center gap-2 mb-6">
        <DollarSign size={20} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-bold text-lg">Conversión de moneda</Text>
      </View>

      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-text-primary font-sans-medium text-sm">Habilitar conversión</Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">Mostrar precios en bolívares (VES)</Text>
          </View>
          <Switch value={enableConversion} onValueChange={setEnableConversion} trackColor={{ false: "#444", true: "#EB1C8D" }} thumbColor="#fff" />
        </View>
      </View>

      {enableConversion && (
        <>
          <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text-primary font-sans-medium text-sm">Usar tasa manual</Text>
              <Switch value={useManualRate} onValueChange={setUseManualRate} trackColor={{ false: "#444", true: "#EB1C8D" }} thumbColor="#fff" />
            </View>
            {useManualRate && (
              <View>
                <Text className="text-cream-300 font-sans text-xs mb-1">Tasa USD → VES</Text>
                <TextInput
                  className="bg-elegant-dark text-text-primary px-4 py-2.5 rounded-xl font-sans text-sm"
                  value={manualRate}
                  onChangeText={setManualRate}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#666"
                />
              </View>
            )}
          </View>

          <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-text-primary font-sans-medium text-sm">Ocultar precio original</Text>
                <Text className="text-cream-400 font-sans text-xs mt-0.5">Mostrar solo VES</Text>
              </View>
              <Switch value={hideOriginalPrice} onValueChange={setHideOriginalPrice} trackColor={{ false: "#444", true: "#EB1C8D" }} thumbColor="#fff" />
            </View>
          </View>
        </>
      )}

      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${updateStore.isPending ? "bg-gold-700" : "bg-gold-500"}`}
        onPress={handleSave}
        disabled={updateStore.isPending}
        activeOpacity={0.8}
      >
        {updateStore.isPending ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-text-inverted font-sans-bold text-base">Guardar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
