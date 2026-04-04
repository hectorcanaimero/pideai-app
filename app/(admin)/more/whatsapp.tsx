import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { MessageCircle, Info } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

export default function WhatsAppScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [redirectToWhatsapp, setRedirectToWhatsapp] = useState(false);

  useEffect(() => {
    if (store) {
      setWhatsappNumber(store.whatsapp_number ?? "");
      setRedirectToWhatsapp((store as any).redirect_to_whatsapp === true);
    }
  }, [store]);

  const handleSave = async () => {
    try {
      await updateStore.mutateAsync({
        whatsapp_number: whatsappNumber || null,
        redirect_to_whatsapp: redirectToWhatsapp,
      });
      Alert.alert("Guardado", "Configuración de WhatsApp actualizada");
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
        <MessageCircle size={20} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-bold text-xl">WhatsApp</Text>
      </View>

      {/* WhatsApp Number */}
      <Text className="text-cream-300 font-sans-medium text-base mb-1.5">
        Número de WhatsApp
      </Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={whatsappNumber}
        onChangeText={setWhatsappNumber}
        keyboardType="phone-pad"
        placeholder="+58 412 1234567"
        placeholderTextColor="#666"
      />

      {/* Redirect Toggle */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-text-primary font-sans-medium text-base">
              Redirigir pedidos a WhatsApp
            </Text>
            <Text className="text-cream-400 font-sans text-sm mt-0.5">
              Los clientes enviarán su pedido por WhatsApp
            </Text>
          </View>
          <Switch
            value={redirectToWhatsapp}
            onValueChange={setRedirectToWhatsapp}
            trackColor={{ false: "#444", true: "#EB1C8D" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Info Note */}
      <View className="flex-row items-center bg-elegant-gray/50 rounded-xl p-3 mb-6">
        <Info size={16} color="#EB1C8D" />
        <Text className="text-cream-400 font-sans text-sm ml-2 flex-1">
          Configurá templates y campañas desde el panel web
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        className="bg-gold-500 py-4 rounded-xl items-center"
        onPress={handleSave}
        activeOpacity={0.8}
        disabled={updateStore.isPending}
      >
        <Text className="text-text-inverted font-sans-bold text-lg">
          {updateStore.isPending ? "Guardando..." : "Guardar cambios"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
