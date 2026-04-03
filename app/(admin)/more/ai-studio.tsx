import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import {
  Sparkles,
  Zap,
  ImagePlus,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";
import { pickImage, uploadProductImage } from "@/lib/imageUpload";

export default function AIStudioScreen() {
  const { store } = useStore();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // Fetch AI credits for this store
  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ["ai-credits", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_ai_credits")
        .select("*")
        .eq("store_id", store!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id,
  });

  // Fetch recent AI enhancements
  const { data: enhancements, isLoading: enhancementsLoading } = useQuery({
    queryKey: ["ai-enhancements", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_enhancement_history")
        .select("*")
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id,
  });

  const totalCredits = (credits?.monthly_credits ?? 0) + (credits?.extra_credits ?? 0);
  const usedCredits = credits?.credits_used_this_month ?? 0;
  const remainingCredits = totalCredits - usedCredits;

  const handleEnhanceImage = async () => {
    if (!store?.id) return;

    if (credits && remainingCredits <= 0) {
      Alert.alert(
        "Sin créditos",
        "No tenés créditos disponibles. Mejorá tu plan para obtener más créditos de AI."
      );
      return;
    }

    const uri = await pickImage();
    if (!uri) return;

    setUploading(true);
    try {
      const publicUrl = await uploadProductImage(uri, store.id);
      if (!publicUrl) {
        Alert.alert("Error", "No se pudo subir la imagen. Intentá de nuevo.");
        return;
      }

      // Insert enhancement record as pending
      const { error } = await supabase.from("ai_enhancement_history").insert({
        store_id: store.id,
        original_image_url: publicUrl,
        enhanced_image_url: publicUrl, // Will be replaced when processing completes
        style: "enhance",
        credit_type: "monthly",
      });

      if (error) {
        console.error("Error creating enhancement record:", error);
        Alert.alert("Error", "No se pudo crear el registro de mejora.");
        return;
      }

      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["ai-enhancements", store.id] });
      queryClient.invalidateQueries({ queryKey: ["ai-credits", store.id] });

      Alert.alert(
        "Imagen enviada",
        "La mejora se procesará en unos minutos. Podés ver el estado en esta pantalla."
      );
    } catch (err) {
      console.error("Enhancement flow failed:", err);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEnhanced = (item: any) =>
    item.enhanced_image_url && item.enhanced_image_url !== item.original_image_url;

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="items-center py-6">
        <View className="w-20 h-20 rounded-full bg-gold-500/20 items-center justify-center mb-4">
          <Sparkles size={40} color="#FFC300" />
        </View>
        <Text className="text-white font-sans-bold text-2xl">AI Studio</Text>
        <Text className="text-cream-400 font-sans text-sm text-center mt-2 px-4">
          Mejorá las fotos de tus productos con inteligencia artificial. Cada
          mejora consume 1 crédito de tu plan.
        </Text>
      </View>

      {/* Credits Card */}
      {creditsLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color="#FFC300" />
        </View>
      ) : credits ? (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Zap size={18} color="#FFC300" />
            <Text className="text-white font-sans-bold text-base">
              Créditos AI
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-cream-400 font-sans text-sm">Disponibles</Text>
            <Text className="text-white font-sans-bold text-lg">
              {remainingCredits}
              <Text className="text-cream-400 font-sans text-sm">
                {" "}/ {totalCredits}
              </Text>
            </Text>
          </View>
          {/* Progress bar */}
          <View className="h-2 bg-elegant-dark rounded-full overflow-hidden">
            <View
              className="h-full bg-gold-500 rounded-full"
              style={{
                width: `${totalCredits > 0 ? (remainingCredits / totalCredits) * 100 : 0}%`,
              }}
            />
          </View>
          <Text className="text-cream-500 font-sans text-xs mt-2">
            {usedCredits} crédito{usedCredits !== 1 ? "s" : ""} usado
            {usedCredits !== 1 ? "s" : ""} este mes
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
            Tu plan actual no incluye créditos de AI. Mejorá tu suscripción para
            acceder a esta funcionalidad.
          </Text>
        </View>
      )}

      {/* Enhance Button */}
      <TouchableOpacity
        className={`py-4 rounded-xl flex-row items-center justify-center gap-2 mb-6 ${
          uploading ? "bg-gold-500/50" : "bg-gold-500"
        }`}
        onPress={handleEnhanceImage}
        activeOpacity={0.8}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color="#1A1A2E" />
        ) : (
          <ImagePlus size={20} color="#1A1A2E" />
        )}
        <Text className="text-elegant-dark font-sans-bold text-base">
          {uploading ? "Subiendo imagen..." : "Mejorar foto"}
        </Text>
      </TouchableOpacity>

      {/* Recent Enhancements */}
      <View className="mb-4">
        <Text className="text-white font-sans-bold text-base mb-3">
          Mejoras recientes
        </Text>

        {enhancementsLoading ? (
          <View className="items-center py-6">
            <ActivityIndicator size="small" color="#FFC300" />
          </View>
        ) : enhancements && enhancements.length > 0 ? (
          enhancements.map((item) => (
            <View
              key={item.id}
              className="bg-elegant-gray rounded-xl p-3 mb-3 flex-row items-center gap-3"
            >
              {/* Thumbnail */}
              <Image
                source={{ uri: item.original_image_url }}
                className="w-14 h-14 rounded-lg bg-elegant-dark"
                resizeMode="cover"
              />

              {/* Info */}
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5 mb-1">
                  {isEnhanced(item) ? (
                    <CheckCircle size={14} color="#4CAF50" />
                  ) : (
                    <Clock size={14} color="#FFC300" />
                  )}
                  <Text
                    className={`font-sans-medium text-sm ${
                      isEnhanced(item) ? "text-green-400" : "text-gold-500"
                    }`}
                  >
                    {isEnhanced(item) ? "Completada" : "Procesando"}
                  </Text>
                </View>
                <Text className="text-cream-500 font-sans text-xs">
                  {formatDate(item.created_at)}
                </Text>
                {item.style && (
                  <Text className="text-cream-600 font-sans text-xs mt-0.5">
                    Estilo: {item.style}
                  </Text>
                )}
              </View>

              {/* Enhanced thumbnail if done */}
              {isEnhanced(item) && (
                <Image
                  source={{ uri: item.enhanced_image_url }}
                  className="w-14 h-14 rounded-lg bg-elegant-dark"
                  resizeMode="cover"
                />
              )}
            </View>
          ))
        ) : (
          <View className="bg-elegant-gray rounded-xl p-6 items-center">
            <AlertCircle size={24} color="#666" />
            <Text className="text-cream-500 font-sans text-sm mt-2 text-center">
              Todavía no mejoraste ninguna foto. Usá el botón de arriba para
              empezar.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
