import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Clock } from "lucide-react-native";
import { useStoreHours, getDayName } from "@/hooks/useStoreSettings";

export default function BusinessHoursScreen() {
  const { data: hours, isLoading } = useStoreHours();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark">
        <ActivityIndicator size="large" color="#FFC300" />
      </View>
    );
  }

  // Group hours by day
  const dayGroups = new Map<number, typeof hours>();
  for (const h of hours ?? []) {
    const existing = dayGroups.get(h.day_of_week) ?? [];
    existing.push(h);
    dayGroups.set(h.day_of_week, existing);
  }

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="flex-row items-center gap-2 mb-4">
        <Clock size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Horarios de atención</Text>
      </View>

      <Text className="text-cream-400 font-sans text-xs mb-4">
        Para editar horarios, usá el panel web. Acá podés ver los horarios configurados.
      </Text>

      {[1, 2, 3, 4, 5, 6, 0].map((day) => {
        const dayHours = dayGroups.get(day) ?? [];
        const isClosed = dayHours.length === 0;

        return (
          <View key={day} className="bg-elegant-gray rounded-xl p-4 mb-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-sans-medium text-sm">{getDayName(day)}</Text>
              {isClosed ? (
                <Text className="text-red-400 font-sans text-xs">Cerrado</Text>
              ) : (
                <View>
                  {dayHours.map((h) => (
                    <Text key={h.id} className="text-gold-500 font-sans text-xs text-right">
                      {h.open_time.slice(0, 5)} - {h.close_time.slice(0, 5)}
                      {h.closes_next_day ? " (+1)" : ""}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
