import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Palette, Camera, Info, Tag, Share2, Plus, Trash2, X } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";
import { pickImage, uploadProductImage } from "@/lib/imageUpload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

const PRESET_COLORS = [
  "#EB1C8D", "#FF5733", "#EF4444", "#F97316", "#F59E0B",
  "#22C55E", "#10B981", "#14B8A6", "#06B6D4", "#3B82F6",
  "#6366F1", "#8B5CF6", "#A855F7", "#EC4899", "#F43F5E",
  "#1A1A1A", "#2A2A2A", "#000000", "#FFFFFF", "#6B7280",
];

export default function DesignSettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("");
  const [priceColor, setPriceColor] = useState("");
  const [deliveryLabel, setDeliveryLabel] = useState("");
  const [pickupLabel, setPickupLabel] = useState("");
  const [digitalMenuLabel, setDigitalMenuLabel] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const queryClient = useQueryClient();

  const SOCIAL_PLATFORMS = [
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/tutienda" },
    { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/tutienda" },
    { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@tutienda" },
    { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/tutienda" },
    { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/1234567890" },
    { key: "website", label: "Sitio web", placeholder: "https://tutienda.com" },
  ];

  const { data: socialLinks } = useQuery({
    queryKey: ["social-links", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("store_id", store!.id)
        .order("display_order", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!store?.id,
  });

  const addSocialLink = useMutation({
    mutationFn: async (data: { platform: string; url: string }) => {
      const { error } = await supabase.from("social_links").insert({
        ...data,
        store_id: store!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social-links"] }),
  });

  const deleteSocialLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social-links"] }),
  });

  const handleAddSocial = async () => {
    if (!socialPlatform || !socialUrl.trim()) {
      Alert.alert("Error", "Seleccioná una red y agregá la URL");
      return;
    }
    try {
      await addSocialLink.mutateAsync({ platform: socialPlatform, url: socialUrl.trim() });
      setSocialPlatform("");
      setSocialUrl("");
      setShowSocialForm(false);
    } catch {
      Alert.alert("Error", "No se pudo agregar");
    }
  };

  useEffect(() => {
    if (store) {
      const s = store as any;
      setLogoUri(s.logo_url ?? null);
      setPrimaryColor(s.primary_color ?? "");
      setPriceColor(s.price_color ?? "");
      setDeliveryLabel(s.delivery_label ?? "");
      setPickupLabel(s.pickup_label ?? "");
      setDigitalMenuLabel(s.digital_menu_label ?? "");
    }
  }, [store]);

  const handlePickLogo = async () => {
    const uri = await pickImage();
    if (!uri || !store?.id) return;

    setUploadingLogo(true);
    try {
      const publicUrl = await uploadProductImage(uri, store.id);
      if (publicUrl) {
        setLogoUri(publicUrl);
        await updateStore.mutateAsync({ logo_url: publicUrl });
        Alert.alert("Logo actualizado", "El nuevo logo ya está visible");
      } else {
        Alert.alert("Error", "No se pudo subir la imagen");
      }
    } catch {
      Alert.alert("Error", "No se pudo subir el logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateStore.mutateAsync({
        primary_color: primaryColor || null,
        price_color: priceColor || null,
        delivery_label: deliveryLabel || null,
        pickup_label: pickupLabel || null,
        digital_menu_label: digitalMenuLabel || null,
      });
      Alert.alert("Guardado", "Configuración de diseño actualizada");
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
        <Palette size={20} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-bold text-lg">Diseño</Text>
      </View>

      {/* Logo */}
      <Text className="text-text-primary font-sans-semibold text-sm mb-3">Logo de la tienda</Text>
      <TouchableOpacity
        className="bg-elegant-gray rounded-2xl h-32 items-center justify-center mb-2 overflow-hidden"
        onPress={handlePickLogo}
        disabled={uploadingLogo}
        activeOpacity={0.7}
      >
        {uploadingLogo ? (
          <ActivityIndicator size="large" color="#EB1C8D" />
        ) : logoUri ? (
          <Image
            source={{ uri: logoUri }}
            className="w-24 h-24 rounded-xl"
            resizeMode="contain"
          />
        ) : (
          <View className="items-center">
            <Camera size={28} color="#666" />
            <Text className="text-cream-400 font-sans text-xs mt-2">
              Tocá para subir tu logo
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <View className="flex-row items-start gap-1.5 mb-6">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Recomendado: imagen cuadrada, fondo transparente (PNG), mínimo 512x512px.
        </Text>
      </View>

      {/* Primary Color */}
      <Text className="text-text-primary font-sans-semibold text-sm mb-3">Color primario</Text>
      <View className="flex-row items-center gap-3 mb-2">
        <View
          className="w-12 h-12 rounded-xl border-2 border-cream-400/20"
          style={{ backgroundColor: primaryColor || "#EB1C8D" }}
        />
        <TextInput
          className="flex-1 bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base"
          value={primaryColor}
          onChangeText={setPrimaryColor}
          placeholder="#EB1C8D"
          placeholderTextColor="#666"
          autoCapitalize="characters"
          maxLength={7}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
        className="mb-2"
      >
        {PRESET_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            className={`w-9 h-9 rounded-full ${
              primaryColor === color ? "border-2 border-white" : ""
            }`}
            style={{ backgroundColor: color }}
            onPress={() => setPrimaryColor(color)}
          />
        ))}
      </ScrollView>
      <View className="flex-row items-start gap-1.5 mb-6">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Color principal de tu tienda. Se usa en botones, enlaces y elementos destacados del catálogo.
        </Text>
      </View>

      {/* Price Color */}
      <Text className="text-text-primary font-sans-semibold text-sm mb-3">Color de precio</Text>
      <View className="flex-row items-center gap-3 mb-2">
        <View
          className="w-12 h-12 rounded-xl border-2 border-cream-400/20"
          style={{ backgroundColor: priceColor || "#22C55E" }}
        />
        <TextInput
          className="flex-1 bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base"
          value={priceColor}
          onChangeText={setPriceColor}
          placeholder="#22C55E"
          placeholderTextColor="#666"
          autoCapitalize="characters"
          maxLength={7}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
        className="mb-2"
      >
        {PRESET_COLORS.map((color) => (
          <TouchableOpacity
            key={`price-${color}`}
            className={`w-9 h-9 rounded-full ${
              priceColor === color ? "border-2 border-white" : ""
            }`}
            style={{ backgroundColor: color }}
            onPress={() => setPriceColor(color)}
          />
        ))}
      </ScrollView>
      <View className="flex-row items-start gap-1.5 mb-6">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Color de los precios en el catálogo. Elegí uno que contraste bien con el fondo.
        </Text>
      </View>

      {/* Separator */}
      <View className="flex-row items-center gap-2 mb-4 mt-2">
        <Tag size={16} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-semibold text-sm">
          Etiquetas Personalizadas
        </Text>
      </View>
      <View className="flex-row items-start gap-1.5 mb-4">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Personalizá los nombres que ven tus clientes para cada tipo de pedido. Si los dejás vacíos, se usan los valores por defecto.
        </Text>
      </View>

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Etiqueta Delivery</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={deliveryLabel}
        onChangeText={setDeliveryLabel}
        placeholder="Delivery"
        placeholderTextColor="#666"
      />

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Etiqueta Pick-up</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={pickupLabel}
        onChangeText={setPickupLabel}
        placeholder="Pick-up"
        placeholderTextColor="#666"
      />

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Etiqueta Menú Digital</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-6"
        value={digitalMenuLabel}
        onChangeText={setDigitalMenuLabel}
        placeholder="Mesa"
        placeholderTextColor="#666"
      />

      {/* Social Links */}
      <View className="flex-row items-center justify-between mb-3 mt-2">
        <View className="flex-row items-center gap-2">
          <Share2 size={16} color="#EB1C8D" />
          <Text className="text-text-primary font-sans-semibold text-sm">
            Redes Sociales
          </Text>
        </View>
        <TouchableOpacity
          className="bg-gold-500 px-3 py-1.5 rounded-lg flex-row items-center gap-1"
          onPress={() => setShowSocialForm(!showSocialForm)}
          activeOpacity={0.8}
        >
          {showSocialForm ? (
            <X size={14} color="#FFFFFF" />
          ) : (
            <Plus size={14} color="#FFFFFF" />
          )}
          <Text className="text-text-inverted font-sans-bold text-xs">
            {showSocialForm ? "Cancelar" : "Agregar"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-start gap-1.5 mb-3">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Agregá tus redes sociales para que aparezcan en el pie de página de tu tienda.
        </Text>
      </View>

      {/* Add social form */}
      {showSocialForm && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-3 border border-gold-500/30">
          <Text className="text-cream-300 font-sans text-xs mb-2">Red social</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingBottom: 4 }}
            className="mb-3"
          >
            {SOCIAL_PLATFORMS.map((p) => (
              <TouchableOpacity
                key={p.key}
                className={`px-3 py-2 rounded-lg ${
                  socialPlatform === p.key ? "bg-gold-500" : "bg-elegant-dark"
                }`}
                onPress={() => setSocialPlatform(p.key)}
              >
                <Text
                  className={`font-sans text-xs ${
                    socialPlatform === p.key
                      ? "text-text-inverted font-sans-medium"
                      : "text-cream-300"
                  }`}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text className="text-cream-300 font-sans text-xs mb-1">URL</Text>
          <TextInput
            className="bg-elegant-dark text-text-primary px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
            value={socialUrl}
            onChangeText={setSocialUrl}
            placeholder={
              SOCIAL_PLATFORMS.find((p) => p.key === socialPlatform)?.placeholder ??
              "https://..."
            }
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="url"
          />

          <TouchableOpacity
            className="bg-gold-500 py-2.5 rounded-xl items-center"
            onPress={handleAddSocial}
            disabled={addSocialLink.isPending}
            activeOpacity={0.8}
          >
            <Text className="text-text-inverted font-sans-bold text-sm">
              {addSocialLink.isPending ? "Guardando..." : "Agregar red"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Social links list */}
      {socialLinks && socialLinks.length > 0 ? (
        socialLinks.map((link: any) => {
          const platformInfo = SOCIAL_PLATFORMS.find((p) => p.key === link.platform);
          return (
            <View
              key={link.id}
              className="bg-elegant-gray rounded-xl p-3 mb-2 flex-row items-center"
            >
              <View className="flex-1">
                <Text className="text-text-primary font-sans-medium text-sm">
                  {platformInfo?.label ?? link.platform}
                </Text>
                <Text
                  className="text-cream-400/70 font-sans text-xs mt-0.5"
                  numberOfLines={1}
                >
                  {link.url}
                </Text>
              </View>
              <TouchableOpacity
                className="p-2"
                onPress={() =>
                  Alert.alert("Eliminar", `¿Eliminar ${platformInfo?.label ?? link.platform}?`, [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Eliminar",
                      style: "destructive",
                      onPress: () => deleteSocialLink.mutate(link.id),
                    },
                  ])
                }
              >
                <Trash2 size={15} color="#EF4444" />
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        !showSocialForm && (
          <View className="bg-elegant-gray rounded-xl p-4 items-center mb-3">
            <Text className="text-cream-400/60 font-sans text-xs">
              No hay redes sociales configuradas
            </Text>
          </View>
        )
      )}

      <View className="h-4" />

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
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-text-inverted font-sans-bold text-base">
            Guardar
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
