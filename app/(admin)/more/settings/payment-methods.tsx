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
import {
  CreditCard,
  Plus,
  X,
  Trash2,
  Edit3,
  Info,
  Smartphone,
  Mail,
  Bitcoin,
  MoreHorizontal,
} from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

type PaymentMethodType = "pago_movil" | "zelle" | "binance" | "otros";

interface PaymentMethod {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  is_active: boolean | null;
  payment_type: PaymentMethodType;
  payment_details: any;
  display_order: number | null;
}

const PAYMENT_TYPES: { key: PaymentMethodType; label: string; icon: any }[] = [
  { key: "pago_movil", label: "Pago Móvil", icon: Smartphone },
  { key: "zelle", label: "Zelle", icon: Mail },
  { key: "binance", label: "Binance", icon: Bitcoin },
  { key: "otros", label: "Otros", icon: MoreHorizontal },
];

const VENEZUELAN_BANKS = [
  { code: "0102", name: "Banco de Venezuela" },
  { code: "0105", name: "Banco Mercantil" },
  { code: "0108", name: "Banco Provincial" },
  { code: "0114", name: "Bancaribe" },
  { code: "0134", name: "Banesco" },
  { code: "0151", name: "BFC" },
  { code: "0156", name: "100% Banco" },
  { code: "0163", name: "Banco del Tesoro" },
  { code: "0166", name: "Banco Agrícola" },
  { code: "0168", name: "Bancrecer" },
  { code: "0169", name: "Mi Banco" },
  { code: "0171", name: "Banco Activo" },
  { code: "0172", name: "Bancamiga" },
  { code: "0174", name: "Banplus" },
  { code: "0175", name: "Banco Bicentenario" },
  { code: "0191", name: "BNC" },
];

