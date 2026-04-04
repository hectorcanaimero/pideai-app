import { useState, useEffect } from "react";
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
import { Camera, Trash2 } from "lucide-react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  useProductDetail,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { useStore } from "@/contexts/StoreContext";
import { pickImage, takePhoto, uploadProductImage } from "@/lib/imageUpload";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading } = useProductDetail(id);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { store } = useStore();
  const isStockEnabled = store?.is_food_business === false;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [trackStock, setTrackStock] = useState(false);
  const [stockQuantity, setStockQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description ?? "");
      setPrice(String(product.price));
      setImageUri(product.image_url);
      setTrackStock(product.track_stock);
      setStockQuantity(String(product.stock_quantity ?? ""));
    }
  }, [product]);

  const handlePickImage = () => {
    Alert.alert("Imagen del producto", "¿De dónde?", [
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
    let imageUrl = imageUri;

    if (imageUri && !imageUri.startsWith("http") && store?.id) {
      imageUrl = await uploadProductImage(imageUri, store.id);
    }

    try {
      await updateProduct.mutateAsync({
        id: id!,
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        image_url: imageUrl,
        track_stock: isStockEnabled && trackStock,
        stock_quantity: trackStock ? parseInt(stockQuantity) || 0 : null,
      });
      router.back();
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar producto", `¿Eliminar "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct.mutateAsync(id!);
            router.back();
          } catch (err: any) {
            if (err.message === "REFERENCED") {
              Alert.alert(
                "No se puede eliminar",
                "Este producto tiene pedidos asociados. Se ocultará del menú."
              );
              await updateProduct.mutateAsync({ id: id!, is_available: null });
              router.back();
            } else {
              Alert.alert("Error", "No se pudo eliminar");
            }
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark">
        <ActivityIndicator size="large" color="#EB1C8D" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Image */}
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
      />

      {/* Price */}
      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
        Precio *
      </Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={price}
        onChangeText={setPrice}
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
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* Stock */}
      {isStockEnabled && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-sans-medium text-sm">
              Controlar stock
            </Text>
            <Switch
              value={trackStock}
              onValueChange={setTrackStock}
              trackColor={{ false: "#444", true: "#EB1C8D" }}
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
                keyboardType="number-pad"
              />
            </View>
          )}
        </View>
      )}

      {/* Save */}
      <TouchableOpacity
        className={`py-4 rounded-xl items-center mb-3 ${saving ? "bg-gold-700" : "bg-gold-500"}`}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color="#1A1A1A" />
        ) : (
          <Text className="text-elegant-dark font-sans-bold text-base">
            Guardar Cambios
          </Text>
        )}
      </TouchableOpacity>

      {/* Delete */}
      <TouchableOpacity
        className="py-3 rounded-xl items-center flex-row justify-center gap-2 border border-red-500/30"
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Trash2 size={16} color="#EF4444" />
        <Text className="text-red-400 font-sans-medium text-sm">
          Eliminar producto
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
