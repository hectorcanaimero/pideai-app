import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import {
  Sparkles,
  Sun,
  Crown,
  Palette,
  Moon,
  ImageIcon,
  Eye,
  Square,
  RectangleVertical,
  Smartphone,
  Shirt,
  Camera,
  Cpu,
  Home,
  Wrench,
  ShoppingBag,
  Info,
  ChevronRight,
  ChevronLeft,
  Zap,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

// Types
type StyleType =
  | "realistic" | "premium" | "animated" | "minimalist" | "white_bg" | "dark_mode" | "top_view"
  | "fashion_studio" | "fashion_lifestyle" | "tech_premium" | "beauty_glow"
  | "home_lifestyle" | "industrial_clean" | "generic_ecommerce";

type AspectRatio = "1:1" | "4:5" | "9:16";

interface StyleOption {
  id: StyleType;
  name: string;
  description: string;
  color: string;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
}

// Style options for food businesses
const FOOD_STYLES: StyleOption[] = [
  { id: "realistic", name: "Realista", description: "Foto profesional de estudio", color: "#F59E0B" },
  { id: "premium", name: "Premium", description: "Estilo lujoso y elegante", color: "#EAB308" },
  { id: "animated", name: "Animado", description: "Estilo ilustrado colorido", color: "#EC4899" },
  { id: "minimalist", name: "Minimalista", description: "Limpio y moderno", color: "#64748B" },
  { id: "white_bg", name: "Fondo Blanco", description: "Estilo e-commerce", color: "#9CA3AF" },
  { id: "dark_mode", name: "Dark Mode", description: "Fondo oscuro dramático", color: "#334155" },
  { id: "top_view", name: "Vista Cenital", description: "Foto desde arriba", color: "#06B6D4" },
];

// Style options for non-food businesses
const NON_FOOD_STYLES: StyleOption[] = [
  { id: "fashion_studio", name: "Fashion Studio", description: "Fondo limpio, sin modelo", color: "#F43F5E" },
  { id: "fashion_lifestyle", name: "Lifestyle", description: "Contexto urbano editorial", color: "#F97316" },
  { id: "tech_premium", name: "Tech Premium", description: "Estilo Apple/Samsung", color: "#475569" },
  { id: "beauty_glow", name: "Beauty Glow", description: "Fondo pastel, luz suave", color: "#D946EF" },
  { id: "home_lifestyle", name: "Home Living", description: "Ambiente interior cálido", color: "#F59E0B" },
  { id: "industrial_clean", name: "Industrial", description: "Fondo neutro, técnico", color: "#6B7280" },
  { id: "generic_ecommerce", name: "E-commerce", description: "Fondo blanco universal", color: "#3B82F6" },
];

const ASPECT_RATIOS = [
  { id: "1:1" as AspectRatio, name: "Cuadrado", description: "Feed Instagram" },
  { id: "4:5" as AspectRatio, name: "Portrait", description: "Mejor engagement" },
  { id: "9:16" as AspectRatio, name: "Stories", description: "Stories y Reels" },
];

// Steps: select_product → select_style → select_ratio → processing → done
type Step = "select_product" | "select_style" | "select_ratio" | "processing";

export default function AIStudioScreen() {
  const { store } = useStore();
  const isFoodBusiness = store?.is_food_business !== false;
  const styles = isFoodBusiness ? FOOD_STYLES : NON_FOOD_STYLES;

  const [step, setStep] = useState<Step>("select_product");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleType | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>("1:1");

  // Fetch products with images
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["ai-products", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id, name, image_url")
        .eq("store_id", store!.id)
        .not("image_url", "is", null)
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
    enabled: !!store?.id,
  });

  // Fetch AI credits
  const { data: credits } = useQuery({
    queryKey: ["ai-credits", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, subscription_plans(*)")
        .eq("store_id", store!.id)
        .maybeSingle();
      if (error) throw error;
      const plan = data?.subscription_plans as any;
      const limit = plan?.limits?.ai_monthly_credits ?? 0;
      // Count this month's usage
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { count } = await supabase
        .from("ai_enhancement_history")
        .select("id", { count: "exact", head: true })
        .eq("store_id", store!.id)
        .gte("created_at", monthStart);
      return { total: limit, used: count ?? 0, remaining: Math.max(0, limit - (count ?? 0)) };
    },
    enabled: !!store?.id,
  });

  // Fetch recent enhancements
  const { data: history } = useQuery({
    queryKey: ["ai-history", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_enhancement_history")
        .select("*")
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!store?.id,
  });

  const handleGenerate = async () => {
    if (!selectedProduct || !selectedStyle || !credits || credits.remaining <= 0) {
      Alert.alert("Sin créditos", "No tenés créditos de IA disponibles. Mejorá tu plan para obtener más.");
      return;
    }

    setStep("processing");

    try {
      // Record the enhancement request
      const { error } = await supabase.from("ai_enhancement_history").insert({
        store_id: store!.id,
        menu_item_id: selectedProduct.id,
        original_image_url: selectedProduct.image_url,
        enhanced_image_url: selectedProduct.image_url, // Placeholder until backend processes
        style: selectedStyle,
        aspect_ratio: selectedRatio,
        model_type: "standard",
      });

      if (error) throw error;

      Alert.alert(
        "Imagen enviada",
        "Tu imagen se está procesando. Puede tardar unos minutos. Te notificaremos cuando esté lista.",
        [{ text: "OK", onPress: () => resetFlow() }]
      );
    } catch {
      Alert.alert("Error", "No se pudo procesar la imagen");
      setStep("select_ratio");
    }
  };

  const resetFlow = () => {
    setStep("select_product");
    setSelectedProduct(null);
    setSelectedStyle(null);
    setSelectedRatio("1:1");
  };

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-2 mb-2">
        <Sparkles size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">AI Photo Studio</Text>
      </View>

      {/* Credits */}
      <View className="bg-elegant-gray rounded-xl p-3 flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Zap size={14} color="#FFC300" />
          <Text className="text-cream-400 font-sans text-xs">Créditos disponibles</Text>
        </View>
        <Text className="text-gold-500 font-sans-bold text-sm">
          {credits?.remaining ?? 0} / {credits?.total ?? 0}
        </Text>
      </View>

      <View className="flex-row items-start gap-1.5 mb-5">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Mejorá las fotos de tus productos con inteligencia artificial. Seleccioná un producto, elegí un estilo y listo.
        </Text>
      </View>

      {/* STEP 1: Select Product */}
      {step === "select_product" && (
        <>
          <Text className="text-white font-sans-semibold text-sm mb-3">
            1. Seleccioná un producto
          </Text>

          {productsLoading ? (
            <ActivityIndicator size="large" color="#FFC300" />
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="bg-elegant-gray rounded-xl p-3 mb-2 flex-row items-center"
                onPress={() => {
                  setSelectedProduct(product);
                  setStep("select_style");
                }}
                activeOpacity={0.7}
              >
                {product.image_url ? (
                  <Image
                    source={{ uri: product.image_url }}
                    className="w-14 h-14 rounded-lg mr-3"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-14 h-14 rounded-lg mr-3 bg-elegant-dark items-center justify-center">
                    <ImageIcon size={20} color="#666" />
                  </View>
                )}
                <Text className="text-white font-sans-medium text-sm flex-1">
                  {product.name}
                </Text>
                <ChevronRight size={16} color="#666" />
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-elegant-gray rounded-xl p-6 items-center">
              <ImageIcon size={32} color="#444" />
              <Text className="text-cream-400 font-sans text-sm mt-3">
                No hay productos con imagen
              </Text>
              <Text className="text-cream-400/60 font-sans text-xs mt-1 text-center">
                Agregá imágenes a tus productos desde el menú para poder mejorarlas con IA.
              </Text>
            </View>
          )}
        </>
      )}

      {/* STEP 2: Select Style */}
      {step === "select_style" && selectedProduct && (
        <>
          <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() => setStep("select_product")}
          >
            <ChevronLeft size={18} color="#FFC300" />
            <Text className="text-gold-500 font-sans-medium text-sm ml-1">Volver</Text>
          </TouchableOpacity>

          {/* Selected product preview */}
          <View className="bg-elegant-gray rounded-xl p-3 flex-row items-center mb-4">
            {selectedProduct.image_url && (
              <Image
                source={{ uri: selectedProduct.image_url }}
                className="w-12 h-12 rounded-lg mr-3"
                resizeMode="cover"
              />
            )}
            <Text className="text-white font-sans-medium text-sm flex-1">
              {selectedProduct.name}
            </Text>
          </View>

          <Text className="text-white font-sans-semibold text-sm mb-3">
            2. Elegí un estilo
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {styles.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <TouchableOpacity
                  key={style.id}
                  className={`rounded-xl p-3 mb-1 ${
                    isSelected ? "border-2 border-gold-500" : "border border-elegant-gray"
                  }`}
                  style={{
                    width: "48%",
                    backgroundColor: isSelected ? `${style.color}15` : "#2D2D44",
                  }}
                  onPress={() => {
                    setSelectedStyle(style.id);
                    setStep("select_ratio");
                  }}
                  activeOpacity={0.7}
                >
                  <View className="w-8 h-8 rounded-lg items-center justify-center mb-2"
                    style={{ backgroundColor: `${style.color}30` }}>
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: style.color }} />
                  </View>
                  <Text className="text-white font-sans-medium text-sm">{style.name}</Text>
                  <Text className="text-cream-400 font-sans text-[10px] mt-0.5">{style.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* STEP 3: Select Ratio + Generate */}
      {step === "select_ratio" && selectedProduct && selectedStyle && (
        <>
          <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() => setStep("select_style")}
          >
            <ChevronLeft size={18} color="#FFC300" />
            <Text className="text-gold-500 font-sans-medium text-sm ml-1">Volver</Text>
          </TouchableOpacity>

          {/* Preview */}
          <View className="bg-elegant-gray rounded-xl p-3 flex-row items-center mb-4">
            {selectedProduct.image_url && (
              <Image
                source={{ uri: selectedProduct.image_url }}
                className="w-12 h-12 rounded-lg mr-3"
                resizeMode="cover"
              />
            )}
            <View>
              <Text className="text-white font-sans-medium text-sm">{selectedProduct.name}</Text>
              <Text className="text-cream-400 font-sans text-xs">
                Estilo: {styles.find((s) => s.id === selectedStyle)?.name}
              </Text>
            </View>
          </View>

          <Text className="text-white font-sans-semibold text-sm mb-3">
            3. Formato de imagen
          </Text>

          <View className="flex-row gap-3 mb-6">
            {ASPECT_RATIOS.map((ratio) => {
              const isSelected = selectedRatio === ratio.id;
              return (
                <TouchableOpacity
                  key={ratio.id}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    isSelected ? "bg-gold-500" : "bg-elegant-gray"
                  }`}
                  onPress={() => setSelectedRatio(ratio.id)}
                  activeOpacity={0.7}
                >
                  <Text className={`font-sans-bold text-sm ${isSelected ? "text-elegant-dark" : "text-cream-300"}`}>
                    {ratio.name}
                  </Text>
                  <Text className={`font-sans text-[10px] mt-0.5 ${isSelected ? "text-elegant-dark/70" : "text-cream-400"}`}>
                    {ratio.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Generate button */}
          <TouchableOpacity
            className={`py-4 rounded-xl items-center flex-row justify-center gap-2 ${
              credits && credits.remaining > 0 ? "bg-gold-500" : "bg-gray-600"
            }`}
            onPress={handleGenerate}
            disabled={!credits || credits.remaining <= 0}
            activeOpacity={0.8}
          >
            <Sparkles size={18} color={credits && credits.remaining > 0 ? "#1A1A2E" : "#999"} />
            <Text className={`font-sans-bold text-base ${
              credits && credits.remaining > 0 ? "text-elegant-dark" : "text-gray-400"
            }`}>
              {credits && credits.remaining > 0 ? "Generar imagen" : "Sin créditos disponibles"}
            </Text>
          </TouchableOpacity>

          {credits && credits.remaining > 0 && (
            <Text className="text-cream-400/60 font-sans text-xs text-center mt-2">
              Consume 1 crédito · Te quedan {credits.remaining}
            </Text>
          )}
        </>
      )}

      {/* STEP: Processing */}
      {step === "processing" && (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#FFC300" />
          <Text className="text-white font-sans-semibold text-base mt-4">
            Procesando imagen...
          </Text>
          <Text className="text-cream-400 font-sans text-sm mt-1">
            Esto puede tardar unos minutos
          </Text>
        </View>
      )}

      {/* Recent History */}
      {step === "select_product" && history && history.length > 0 && (
        <View className="mt-6">
          <Text className="text-cream-400 font-sans-semibold text-xs uppercase tracking-wider mb-3">
            Mejoras recientes
          </Text>
          {history.map((item: any) => (
            <View key={item.id} className="bg-elegant-gray rounded-xl p-3 mb-2 flex-row items-center">
              {item.original_image_url && (
                <Image
                  source={{ uri: item.enhanced_image_url || item.original_image_url }}
                  className="w-12 h-12 rounded-lg mr-3"
                  resizeMode="cover"
                />
              )}
              <View className="flex-1">
                <Text className="text-white font-sans text-sm">
                  {item.style ?? "Standard"}
                </Text>
                <Text className="text-cream-400 font-sans text-xs mt-0.5">
                  {new Date(item.created_at).toLocaleDateString("es", { day: "2-digit", month: "short" })}
                </Text>
              </View>
              <View className={`px-2 py-0.5 rounded-full ${
                item.enhanced_image_url !== item.original_image_url ? "bg-green-500/20" : "bg-yellow-500/20"
              }`}>
                <Text className={`font-sans text-[10px] ${
                  item.enhanced_image_url !== item.original_image_url ? "text-green-400" : "text-yellow-400"
                }`}>
                  {item.enhanced_image_url !== item.original_image_url ? "Completada" : "Procesando"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
