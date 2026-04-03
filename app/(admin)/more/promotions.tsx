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
import { Tag, Calendar, Percent, Info } from "lucide-react-native";

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  type: string;
  value: number;
  is_active: boolean | null;
  start_date: string | null;
  end_date: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatType(type: string): string {
  switch (type) {
    case "percentage":
      return "Porcentaje";
    case "fixed":
      return "Monto fijo";
    case "buy_x_get_y":
      return "Llevá X pagá Y";
    default:
      return type;
  }
}

function formatValue(type: string, value: number): string {
  if (type === "percentage") return `${value}%`;
  return `$${value.toFixed(2)}`;
}

export default function PromotionsScreen() {
  const { store } = useStore();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["promotions", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("id, name, description, type, value, is_active, start_date, end_date")
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Promotion[];
    },
    enabled: !!store?.id,
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("promotions")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["promotions"] }),
  });

  const renderItem = useCallback(
    ({ item }: { item: Promotion }) => (
      <View className="bg-elegant-gray rounded-xl p-4 mb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-bold text-base">
              {item.name}
            </Text>
            {item.description ? (
              <Text className="text-cream-400 font-sans text-sm mt-1">
                {item.description}
              </Text>
            ) : null}
          </View>
          <Switch
            value={item.is_active ?? false}
            onValueChange={(val) =>
              toggleActive.mutate({ id: item.id, is_active: val })
            }
            trackColor={{ false: "#333", true: "#FFC300" }}
            thumbColor="#fff"
          />
        </View>

        <View className="flex-row items-center mt-3 flex-wrap gap-y-2">
          <View className="flex-row items-center mr-4">
            <Percent size={14} color="#FFC300" />
            <Text className="text-cream-400 font-sans text-xs ml-1">
              {formatType(item.type)} · {formatValue(item.type, item.value)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Calendar size={14} color="#FFC300" />
            <Text className="text-cream-400 font-sans text-xs ml-1">
              {formatDate(item.start_date)} → {formatDate(item.end_date)}
            </Text>
          </View>
        </View>
      </View>
    ),
    [toggleActive]
  );

  return (
    <View className="flex-1 bg-elegant-dark">
      {/* Count */}
      <View className="px-4 pt-3 pb-2">
        <Text className="text-cream-400 font-sans text-xs">
          {data?.length ?? 0} promociones
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFC300" />
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
              tintColor="#FFC300"
              colors={["#FFC300"]}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Tag size={48} color="#444" />
              <Text className="text-cream-400 font-sans text-base mt-4">
                No hay promociones
              </Text>
            </View>
          }
          ListFooterComponent={
            <View className="flex-row items-center bg-elegant-gray/50 rounded-xl p-3 mt-2">
              <Info size={16} color="#FFC300" />
              <Text className="text-cream-400 font-sans text-xs ml-2 flex-1">
                Creá y editá promociones desde el panel web
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
