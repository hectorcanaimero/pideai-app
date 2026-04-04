import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Settings, Volume2, Bell, Info, Play } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";
import { playNotificationSound } from "@/lib/notificationSound";

export default function AdvancedSettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [enableAudio, setEnableAudio] = useState(true);
  const [volume, setVolume] = useState("80");
  const [repeatCount, setRepeatCount] = useState("3");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (store) {
      const s = store as any;
      setEnableAudio(s.enable_audio_notifications !== false);
      setVolume(String(s.notification_volume ?? 80));
      setRepeatCount(String(s.notification_repeat_count ?? 3));
    }
  }, [store]);

  const handleTestSound = async () => {
    setTesting(true);
    try {
      await playNotificationSound(
        parseInt(volume) || 80,
        parseInt(repeatCount) || 3
      );
    } catch {
      Alert.alert("Error", "No se pudo reproducir el sonido");
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    const vol = parseInt(volume);
    const rep = parseInt(repeatCount);

    if (enableAudio && (vol < 1 || vol > 100)) {
      Alert.alert("Error", "El volumen debe estar entre 1 y 100");
      return;
    }
    if (enableAudio && (rep < 1 || rep > 10)) {
      Alert.alert("Error", "Las repeticiones deben estar entre 1 y 10");
      return;
    }

    try {
      await updateStore.mutateAsync({
        enable_audio_notifications: enableAudio,
        notification_volume: vol || 80,
        notification_repeat_count: rep || 3,
      });
      Alert.alert("Guardado", "Configuracion actualizada");
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
        <Settings size={20} color="#EB1C8D" />
        <Text className="text-white font-sans-bold text-lg">Avanzado</Text>
      </View>

      {/* Audio Notifications Section */}
      <View className="flex-row items-center gap-2 mb-3">
        <Bell size={16} color="#EB1C8D" />
        <Text className="text-white font-sans-semibold text-sm">
          Alerta sonora de pedidos
        </Text>
      </View>

      <View className="flex-row items-start gap-1.5 mb-3">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Cuando llega un nuevo pedido y la app esta abierta, se reproduce un sonido de alerta para que no se te pase ningun pedido. Funciona incluso en modo silencio (iOS).
        </Text>
      </View>

      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-medium text-sm">
              Habilitar sonido
            </Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">
              Sonido al recibir un nuevo pedido
            </Text>
          </View>
          <Switch
            value={enableAudio}
            onValueChange={setEnableAudio}
            trackColor={{ false: "#444", true: "#EB1C8D" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {enableAudio && (
        <>
          {/* Volume */}
          <View className="flex-row items-center gap-2 mb-1.5">
            <Volume2 size={14} color="#EB1C8D" />
            <Text className="text-cream-300 font-sans-medium text-sm">
              Volumen (1 - 100)
            </Text>
          </View>
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-2"
            value={volume}
            onChangeText={setVolume}
            keyboardType="number-pad"
            placeholder="80"
            placeholderTextColor="#666"
            maxLength={3}
          />
          <View className="flex-row items-start gap-1.5 mb-4">
            <Info size={12} color="#888" style={{ marginTop: 2 }} />
            <Text className="text-cream-400/60 font-sans text-xs flex-1">
              Intensidad del sonido de alerta. 100 es el maximo.
            </Text>
          </View>

          {/* Repeat Count */}
          <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
            Repeticiones (1 - 10)
          </Text>
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-2"
            value={repeatCount}
            onChangeText={setRepeatCount}
            keyboardType="number-pad"
            placeholder="3"
            placeholderTextColor="#666"
            maxLength={2}
          />
          <View className="flex-row items-start gap-1.5 mb-4">
            <Info size={12} color="#888" style={{ marginTop: 2 }} />
            <Text className="text-cream-400/60 font-sans text-xs flex-1">
              Cuantas veces se repite el sonido por cada pedido nuevo. Mas repeticiones = mas dificil de ignorar.
            </Text>
          </View>

          {/* Test Sound Button */}
          <TouchableOpacity
            className="bg-elegant-gray py-3 rounded-xl flex-row items-center justify-center gap-2 mb-6 border border-gold-500/30"
            onPress={handleTestSound}
            disabled={testing}
            activeOpacity={0.7}
          >
            {testing ? (
              <ActivityIndicator size="small" color="#EB1C8D" />
            ) : (
              <Play size={16} color="#EB1C8D" />
            )}
            <Text className="text-gold-500 font-sans-medium text-sm">
              {testing ? "Reproduciendo..." : "Probar sonido"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Save */}
      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${
          updateStore.isPending ? "bg-gold-700" : "bg-gold-500"
        }`}
        onPress={handleSave}
        disabled={updateStore.isPending}
        activeOpacity={0.8}
      >
        {updateStore.isPending ? (
          <ActivityIndicator color="#1A1A1A" />
        ) : (
          <Text className="text-elegant-dark font-sans-bold text-base">
            Guardar
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
