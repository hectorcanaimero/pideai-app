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
import { Camera } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCreateProduct } from "@/hooks/useProducts";
import { useStore } from "@/contexts/StoreContext";
import { pickImage, takePhoto, uploadProductImage } from "@/lib/imageUpload";

export default function CreateProductScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { store } = useStore();
  const createProduct = useCreateProduct();
  const isStockEnabled = store?.is_food_business === false;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [trackStock, setTrackStock] = useState(false);
  const [stockQuantity, setStockQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePickImage = () => {
    Alert.alert("Imagen del producto", "¿De dónde querés la imagen?", [
      {
        text: "Cámara",
        onPress: async () => {
          const uri = await takePhoto();
          if (uri) setImageUri(uri);
        },
      },
      {
        text: "Galería",
        onPress: async () => {
          const uri = await pickImage();
          if (uri) setImageUri(uri);
        },
      },
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
        category_id: categoryId || null,
        image_url: imageUrl,
        is_available: true,
        track_stock: isStockEnabled && trackStock,
        stock_quantity: trackStock ? parseInt(stockQuantity) || 0 : null,
      });
      router.back();
    } catch (err) {
      Alert.alert("Error", "No se pudo crear el producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Image picker */}
      <TouchableOpacity
        className="bg-elegant-gray rounded-2xl h-48 items-center justify-center mb-4 overflow-hidden"
        onPress={handlePickImage}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center">
            <Camera size={32} color="#666" />
            <Text className="text-cream-400 font-sans text-sm mt-2">
              Agregar imagen
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Name */}
      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
        Nombre *
      </Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={name}
        onChangeText={setName}
        placeholder="Ej: Hamburguesa clásica"
        placeholderTextColor="#666"
      />

      {/* Price */}
      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
        Precio *
      </Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        placeholderTextColor="#666"
        keyboardType="decimal-pad"
      />

      {/* Description */}
      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
        Descripción
      </Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción del producto"
        placeholderTextColor="#666"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* Stock (non-food only) */}
      {isStockEnabled && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-sans-medium text-sm">
              Controlar stock
            </Text>
            <Switch
              value={trackStock}
              onValueChange={setTrackStock}
              trackColor={{ false: "#444", true: "#FFC300" }}
              thumbColor="#fff"
            />
          </View>
          {trackStock && (
            <View>
              <Text className="text-cream-300 font-sans text-xs mb-1">
                Cantidad disponible
              </Text>
              <TextInput
                className="bg-elegant-dark text-white px-4 py-2.5 rounded-xl font-sans text-sm"
                value={stockQuantity}
                onChangeText={setStockQuantity}
                placeholder="0"
                placeholderTextColor="#666"
                keyboardType="number-pad"
              />
            </View>
          )}
        </View>
      )}

      {/* Save button */}
      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${saving ? "bg-gold-700" : "bg-gold-500"}`}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color="#1A1A2E" />
        ) : (
          <Text className="text-elegant-dark font-sans-bold text-base">
            Crear Producto
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
