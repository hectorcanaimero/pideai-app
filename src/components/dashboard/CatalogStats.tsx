import { View, Text } from "react-native";
import { Eye, Users, TrendingUp } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/contexts/StoreContext";
import { getCatalogViewsByStore } from "@/lib/posthogApi";

export function CatalogStats() {
  const { store } = useStore();

  const { data } = useQuery({
    queryKey: ["catalog-views", store?.id],
    queryFn: () => getCatalogViewsByStore(store!.id, 30),
    enabled: !!store?.id,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <View className="mb-4">
      <Text className="text-text-primary font-sans-semibold text-base mb-3">Analytics del catálogo</Text>

      <View className="flex-row gap-2">
        <View className="flex-1 bg-blue-500/10 rounded-2xl p-3 border border-blue-500/20">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Eye size={14} color="#3B82F6" />
            <Text className="text-blue-400 font-sans text-[10px]">Vistas</Text>
          </View>
          <Text className="text-text-primary font-sans-bold text-xl">{data?.totalViews ?? 0}</Text>
          <Text className="text-blue-300/60 font-sans text-[10px]">Últimos 30 días</Text>
        </View>

        <View className="flex-1 bg-green-500/10 rounded-2xl p-3 border border-green-500/20">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Users size={14} color="#22C55E" />
            <Text className="text-green-400 font-sans text-[10px]">Visitantes</Text>
          </View>
          <Text className="text-text-primary font-sans-bold text-xl">{data?.uniqueVisitors ?? 0}</Text>
          <Text className="text-green-300/60 font-sans text-[10px]">Personas únicas</Text>
        </View>

        <View className="flex-1 bg-purple-500/10 rounded-2xl p-3 border border-purple-500/20">
          <View className="flex-row items-center gap-1.5 mb-1">
            <TrendingUp size={14} color="#A855F7" />
            <Text className="text-purple-400 font-sans text-[10px]">Por visitante</Text>
          </View>
          <Text className="text-text-primary font-sans-bold text-xl">{data?.viewsPerVisitor ?? 0}</Text>
          <Text className="text-purple-300/60 font-sans text-[10px]">Promedio</Text>
        </View>
      </View>
    </View>
  );
}
