import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Sparkles, ExternalLink, Zap } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

export default function AIStudioScreen() {
  const { store } = useStore();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription-ai", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, subscription_plans(*)")
        .eq("store_id", store!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id,
  });

  const plan = subscription?.subscription_plans as any;
  const limits = plan?.limits as Record<string, any> | null;
  const aiCredits = limits?.ai_monthly_credits ?? null;

  const handleOpenWeb = () => {
    const url = `https://${store?.subdomain}.pideai.com/admin/ai-studio`;
    Linking.openURL(url);
  };

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="items-center py-8">
        <View className="w-20 h-20 rounded-full bg-gold-500/20 items-center justify-center mb-4">
          <Sparkles size={40} color="#FFC300" />
        </View>
        <Text className="text-white font-sans-bold text-2xl">AI Studio</Text>
        <Text className="text-cream-400 font-sans text-sm text-center mt-2 px-4">
          Mejorá las fotos de tus productos con inteligencia artificial.
          Fondos profesionales, iluminación y más.
        </Text>
      </View>

      {/* AI Credits Card */}
      {isLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color="#FFC300" />
        </View>
      ) : aiCredits !== null ? (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Zap size={18} color="#FFC300" />
            <Text className="text-white font-sans-bold text-base">
              Créditos AI
            </Text>
          </View>
          <Text className="text-cream-400 font-sans text-sm">
            Tu plan <Text className="text-gold-500 font-sans-medium">{plan?.name}</Text> incluye{" "}
            <Text className="text-white font-sans-medium">{aiCredits}</Text> créditos
            mensuales de AI.
          </Text>
        </View>
      ) : (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Zap size={18} color="#666" />
            <Text className="text-cream-400 font-sans-bold text-base">
              Sin créditos AI
            </Text>
          </View>
          <Text className="text-cream-400 font-sans text-sm">
            Tu plan actual no incluye créditos de AI. Mejorá tu suscripción
            para acceder a esta funcionalidad.
          </Text>
        </View>
      )}

      {/* Features */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <Text className="text-white font-sans-bold text-base mb-3">
          Funcionalidades
        </Text>
        {[
          "Eliminación de fondo automática",
          "Fondos profesionales para productos",
          "Mejora de iluminación y color",
          "Generación de imágenes con AI",
        ].map((feature, i) => (
          <View key={i} className="flex-row items-center mb-2.5 last:mb-0">
            <View className="w-1.5 h-1.5 rounded-full bg-gold-500 mr-3" />
            <Text className="text-cream-300 font-sans text-sm">{feature}</Text>
          </View>
        ))}
      </View>

      {/* Open Web Button */}
      <TouchableOpacity
        className="bg-gold-500 py-4 rounded-xl flex-row items-center justify-center gap-2"
        onPress={handleOpenWeb}
        activeOpacity={0.8}
      >
        <ExternalLink size={18} color="#1A1A2E" />
        <Text className="text-elegant-dark font-sans-bold text-base">
          Abrir AI Studio en la web
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
