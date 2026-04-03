import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";
import { Store } from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useUpdateStore } from "@/hooks/useStoreSettings";

export default function StoreInfoScreen() {
  const { store } = useStore();
  const updateStore = useUpdateStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (store) {
      setName(store.name ?? "");
      setEmail((store as any).email ?? "");
      setPhone((store as any).phone ?? "");
      setAddress((store as any).address ?? "");
    }
  }, [store]);

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
      });
      Alert.alert("Guardado", "Información actualizada");
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <ScrollView className="flex-1 bg-elegant-dark" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="flex-row items-center gap-2 mb-6">
        <Store size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">Información de la tienda</Text>
      </View>

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

      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${updateStore.isPending ? "bg-gold-700" : "bg-gold-500"}`}
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
