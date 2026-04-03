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
import { Ticket, Percent, DollarSign, Info } from "lucide-react-native";

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: string;
  value: number;
  is_active: boolean | null;
  usage_count: number | null;
  usage_limit: number | null;
  minimum_order_amount: number | null;
  maximum_discount: number | null;
  start_date: string | null;
  end_date: string | null;
}

function formatValue(type: string, value: number): string {
  if (type === "percentage") return `${value}%`;
  return `$${value.toFixed(2)}`;
}

function formatType(type: string): string {
  switch (type) {
    case "percentage":
      return "Porcentaje";
    case "fixed":
      return "Monto fijo";
    default:
      return type;
  }
}

export default function CouponsScreen() {
  const { store } = useStore();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["coupons", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select(
          "id, code, name, description, type, value, is_active, usage_count, usage_limit, minimum_order_amount, maximum_discount, start_date, end_date"
        )
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Coupon[];
    },
    enabled: !!store?.id,
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const renderItem = useCallback(
    ({ item }: { item: Coupon }) => {
      const usageCount = item.usage_count ?? 0;
      const usageLimit = item.usage_limit;
      const usageText = usageLimit
        ? `${usageCount}/${usageLimit} usos`
        : `${usageCount} usos`;
      const usageProgress = usageLimit
        ? Math.min(usageCount / usageLimit, 1)
        : 0;

      return (
        <View className="bg-elegant-gray rounded-xl p-4 mb-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-gold font-sans-bold text-lg tracking-wider">
                {item.code}
              </Text>
              <Text className="text-white font-sans text-sm mt-1">
                {item.name}
              </Text>
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
              {item.type === "percentage" ? (
                <Percent size={14} color="#FFC300" />
              ) : (
                <DollarSign size={14} color="#FFC300" />
              )}
              <Text className="text-cream-400 font-sans text-xs ml-1">
                {formatType(item.type)} · {formatValue(item.type, item.value)}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ticket size={14} color="#FFC300" />
              <Text className="text-cream-400 font-sans text-xs ml-1">
                {usageText}
              </Text>
            </View>
          </View>

          {/* Usage progress bar */}
          {usageLimit ? (
            <View className="mt-3">
              <View className="h-1.5 bg-elegant-dark rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${usageProgress * 100}%`,
                    backgroundColor:
                      usageProgress >= 0.9 ? "#EF4444" : "#FFC300",
                  }}
                />
              </View>
            </View>
          ) : null}
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
          {data?.length ?? 0} cupones
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
              <Ticket size={48} color="#444" />
              <Text className="text-cream-400 font-sans text-base mt-4">
                No hay cupones
              </Text>
            </View>
          }
          ListFooterComponent={
            <View className="flex-row items-center bg-elegant-gray/50 rounded-xl p-3 mt-2">
              <Info size={16} color="#FFC300" />
              <Text className="text-cream-400 font-sans text-xs ml-2 flex-1">
                Creá y editá cupones desde el panel web
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
