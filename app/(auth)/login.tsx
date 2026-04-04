import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Ingresá email y contraseña");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      router.replace("/(admin)");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-elegant-dark"
    >
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-12">
          <Text className="text-4xl font-sans-bold text-gold-500">PideAI</Text>
          <Text className="text-base font-sans text-cream-200 mt-2">
            Panel Administrativo
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-sans-medium text-cream-300 mb-2">
            Email
          </Text>
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3.5 rounded-xl font-sans text-base"
            placeholder="tu@email.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-sans-medium text-cream-300 mb-2">
            Contraseña
          </Text>
          <TextInput
            className="bg-elegant-gray text-white px-4 py-3.5 rounded-xl font-sans text-base"
            placeholder="••••••••"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <TouchableOpacity
          className={`py-4 rounded-xl items-center ${
            loading ? "bg-gold-700" : "bg-gold-500"
          }`}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#1A1A1A" />
          ) : (
            <Text className="text-elegant-dark font-sans-bold text-base">
              Iniciar Sesión
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