export default function PaymentMethodsScreen() {
  const { store } = useStore();
  const queryClient = useQueryClient();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentMethodType>("otros");
  const [isActive, setIsActive] = useState(true);
  // Pago Movil fields
  const [bankCode, setBankCode] = useState("");
  const [cedula, setCedula] = useState("");
  const [pmPhone, setPmPhone] = useState("");
  // Zelle fields
  const [zelleEmail, setZelleEmail] = useState("");
  const [zelleHolder, setZelleHolder] = useState("");
  // Binance fields
  const [binanceKey, setBinanceKey] = useState("");

  // Fetch methods
  const { data: methods, isLoading } = useQuery({
    queryKey: ["payment-methods", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("store_id", store!.id)
        .order("display_order", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as PaymentMethod[];
    },
    enabled: !!store?.id,
  });

  // Create
  const createMethod = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("payment_methods").insert(data);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payment-methods"] }),
  });

  // Update
  const updateMethod = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from("payment_methods").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payment-methods"] }),
  });

  // Delete
  const deleteMethod = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payment_methods").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payment-methods"] }),
  });

  // Toggle active
  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("payment_methods").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payment-methods"] }),
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setPaymentType("otros");
    setIsActive(true);
    setBankCode("");
    setCedula("");
    setPmPhone("");
    setZelleEmail("");
    setZelleHolder("");
    setBinanceKey("");
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (method: PaymentMethod) => {
    setEditing(method);
    setName(method.name);
    setDescription(method.description ?? "");
    setPaymentType(method.payment_type);
    setIsActive(method.is_active !== false);

    const d = method.payment_details ?? {};
    setBankCode(d.bank_code ?? "");
    setCedula(d.cedula ?? "");
    setPmPhone(d.phone ?? "");
    setZelleEmail(d.email ?? "");
    setZelleHolder(d.holder_name ?? "");
    setBinanceKey(d.key ?? "");
    setShowForm(true);
  };

  const buildDetails = () => {
    switch (paymentType) {
      case "pago_movil":
        return { bank_code: bankCode, cedula, phone: pmPhone };
      case "zelle":
        return { email: zelleEmail, holder_name: zelleHolder };
      case "binance":
        return { key: binanceKey };
      default:
        return {};
    }
  };

  const buildName = () => {
    if (name.trim()) return name.trim();
    const labels: Record<PaymentMethodType, string> = {
      pago_movil: "Pago Móvil",
      zelle: "Zelle",
      binance: "Binance",
      otros: "Otro método",
    };
    return labels[paymentType];
  };

  const handleSave = async () => {
    const methodData = {
      name: buildName(),
      description: description.trim() || null,
      payment_type: paymentType,
      payment_details: buildDetails(),
      is_active: isActive,
      store_id: store!.id,
    };

    try {
      if (editing) {
        await updateMethod.mutateAsync({ id: editing.id, ...methodData });
      } else {
        await createMethod.mutateAsync(methodData);
      }
      resetForm();
    } catch {
      Alert.alert("Error", "No se pudo guardar el método de pago");
    }
  };

  const handleDelete = (method: PaymentMethod) => {
    Alert.alert("Eliminar", `¿Eliminar "${method.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteMethod.mutate(method.id),
      },
    ]);
  };

  const getTypeIcon = (type: PaymentMethodType) => {
    const found = PAYMENT_TYPES.find((t) => t.key === type);
    return found ? found.icon : MoreHorizontal;
  };

  const getTypeLabel = (type: PaymentMethodType) => {
    const found = PAYMENT_TYPES.find((t) => t.key === type);
    return found ? found.label : type;
  };

  const getDetailsSummary = (method: PaymentMethod) => {
    const d = method.payment_details;
    if (!d) return null;
    switch (method.payment_type) {
      case "pago_movil": {
        const bank = VENEZUELAN_BANKS.find((b) => b.code === d.bank_code);
        return `${bank?.name ?? d.bank_code} · ${d.cedula} · ${d.phone}`;
      }
      case "zelle":
        return `${d.holder_name} · ${d.email}`;
      case "binance":
        return d.key;
      default:
        return null;
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <CreditCard size={20} color="#FFC300" />
          <Text className="text-white font-sans-bold text-lg">Métodos de pago</Text>
        </View>
        <TouchableOpacity
          className="bg-gold-500 px-3 py-1.5 rounded-lg flex-row items-center gap-1"
          onPress={() => { resetForm(); setShowForm(true); }}
          activeOpacity={0.8}
        >
          <Plus size={14} color="#1A1A2E" />
          <Text className="text-elegant-dark font-sans-bold text-xs">Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-start gap-1.5 mb-4">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          Agregá los métodos de pago que aceptás. Tus clientes verán esta información al momento de pagar.
        </Text>
      </View>

      {/* Create/Edit Form */}
      {showForm && (
        <View className="bg-elegant-gray rounded-2xl p-4 mb-4 border border-gold-500/30">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gold-500 font-sans-semibold text-sm">
              {editing ? "Editar método" : "Nuevo método"}
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <X size={18} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Payment type selector */}
          <Text className="text-cream-300 font-sans text-xs mb-2">Tipo</Text>
          <View className="flex-row gap-2 mb-4">
            {PAYMENT_TYPES.map((type) => {
              const isSelected = paymentType === type.key;
              const Icon = type.icon;
              return (
                <TouchableOpacity
                  key={type.key}
                  className={`flex-1 py-2.5 rounded-xl items-center gap-1 ${
                    isSelected ? "bg-gold-500" : "bg-elegant-dark"
                  }`}
                  onPress={() => setPaymentType(type.key)}
                  activeOpacity={0.7}
                >
                  <Icon size={14} color={isSelected ? "#1A1A2E" : "#888"} />
                  <Text
                    className={`font-sans-medium text-[10px] ${
                      isSelected ? "text-elegant-dark" : "text-cream-400"
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Name */}
          <Text className="text-cream-300 font-sans text-xs mb-1">
            Nombre (opcional, se autogenera)
          </Text>
          <TextInput
            className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
            value={name}
            onChangeText={setName}
            placeholder={getTypeLabel(paymentType)}
            placeholderTextColor="#666"
          />

          {/* Type-specific fields */}
          {paymentType === "pago_movil" && (
            <>
              <Text className="text-cream-300 font-sans text-xs mb-1">Banco</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6, paddingBottom: 4 }}
                className="mb-3"
              >
                {VENEZUELAN_BANKS.map((bank) => (
                  <TouchableOpacity
                    key={bank.code}
                    className={`px-3 py-2 rounded-lg ${
                      bankCode === bank.code ? "bg-gold-500" : "bg-elegant-dark"
                    }`}
                    onPress={() => setBankCode(bank.code)}
                  >
                    <Text
                      className={`font-sans text-xs ${
                        bankCode === bank.code ? "text-elegant-dark font-sans-medium" : "text-cream-300"
                      }`}
                    >
                      {bank.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text className="text-cream-300 font-sans text-xs mb-1">Cédula</Text>
              <TextInput
                className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
                value={cedula}
                onChangeText={setCedula}
                placeholder="V-12345678"
                placeholderTextColor="#666"
              />

              <Text className="text-cream-300 font-sans text-xs mb-1">Teléfono</Text>
              <TextInput
                className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
                value={pmPhone}
                onChangeText={setPmPhone}
                placeholder="0412-1234567"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            </>
          )}

          {paymentType === "zelle" && (
            <>
              <Text className="text-cream-300 font-sans text-xs mb-1">Email de Zelle</Text>
              <TextInput
                className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
                value={zelleEmail}
                onChangeText={setZelleEmail}
                placeholder="tu@email.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text className="text-cream-300 font-sans text-xs mb-1">Titular</Text>
              <TextInput
                className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
                value={zelleHolder}
                onChangeText={setZelleHolder}
                placeholder="Nombre del titular"
                placeholderTextColor="#666"
              />
            </>
          )}

          {paymentType === "binance" && (
            <>
              <Text className="text-cream-300 font-sans text-xs mb-1">Binance Pay ID / Email</Text>
              <TextInput
                className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
                value={binanceKey}
                onChangeText={setBinanceKey}
                placeholder="ID o email de Binance"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
            </>
          )}

          {/* Description */}
          <Text className="text-cream-300 font-sans text-xs mb-1">
            Descripción / Instrucciones
          </Text>
          <TextInput
            className="bg-elegant-dark text-white px-3 py-2.5 rounded-xl font-sans text-sm mb-3"
            value={description}
            onChangeText={setDescription}
            placeholder="Instrucciones para el cliente"
            placeholderTextColor="#666"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />

          {/* Active */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-cream-300 font-sans text-xs">Activo</Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#444", true: "#FFC300" }}
              thumbColor="#fff"
            />
          </View>

          {/* Save button */}
          <TouchableOpacity
            className="bg-gold-500 py-2.5 rounded-xl items-center"
            onPress={handleSave}
            disabled={createMethod.isPending || updateMethod.isPending}
            activeOpacity={0.8}
          >
            <Text className="text-elegant-dark font-sans-bold text-sm">
              {createMethod.isPending || updateMethod.isPending
                ? "Guardando..."
                : editing
                ? "Actualizar"
                : "Crear método"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Methods List */}
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFC300" />
      ) : methods && methods.length > 0 ? (
        methods.map((method) => {
          const Icon = getTypeIcon(method.payment_type);
          const details = getDetailsSummary(method);

          return (
            <View
              key={method.id}
              className={`bg-elegant-gray rounded-xl p-4 mb-2 ${
                method.is_active === false ? "opacity-50" : ""
              }`}
            >
              <View className="flex-row items-start">
                <View className="w-9 h-9 rounded-full bg-gold-500/15 items-center justify-center mr-3 mt-0.5">
                  <Icon size={16} color="#FFC300" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-white font-sans-medium text-sm flex-1">
                      {method.name}
                    </Text>
                    <Switch
                      value={method.is_active !== false}
                      onValueChange={(val) =>
                        toggleActive.mutate({ id: method.id, is_active: val })
                      }
                      trackColor={{ false: "#444", true: "#FFC300" }}
                      thumbColor="#fff"
                    />
                  </View>
                  <Text className="text-cream-400 font-sans text-xs mt-0.5">
                    {getTypeLabel(method.payment_type)}
                  </Text>
                  {details && (
                    <Text className="text-cream-400/70 font-sans text-xs mt-1" numberOfLines={2}>
                      {details}
                    </Text>
                  )}
                  {method.description && (
                    <Text className="text-cream-400/50 font-sans text-xs mt-1 italic" numberOfLines={1}>
                      {method.description}
                    </Text>
                  )}
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row justify-end gap-2 mt-2 pt-2 border-t border-elegant-dark">
                <TouchableOpacity
                  className="flex-row items-center gap-1 px-3 py-1.5"
                  onPress={() => startEdit(method)}
                >
                  <Edit3 size={13} color="#FFC300" />
                  <Text className="text-gold-500 font-sans text-xs">Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center gap-1 px-3 py-1.5"
                  onPress={() => handleDelete(method)}
                >
                  <Trash2 size={13} color="#EF4444" />
                  <Text className="text-red-400 font-sans text-xs">Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      ) : (
        <View className="bg-elegant-gray rounded-xl p-6 items-center">
          <CreditCard size={32} color="#444" />
          <Text className="text-cream-400 font-sans text-sm mt-3">
            No hay métodos de pago configurados
          </Text>
          <Text className="text-cream-400/60 font-sans text-xs mt-1 text-center">
            Tus clientes necesitan saber cómo pagarte. Tocá "Nuevo" para agregar uno.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
