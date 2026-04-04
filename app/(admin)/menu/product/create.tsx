import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Camera, ImageIcon, Info } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCreateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useStore } from "@/contexts/StoreContext";
import { pickImage, takePhoto, uploadProductImage } from "@/lib/imageUpload";

export default function CreateProductScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { store } = useStore();
  const createProduct = useCreateProduct();
  const { data: categories } = useCategories();
  const isStockEnabled = store?.is_food_business === false;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId ?? "");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [displayOrder, setDisplayOrder] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [adminOnly, setAdminOnly] = useState(false);
  const [trackStock, setTrackStock] = useState(false);
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockMinimum, setStockMinimum] = useState("0");
  const [saving, setSaving] = useState(false);

  const handlePickImage = () => {
    Alert.alert("Imagen del producto", "¿De dónde querés la imagen?", [
      { text: "Cámara", onPress: async () => { const uri = await takePhoto(); if (uri) setImageUri(uri); } },
      { text: "Galería", onPress: async () => { const uri = await pickImage(); if (uri) setImageUri(uri); } },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert("Error", "Nombre y precio son requeridos");
      return;
    }

    setSaving(true);
    let imageUrl: string | null = null;
    if (imageUri && store?.id) {
      imageUrl = await uploadProductImage(imageUri, store.id);
    }

    try {
      await createProduct.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price),
        category_id: selectedCategoryId || null,
        image_url: imageUrl,
        display_order: displayOrder ? parseInt(displayOrder) : undefined,
        is_available: isAvailable,
        is_featured: isFeatured,
        admin_only: adminOnly,
        track_stock: isStockEnabled && trackStock,
        stock_quantity: trackStock ? parseInt(stockQuantity) || 0 : null,
        stock_minimum: trackStock ? parseInt(stockMinimum) || 0 : null,
      });
      router.back();
    } catch {
      Alert.alert("Error", "No se pudo crear el producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Image picker */}
      <TouchableOpacity
        className="bg-elegant-gray rounded-2xl h-48 items-center justify-center mb-4 overflow-hidden"
        onPress={handlePickImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="items-center">
            <Camera size={32} color="#6B6B6B" />
            <Text className="text-text-secondary font-sans text-sm mt-2">Agregar imagen</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Name */}
      <Text className="text-text-secondary font-sans-medium text-base mb-1.5">Nombre *</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={name}
        onChangeText={setName}
        placeholder="Ej: Hamburguesa Clásica"
        placeholderTextColor="#A3A3A3"
      />

      {/* Description */}
      <Text className="text-text-secondary font-sans-medium text-base mb-1.5">Descripción</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe brevemente el producto..."
        placeholderTextColor="#A3A3A3"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* Price */}
      <Text className="text-text-secondary font-sans-medium text-base mb-1.5">Precio *</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        placeholderTextColor="#A3A3A3"
        keyboardType="decimal-pad"
      />

      {/* Category selector */}
      <Text className="text-text-secondary font-sans-medium text-base mb-1.5">Categoría</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
        className="mb-4"
      >
        <TouchableOpacity
          className={`px-4 py-2.5 rounded-xl ${!selectedCategoryId ? "bg-gold-500" : "bg-elegant-gray"}`}
          onPress={() => setSelectedCategoryId("")}
        >
          <Text className={`font-sans-medium text-base ${!selectedCategoryId ? "text-text-inverted" : "text-text-secondary"}`}>
            Sin categoría
          </Text>
        </TouchableOpacity>
        {(categories ?? []).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            className={`px-4 py-2.5 rounded-xl ${selectedCategoryId === cat.id ? "bg-gold-500" : "bg-elegant-gray"}`}
            onPress={() => setSelectedCategoryId(cat.id)}
          >
            <Text className={`font-sans-medium text-base ${selectedCategoryId === cat.id ? "text-text-inverted" : "text-text-secondary"}`}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Display Order */}
      <Text className="text-text-secondary font-sans-medium text-base mb-1.5">Orden de visualización</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-1"
        value={displayOrder}
        onChangeText={setDisplayOrder}
        placeholder="0"
        placeholderTextColor="#A3A3A3"
        keyboardType="number-pad"
        maxLength={3}
      />
      <View className="flex-row items-start gap-1.5 mb-4">
        <Info size={12} color="#A3A3A3" style={{ marginTop: 2 }} />
        <Text className="text-text-secondary font-sans text-sm flex-1">
          Número menor = aparece primero en el catálogo
        </Text>
      </View>

      {/* Toggles Section */}
      <Text className="text-text-primary font-sans-semibold text-lg mb-3 mt-2">Opciones</Text>

      {/* Availability */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-text-primary font-sans-medium text-base">Disponible</Text>
            <Text className="text-text-secondary font-sans text-sm mt-0.5">Visible y disponible para pedir</Text>
          </View>
          <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{ false: "#D4D4D4", true: "#EB1C8D" }} thumbColor="#fff" />
        </View>
      </View>

      {/* Featured */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-text-primary font-sans-medium text-base">Producto Destacado</Text>
            <Text className="text-text-secondary font-sans text-sm mt-0.5">Aparece en el carrusel principal del catálogo</Text>
          </View>
          <Switch value={isFeatured} onValueChange={setIsFeatured} trackColor={{ false: "#D4D4D4", true: "#EB1C8D" }} thumbColor="#fff" />
        </View>
      </View>

      {/* Admin Only */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-text-primary font-sans-medium text-base">Solo pedidos en tienda</Text>
            <Text className="text-text-secondary font-sans text-sm mt-0.5">No se muestra en el menú digital, solo disponible para pedidos desde admin</Text>
          </View>
          <Switch value={adminOnly} onValueChange={setAdminOnly} trackColor={{ false: "#D4D4D4", true: "#EB1C8D" }} thumbColor="#fff" />
        </View>
      </View>

      {/* Stock (non-food only) */}
      {isStockEnabled && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-sans-medium text-base">Control de inventario</Text>
              <Text className="text-text-secondary font-sans text-sm mt-0.5">Activa para controlar el stock de este producto</Text>
            </View>
            <Switch value={trackStock} onValueChange={setTrackStock} trackColor={{ false: "#D4D4D4", true: "#EB1C8D" }} thumbColor="#fff" />
          </View>
          {trackStock && (
            <View className="border-t border-background-main pt-3">
              <Text className="text-text-secondary font-sans text-sm mb-1">Cantidad disponible</Text>
              <TextInput
                className="bg-background-main text-text-primary px-4 py-2.5 rounded-xl font-sans text-base mb-3"
                value={stockQuantity}
                onChangeText={setStockQuantity}
                placeholder="0"
                placeholderTextColor="#A3A3A3"
                keyboardType="number-pad"
              />
              <Text className="text-text-secondary font-sans text-sm mb-1">Stock mínimo (alerta)</Text>
              <TextInput
                className="bg-background-main text-text-primary px-4 py-2.5 rounded-xl font-sans text-base"
                value={stockMinimum}
                onChangeText={setStockMinimum}
                placeholder="0"
                placeholderTextColor="#A3A3A3"
                keyboardType="number-pad"
              />
              <View className="flex-row items-start gap-1.5 mt-2">
                <Info size={12} color="#A3A3A3" style={{ marginTop: 2 }} />
                <Text className="text-text-secondary font-sans text-sm flex-1">
                  Recibís una alerta cuando el stock llegue a este nivel
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Save button */}
      <TouchableOpacity
        className={`py-4 rounded-xl items-center mt-4 ${saving ? "bg-gold-700" : "bg-gold-500"}`}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-text-inverted font-sans-bold text-lg">Crear Producto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
