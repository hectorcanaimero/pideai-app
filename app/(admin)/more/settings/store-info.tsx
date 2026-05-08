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
  { key: "pickup", label: "Entrega en Tienda", icon: "🏪" },
];

type BusinessType = "restaurant" | "store" | "catalog";

const BUSINESS_TYPES: { key: BusinessType; label: string; description: string; icon: string }[] = [
  {
    key: "restaurant",
    label: "Restaurante / Comida",
    description: "Pedidos online con delivery o retiro. Stock deshabilitado.",
    icon: "🍽️",
  },
  {
    key: "store",
    label: "Tienda / Comercio",
    description: "Productos con stock, pedidos y delivery o retiro.",
    icon: "🏪",
  },
  {
    key: "catalog",
    label: "Catálogo digital",
    description: "Solo muestra productos, sin delivery ni pedidos.",
    icon: "📖",
  },
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
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const [operatingModes, setOperatingModes] = useState<string[]>([]);
  const [hideCatalogPrices, setHideCatalogPrices] = useState(false);

  const isCatalog = businessType === "catalog";

  function deriveBusinessType(s: { is_food_business: boolean; catalog_mode: boolean }): BusinessType {
    if (s.catalog_mode) return "catalog";
    if (s.is_food_business) return "restaurant";
    return "store";
  }

  useEffect(() => {
    if (store) {
      setName(store.name ?? "");
      setEmail((store as any).email ?? "");
      setPhone((store as any).phone ?? "");
      setAddress((store as any).address ?? "");
      setCountry((store as any).country ?? "");
      setCurrency((store as any).currency ?? "USD");
      setBusinessType(deriveBusinessType(store));
      setOperatingModes(store.operating_modes ?? []);
      setHideCatalogPrices((store as any).hide_catalog_prices === true);
    }
  }, [store]);

  const toggleOperatingMode = (mode: string) => {
    setOperatingModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const needsPhysicalAddress =
    !isCatalog && (operatingModes.includes("delivery") || operatingModes.includes("pickup"));

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre es requerido");
      return;
    }

    if (needsPhysicalAddress && !address.trim()) {
      Alert.alert("Error", "La dirección es requerida para tiendas con delivery o entrega en tienda");
      return;
    }

    try {
      const catalogMode = businessType === "catalog";
      const isFoodBusiness = businessType === "restaurant";
      await updateStore.mutateAsync({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        country: country || null,
        currency,
        is_food_business: isFoodBusiness,
        catalog_mode: catalogMode,
        operating_modes: catalogMode ? null : (operatingModes.length > 0 ? operatingModes : null),
        hide_catalog_prices: catalogMode ? hideCatalogPrices : false,
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
        <Store size={20} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-bold text-xl">Información de la tienda</Text>
      </View>

      {/* Basic Info */}
      <Text className="text-cream-300 font-sans-medium text-base mb-1.5">Nombre de la tienda *</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-cream-300 font-sans-medium text-base mb-1.5">Email</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="text-cream-300 font-sans-medium text-base mb-1.5">Teléfono</Text>
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text className="text-cream-300 font-sans-medium text-base mb-1.5">
        Dirección {needsPhysicalAddress ? "*" : "(opcional)"}
      </Text>
      {!needsPhysicalAddress && (
        <Text className="text-cream-400 font-sans text-sm mb-1.5">
          Tu tienda es virtual/online, no necesita dirección física
        </Text>
      )}
      <TextInput
        className="bg-elegant-gray text-text-primary px-4 py-3 rounded-xl font-sans text-base mb-4"
        value={address}
        onChangeText={setAddress}
        placeholder={needsPhysicalAddress ? "Dirección de tu tienda" : "Opcional"}
        placeholderTextColor="#666"
      />

      {/* Country */}
      <View className="flex-row items-center gap-2 mb-2 mt-2">
        <Globe size={16} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-semibold text-lg">País</Text>
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
              className={`font-sans-medium text-base ${
                country === c.code ? "text-text-inverted" : "text-cream-300"
              }`}
            >
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Currency */}
      <View className="flex-row items-center gap-2 mb-2">
        <DollarSign size={16} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-semibold text-lg">Moneda</Text>
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
              className={`font-sans-medium text-base ${
                currency === c ? "text-text-inverted" : "text-cream-300"
              }`}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Business Type */}
      <View className="flex-row items-center gap-2 mb-2 mt-2">
        <Utensils size={16} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-semibold text-lg">Tipo de negocio</Text>
      </View>
      <View className="gap-2 mb-4">
        {BUSINESS_TYPES.map((bt) => {
          const isActive = businessType === bt.key;
          return (
            <TouchableOpacity
              key={bt.key}
              className={`flex-row items-center justify-between px-4 py-3.5 rounded-xl ${
                isActive ? "bg-gold-500/15 border border-gold-500/30" : "bg-elegant-gray"
              }`}
              onPress={() => setBusinessType(bt.key)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-xl">{bt.icon}</Text>
                <View className="flex-1">
                  <Text
                    className={`font-sans-medium text-base ${
                      isActive ? "text-gold-500" : "text-cream-300"
                    }`}
                  >
                    {bt.label}
                  </Text>
                  <Text className="text-cream-400 font-sans text-xs mt-0.5">{bt.description}</Text>
                </View>
              </View>
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  isActive ? "bg-gold-500" : "bg-elegant-dark border border-cream-400/30"
                }`}
              >
                {isActive && <Text className="text-text-inverted text-xs font-sans-bold">✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Hide prices — only when catalog type is selected */}
      {isCatalog && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-sans-medium text-base">Ocultar precios</Text>
              <Text className="text-cream-400 font-sans text-sm mt-0.5">
                No mostrar precios en el catálogo
              </Text>
            </View>
            <Switch
              value={hideCatalogPrices}
              onValueChange={setHideCatalogPrices}
              trackColor={{ false: "#444", true: "#EB1C8D" }}
              thumbColor="#fff"
            />
          </View>
        </View>
      )}

      {/* Operating Modes — hidden for catalog type */}
      {!isCatalog && (
        <>
          <View className="flex-row items-center gap-2 mb-2 mt-2">
            <ShoppingBag size={16} color="#EB1C8D" />
            <Text className="text-text-primary font-sans-semibold text-lg">Modos de funcionamiento</Text>
          </View>
          <View className="gap-2 mb-6">
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
                      className={`font-sans-medium text-base ${
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
                    {isActive && <Text className="text-text-inverted text-xs font-sans-bold">✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

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
          <Text className="text-text-inverted font-sans-bold text-lg">Guardar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
