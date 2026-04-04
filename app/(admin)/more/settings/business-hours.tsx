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
import { Clock, Plus, Trash2, Info, Moon, Power } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";
import { supabase } from "@/services/supabase";

interface StoreHour {
  id?: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  closes_next_day: boolean;
}

const DAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export default function BusinessHoursScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();
  const [hours, setHours] = useState<StoreHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forceStatus, setForceStatus] = useState<string>("normal");

  useEffect(() => {
    if (store?.id) loadHours();
    if (store) setForceStatus(store.force_status ?? "normal");
  }, [store?.id]);

  const loadHours = async () => {
    try {
      const { data, error } = await supabase
        .from("store_hours")
        .select("*")
        .eq("store_id", store!.id)
        .order("day_of_week", { ascending: true })
        .order("open_time", { ascending: true });

      if (error) throw error;

      const fixed = (data ?? []).map((h: any) => ({
        ...h,
        closes_next_day: h.closes_next_day || h.close_time <= h.open_time,
      }));
      setHours(fixed);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los horarios");
    } finally {
      setLoading(false);
    }
  };

  const addHour = (dayOfWeek: number) => {
    setHours([
      ...hours,
      {
        day_of_week: dayOfWeek,
        open_time: "09:00",
        close_time: "18:00",
        closes_next_day: false,
      },
    ]);
  };

  const removeHour = (index: number) => {
    setHours(hours.filter((_, i) => i !== index));
  };

  const updateHour = (
    index: number,
    field: keyof StoreHour,
    value: string | boolean
  ) => {
    const updated = [...hours];
    (updated[index] as any)[field] = value;
    setHours(updated);
  };

  const formatTimeInput = (text: string): string => {
    // Allow only digits and colon
    const clean = text.replace(/[^0-9:]/g, "");
    // Auto-add colon after 2 digits
    if (clean.length === 2 && !clean.includes(":")) {
      return clean + ":";
    }
    return clean.slice(0, 5);
  };

  const handleSave = async () => {
    if (!store?.id) return;
    setSaving(true);

    try {
      // Delete all existing hours
      const { error: deleteError } = await supabase
        .from("store_hours")
        .delete()
        .eq("store_id", store.id);

      if (deleteError) throw deleteError;

      // Insert new hours
      if (hours.length > 0) {
        const hoursToInsert = hours.map((h) => ({
          store_id: store.id,
          day_of_week: h.day_of_week,
          open_time: h.open_time,
          close_time: h.close_time,
          closes_next_day: h.closes_next_day || h.close_time <= h.open_time,
        }));

        const { error: insertError } = await supabase
          .from("store_hours")
          .insert(hoursToInsert);

        if (insertError) throw insertError;
      }

      Alert.alert("Guardado", "Horarios actualizados correctamente");
      await loadHours();
    } catch {
      Alert.alert("Error", "No se pudieron guardar los horarios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark">
        <ActivityIndicator size="large" color="#EB1C8D" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <Clock size={20} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-bold text-xl">
          Horarios de atención
        </Text>
      </View>

      {/* Force Status */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Power size={16} color="#EB1C8D" />
          <Text className="text-text-primary font-sans-semibold text-lg">
            Forzar apertura / cierre
          </Text>
        </View>

        <View className="flex-row gap-2 mb-2">
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl items-center ${
              forceStatus === "normal" ? "bg-gold-500" : "bg-elegant-dark"
            }`}
            onPress={async () => {
              setForceStatus("normal");
              await updateStore.mutateAsync({ force_status: "normal" });
            }}
            activeOpacity={0.7}
          >
            <Text
              className={`font-sans-medium text-xs ${
                forceStatus === "normal" ? "text-text-inverted" : "text-cream-400"
              }`}
            >
              Normal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl items-center ${
              forceStatus === "force_open" ? "bg-green-600" : "bg-elegant-dark"
            }`}
            onPress={async () => {
              setForceStatus("force_open");
              await updateStore.mutateAsync({ force_status: "force_open" });
            }}
            activeOpacity={0.7}
          >
            <Text
              className={`font-sans-medium text-xs ${
                forceStatus === "force_open" ? "text-text-primary" : "text-cream-400"
              }`}
            >
              Forzar abierto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl items-center ${
              forceStatus === "force_closed" ? "bg-red-600" : "bg-elegant-dark"
            }`}
            onPress={async () => {
              setForceStatus("force_closed");
              await updateStore.mutateAsync({ force_status: "force_closed" });
            }}
            activeOpacity={0.7}
          >
            <Text
              className={`font-sans-medium text-xs ${
                forceStatus === "force_closed" ? "text-text-primary" : "text-cream-400"
              }`}
            >
              Forzar cerrado
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-start gap-1.5">
          <Info size={12} color="#888" style={{ marginTop: 2 }} />
          <Text className="text-cream-400/60 font-sans text-sm flex-1">
            {forceStatus === "normal"
              ? "La tienda abre y cierra según los horarios configurados abajo."
              : forceStatus === "force_open"
              ? "La tienda aparece como ABIERTA sin importar los horarios."
              : "La tienda aparece como CERRADA sin importar los horarios."}
          </Text>
        </View>
      </View>

      <View className="flex-row items-start gap-1.5 mb-5">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-sm flex-1">
          Configurá los horarios de apertura y cierre para cada día. Podés
          agregar múltiples turnos por día (ej: mañana y noche).
        </Text>
      </View>

      {/* Days */}
      {DAYS.map((day) => {
        const dayHours = hours.filter((h) => h.day_of_week === day.value);
        const hasTurns = dayHours.length > 0;

        return (
          <View key={day.value} className="bg-elegant-gray rounded-2xl p-4 mb-3">
            {/* Day header */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-text-primary font-sans-semibold text-lg">
                {day.label}
              </Text>
              <View className="flex-row items-center gap-2">
                {!hasTurns && (
                  <Text className="text-red-400 font-sans text-sm">Cerrado</Text>
                )}
                <TouchableOpacity
                  className="bg-elegant-dark p-1.5 rounded-lg"
                  onPress={() => addHour(day.value)}
                  activeOpacity={0.7}
                >
                  <Plus size={14} color="#EB1C8D" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Time slots for this day */}
            {dayHours.map((hour) => {
              const globalIndex = hours.indexOf(hour);

              return (
                <View
                  key={globalIndex}
                  className="bg-elegant-dark rounded-xl p-3 mb-2"
                >
                  {/* Time inputs */}
                  <View className="flex-row items-center gap-2">
                    <View className="flex-1">
                      <Text className="text-cream-400 font-sans text-sm mb-1">
                        Apertura
                      </Text>
                      <TextInput
                        className="bg-elegant-gray text-text-primary px-3 py-2 rounded-lg font-sans text-sm text-center"
                        value={hour.open_time.slice(0, 5)}
                        onChangeText={(text) =>
                          updateHour(globalIndex, "open_time", formatTimeInput(text))
                        }
                        placeholder="09:00"
                        placeholderTextColor="#666"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                      />
                    </View>

                    <Text className="text-cream-400 font-sans text-sm mt-3">—</Text>

                    <View className="flex-1">
                      <Text className="text-cream-400 font-sans text-sm mb-1">
                        Cierre
                      </Text>
                      <TextInput
                        className="bg-elegant-gray text-text-primary px-3 py-2 rounded-lg font-sans text-sm text-center"
                        value={hour.close_time.slice(0, 5)}
                        onChangeText={(text) =>
                          updateHour(globalIndex, "close_time", formatTimeInput(text))
                        }
                        placeholder="18:00"
                        placeholderTextColor="#666"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                      />
                    </View>

                    <TouchableOpacity
                      className="mt-3 p-2"
                      onPress={() => removeHour(globalIndex)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Closes next day toggle */}
                  <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-elegant-gray">
                    <View className="flex-row items-center gap-1.5">
                      <Moon size={12} color="#A855F7" />
                      <Text className="text-cream-400 font-sans text-sm">
                        Cierra al día siguiente
                      </Text>
                    </View>
                    <Switch
                      value={hour.closes_next_day}
                      onValueChange={(val) =>
                        updateHour(globalIndex, "closes_next_day", val)
                      }
                      trackColor={{ false: "#444", true: "#A855F7" }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              );
            })}

            {!hasTurns && (
              <Text className="text-cream-400/40 font-sans text-sm text-center py-1">
                Tocá + para agregar un turno
              </Text>
            )}
          </View>
        );
      })}

      <View className="flex-row items-start gap-1.5 mb-4 mt-1">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-sm flex-1">
          Usá "Cierra al día siguiente" para turnos nocturnos que cruzan la
          medianoche (ej: 22:00 - 02:00).
        </Text>
      </View>

      {/* Save */}
      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${
          saving ? "bg-gold-700" : "bg-gold-500"
        }`}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-text-inverted font-sans-bold text-lg">
            Guardar horarios
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
