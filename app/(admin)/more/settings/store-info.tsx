import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Store, Globe, DollarSign, ShoppingBag, Utensils } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

const COUNTRIES = [
  { code: "VE", label: "Venezuela" },
  { code: "CO", label: "Colombia" },
  { code: "MX", label: "México" },
  { code: "AR", label: "Argentina" },
  { code: "CL", label: "Chile" },
  { code: "PE", label: "Perú" },
  { code: "EC", label: "Ecuador" },
  { code: "BR", label: "Brasil" },
  { code: "US", label: "Estados Unidos" },
  { code: "ES", label: "España" },
];

const CURRENCIES = ["USD", "EUR", "VES", "COP", "MXN", "ARS", "CLP", "PEN", "BRL"];

const OPERATING_MODES = [
  { key: "delivery", label: "Delivery", icon: "🚚" },
  { key: "pickup", label: "Pick-up", icon: "🏪" },
  { key: "digital_menu", label: "Menú digital", icon: "🍽️" },
];

export default function StoreInfoScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isFoodBusiness, setIsFoodBusiness] = useState(true);
  const [catalogMode, setCatalogMode] = useState(false);
  const [operatingModes, setOperatingModes] = useState<string[]>([]);

  useEffect(() => {
    if (store) {
      setName(store.name ?? "");
      setEmail((store as any).email ?? "");
      setPhone((store as any).phone ?? "");
      setAddress((store as any).address ?? "");
      setCountry((store as any).country ?? "");
      setCurrency((store as any).currency ?? "USD");
      setIsFoodBusiness(store.is_food_business ?? true);
      setCatalogMode(store.catalog_mode ?? false);
      setOperatingModes(store.operating_modes ?? []);
    }
  }, [store]);

  const toggleOperatingMode = (mode: string) => {
    setOperatingModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre es requerido");
      return;
    }

    try {
      await updateStore.mutateAsync({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        country: country || null,
        currency,
        is_food_business: isFoodBusiness,
        catalog_mode: catalogMode,
        operating_modes: operatingModes.length > 0 ? operatingModes : null,
      });
      Alert.alert("Guardado", "Información actualizada");
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
        <Store size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Información de la tienda</Text>
      </View>

      {/* Basic Info */}
      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Nombre de la tienda *</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Email</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Teléfono</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">Dirección</Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={address}
        onChangeText={setAddress}
      />

      {/* Country */}
      <View className="flex-row items-center gap-2 mb-2 mt-2">
        <Globe size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-sm">País</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
        className="mb-4"
      >
        {COUNTRIES.map((c) => (
          <TouchableOpacity
            key={c.code}
            className={`px-4 py-2.5 rounded-xl ${
              country === c.code ? "bg-gold-500" : "bg-elegant-gray"
            }`}
            onPress={() => setCountry(c.code)}
            activeOpacity={0.7}
          >
            <Text
              className={`font-sans-medium text-sm ${
                country === c.code ? "text-elegant-dark" : "text-cream-300"
              }`}
            >
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Currency */}
      <View className="flex-row items-center gap-2 mb-2">
        <DollarSign size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-sm">Moneda</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
        className="mb-4"
      >
        {CURRENCIES.map((c) => (
          <TouchableOpacity
            key={c}
            className={`px-4 py-2.5 rounded-xl ${
              currency === c ? "bg-gold-500" : "bg-elegant-gray"
            }`}
            onPress={() => setCurrency(c)}
            activeOpacity={0.7}
          >
            <Text
              className={`font-sans-medium text-sm ${
                currency === c ? "text-elegant-dark" : "text-cream-300"
              }`}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Operating Modes */}
      <View className="flex-row items-center gap-2 mb-2 mt-2">
        <ShoppingBag size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-sm">Modos de funcionamiento</Text>
      </View>
      <View className="gap-2 mb-4">
        {OPERATING_MODES.map((mode) => {
          const isActive = operatingModes.includes(mode.key);
          return (
            <TouchableOpacity
              key={mode.key}
              className={`flex-row items-center justify-between px-4 py-3.5 rounded-xl ${
                isActive ? "bg-gold-500/15 border border-gold-500/30" : "bg-elegant-gray"
              }`}
              onPress={() => toggleOperatingMode(mode.key)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">{mode.icon}</Text>
                <Text
                  className={`font-sans-medium text-sm ${
                    isActive ? "text-gold-500" : "text-cream-300"
                  }`}
                >
                  {mode.label}
                </Text>
              </View>
              <View
                className={`w-5 h-5 rounded-md items-center justify-center ${
                  isActive ? "bg-gold-500" : "bg-elegant-dark border border-cream-400/30"
                }`}
              >
                {isActive && <Text className="text-elegant-dark text-xs font-sans-bold">✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Business Type */}
      <View className="flex-row items-center gap-2 mb-2 mt-2">
        <Utensils size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-sm">Tipo de empresa</Text>
      </View>
      <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-medium text-sm">Negocio de comida</Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">
              {isFoodBusiness
                ? "Stock deshabilitado, galería de imágenes limitada"
                : "Stock habilitado, galería de imágenes extendida"}
            </Text>
          </View>
          <Switch
            value={isFoodBusiness}
            onValueChange={setIsFoodBusiness}
            trackColor={{ false: "#444", true: "#FFC300" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Catalog Mode */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-medium text-sm">Modo catálogo</Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">
              {catalogMode
                ? "Solo muestra productos, sin carrito ni pedidos"
                : "Permite pedidos y carrito de compras"}
            </Text>
          </View>
          <Switch
            value={catalogMode}
            onValueChange={setCatalogMode}
            trackColor={{ false: "#444", true: "#FFC300" }}
            thumbColor="#fff"
          />
        </View>
      </View>

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
          <ActivityIndicator color="#1A1A2E" />
        ) : (
          <Text className="text-elegant-dark font-sans-bold text-base">Guardar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
