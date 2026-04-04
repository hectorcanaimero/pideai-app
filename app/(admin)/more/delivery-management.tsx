import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";
import { Truck, Phone, Bike, Car, Info } from "lucide-react-native";

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle_type: string | null;
  status: string | null;
  is_active: boolean | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  available: { label: "Disponible", bg: "bg-green-900/40", text: "text-green-400" },
  busy: { label: "Ocupado", bg: "bg-yellow-900/40", text: "text-yellow-400" },
  offline: { label: "Desconectado", bg: "bg-neutral-800", text: "text-cream-400" },
};

function VehicleIcon({ type }: { type: string | null }) {
  switch (type) {
    case "motorcycle":
      return <Bike size={14} color="#EB1C8D" />;
    case "car":
      return <Car size={14} color="#EB1C8D" />;
    default:
      return <Truck size={14} color="#EB1C8D" />;
  }
}

export default function DeliveryManagementScreen() {
  const { store } = useStore();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["drivers", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("id, name, phone, vehicle_type, status, is_active")
        .eq("store_id", store!.id)
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Driver[];
    },
    enabled: !!store?.id,
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("drivers")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["drivers"] }),
  });

  const renderItem = useCallback(
    ({ item }: { item: Driver }) => {
      const statusCfg = STATUS_CONFIG[item.status ?? "offline"] ?? STATUS_CONFIG.offline;
      const initial = item.name.charAt(0).toUpperCase();

      return (
        <View className="bg-elegant-gray rounded-xl p-4 mb-3">
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="w-11 h-11 rounded-full bg-gold-500/20 items-center justify-center mr-3">
              <Text className="text-gold-500 font-sans-bold text-lg">
                {initial}
              </Text>
            </View>

            {/* Info */}
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-sans-bold text-base">
                {item.name}
              </Text>
              <View className="flex-row items-center mt-1 gap-3">
                <View className="flex-row items-center">
                  <Phone size={12} color="#999" />
                  <Text className="text-cream-400 font-sans text-xs ml-1">
                    {item.phone}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <VehicleIcon type={item.vehicle_type} />
                  <Text className="text-cream-400 font-sans text-xs ml-1 capitalize">
                    {item.vehicle_type ?? "—"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Status + Toggle */}
            <View className="items-end">
              <View className={`px-2.5 py-1 rounded-full mb-2 ${statusCfg.bg}`}>
                <Text className={`font-sans-medium text-xs ${statusCfg.text}`}>
                  {statusCfg.label}
                </Text>
              </View>
              <Switch
                value={item.is_active ?? false}
                onValueChange={(val) =>
                  toggleActive.mutate({ id: item.id, is_active: val })
                }
                trackColor={{ false: "#333", true: "#EB1C8D" }}
                thumbColor="#fff"
                style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
              />
            </View>
          </View>
        </View>
      );
    },
    [toggleActive]
  );

  return (
    <View className="flex-1 bg-elegant-dark">
      {/* Count */}
      <View className="px-4 pt-3 pb-2">
        <Text className="text-cream-400 font-sans text-xs">
          {data?.length ?? 0} motoristas
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EB1C8D" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#EB1C8D"
              colors={["#EB1C8D"]}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Truck size={48} color="#444" />
              <Text className="text-cream-400 font-sans text-base mt-4">
                No hay motoristas
              </Text>
            </View>
          }
          ListFooterComponent={
            <View className="flex-row items-center bg-elegant-gray/50 rounded-xl p-3 mt-2">
              <Info size={16} color="#EB1C8D" />
              <Text className="text-cream-400 font-sans text-xs ml-2 flex-1">
                Agregá y editá motoristas desde el panel web
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
