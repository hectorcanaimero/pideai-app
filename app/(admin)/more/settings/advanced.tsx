import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator,
} from "react-native";
import { Settings } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

export default function AdvancedSettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [enableAudioNotifications, setEnableAudioNotifications] = useState(true);
  const [notificationVolume, setNotificationVolume] = useState("");
  const [notificationRepeatCount, setNotificationRepeatCount] = useState("");

  useEffect(() => {
    if (store) {
      setEnableAudioNotifications((store as any).enable_audio_notifications !== false);
      setNotificationVolume(String((store as any).notification_volume ?? ""));
      setNotificationRepeatCount(String((store as any).notification_repeat_count ?? ""));
    }
  }, [store]);

  const handleSave = async () => {
    try {
      await updateStore.mutateAsync({
        enable_audio_notifications: enableAudioNotifications,
        notification_volume: parseInt(notificationVolume) || null,
        notification_repeat_count: parseInt(notificationRepeatCount) || null,
      });
      Alert.alert("Guardado", "Configuración avanzada actualizada");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="flex-row items-center gap-2 mb-6">
        <Settings size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Avanzado</Text>
      </View>

      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-medium text-sm">Notificaciones de audio</Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">Sonido al recibir pedidos</Text>
          </View>
          <Switch value={enableAudioNotifications} onValueChange={setEnableAudioNotifications} trackColor={{ false: "#444", true: "#FFC300" }} thumbColor="#fff" />
        </View>
      </View>

      {enableAudioNotifications && (
        <>
          <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Volumen (1-100)</Text>
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
            value={notificationVolume}
            onChangeText={setNotificationVolume}
            keyboardType="number-pad"
            placeholder="80"
            placeholderTextColor="#666"
            maxLength={3}
          />

          <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Repeticiones de notificación</Text>
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
            value={notificationRepeatCount}
            onChangeText={setNotificationRepeatCount}
            keyboardType="number-pad"
            placeholder="3"
            placeholderTextColor="#666"
            maxLength={2}
          />
        </>
      )}

      <View className="mb-6" />

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
