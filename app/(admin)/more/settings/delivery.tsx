import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Truck, Info, Gift, MapPin, DollarSign } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

type DeliveryPriceMode = "fixed" | "by_zone";

export default function DeliverySettingsScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [estimatedTime, setEstimatedTime] = useState("");
  const [priceMode, setPriceMode] = useState<DeliveryPriceMode>("fixed");
  const [fixedPrice, setFixedPrice] = useState("");
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(false);
  const [freeDeliveryMinAmount, setFreeDeliveryMinAmount] = useState("");

  useEffect(() => {
    if (store) {
      const s = store as any;
      setEstimatedTime(String(s.estimated_delivery_time ?? ""));
      setPriceMode((s.delivery_price_mode as DeliveryPriceMode) ?? "fixed");
      setFixedPrice(String(s.fixed_delivery_price ?? ""));
      setFreeDeliveryEnabled(s.free_delivery_enabled === true);
      setFreeDeliveryMinAmount(String(s.global_free_delivery_min_amount ?? ""));
    }
  }, [store]);

  const currency = (store as any)?.currency ?? "USD";

  const handleSave = async () => {
    if (freeDeliveryEnabled && !freeDeliveryMinAmount.trim()) {
      Alert.alert("Error", "Ingresá el monto mínimo para envío gratis");
      return;
    }

    try {
      await updateStore.mutateAsync({
        estimated_delivery_time: parseInt(estimatedTime) || null,
        delivery_price_mode: priceMode,
        fixed_delivery_price: priceMode === "fixed" ? parseFloat(fixedPrice) || 0 : null,
        free_delivery_enabled: freeDeliveryEnabled,
        global_free_delivery_min_amount: freeDeliveryEnabled
          ? parseFloat(freeDeliveryMinAmount) || null
          : null,
      });
      Alert.alert("Guardado", "Configuración de entrega actualizada");
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
        <Truck size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Entrega</Text>
      </View>

      {/* Estimated delivery time */}
      <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
        Tiempo estimado de entrega (minutos)
      </Text>
      <TextInput
        className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-2"
        value={estimatedTime}
        onChangeText={setEstimatedTime}
        keyboardType="number-pad"
        placeholder="30"
        placeholderTextColor="#666"
      />
      <View className="flex-row items-start gap-1.5 mb-6">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Tiempo aproximado que se le muestra al cliente cuando hace un pedido de delivery.
        </Text>
      </View>

      {/* Delivery price mode */}
      <View className="flex-row items-center gap-2 mb-3">
        <DollarSign size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-sm">Modo de precio de entrega</Text>
      </View>

      <View className="flex-row gap-2 mb-2">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl items-center ${
            priceMode === "fixed" ? "bg-gold-500" : "bg-elegant-gray"
          }`}
          onPress={() => setPriceMode("fixed")}
          activeOpacity={0.7}
        >
          <Text
            className={`font-sans-medium text-sm ${
              priceMode === "fixed" ? "text-elegant-dark" : "text-cream-300"
            }`}
          >
            Precio fijo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl items-center ${
            priceMode === "by_zone" ? "bg-gold-500" : "bg-elegant-gray"
          }`}
          onPress={() => setPriceMode("by_zone")}
          activeOpacity={0.7}
        >
          <Text
            className={`font-sans-medium text-sm ${
              priceMode === "by_zone" ? "text-elegant-dark" : "text-cream-300"
            }`}
          >
            Por zona
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-start gap-1.5 mb-4">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          {priceMode === "fixed"
            ? "Se cobra el mismo precio de envío para todos los pedidos."
            : "El precio de envío depende de la zona del cliente. Configurá las zonas desde el panel web."}
        </Text>
      </View>

      {/* Fixed price input */}
      {priceMode === "fixed" && (
        <>
          <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
            Precio fijo de envío ({currency})
          </Text>
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3 rounded-xl font-sans text-base mb-2"
            value={fixedPrice}
            onChangeText={setFixedPrice}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="#666"
          />
          <View className="flex-row items-start gap-1.5 mb-4">
            <Info size={12} color="#888" style={{ marginTop: 2 }} />
            <Text className="text-cream-400/60 font-sans text-xs flex-1">
              Este monto se suma automáticamente al total del pedido en órdenes de delivery.
            </Text>
          </View>
        </>
      )}

      {/* By zone info */}
      {priceMode === "by_zone" && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-4 flex-row items-start gap-3">
          <MapPin size={18} color="#FFC300" style={{ marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-white font-sans-medium text-sm">Zonas de envío</Text>
            <Text className="text-cream-400 font-sans text-xs mt-1">
              Las zonas de envío se configuran desde el panel web. Cada zona tiene su propio precio
              y opción de envío gratis.
            </Text>
          </View>
        </View>
      )}

      {/* Free delivery */}
      <View className="flex-row items-center gap-2 mb-3 mt-2">
        <Gift size={16} color="#FFC300" />
        <Text className="text-white font-sans-semibold text-sm">Envío gratis</Text>
      </View>

      <View className="bg-elegant-gray rounded-2xl p-4 mb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-sans-medium text-sm">Habilitar envío gratis</Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">
              Envío sin costo cuando el pedido supera un monto mínimo
            </Text>
          </View>
          <Switch
            value={freeDeliveryEnabled}
            onValueChange={setFreeDeliveryEnabled}
            trackColor={{ false: "#444", true: "#FFC300" }}
            thumbColor="#fff"
          />
        </View>

        {freeDeliveryEnabled && (
          <View className="mt-4 pt-4 border-t border-elegant-dark">
            <Text className="text-cream-300 font-sans-medium text-sm mb-1.5">
              Monto mínimo para envío gratis ({currency})
            </Text>
            <TextInput
              className="bg-elegant-dark text-white px-4 py-2.5 rounded-xl font-sans text-sm"
              value={freeDeliveryMinAmount}
              onChangeText={setFreeDeliveryMinAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#666"
            />
          </View>
        )}
      </View>

      <View className="flex-row items-start gap-1.5 mb-6">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          {freeDeliveryEnabled
            ? `Los clientes con pedidos mayores a ${currency} ${freeDeliveryMinAmount || "0"} no pagan envío.`
            : "Cuando está deshabilitado, todos los pedidos de delivery tienen costo de envío."}
        </Text>
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
