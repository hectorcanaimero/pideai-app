import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { TrendingUp, RefreshCw } from "lucide-react-native";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

interface RateData {
  rate: number;
  lastUpdate: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ExchangeRateWidget() {
  const { store } = useStore();
  const [usdRate, setUsdRate] = useState<RateData | null>(null);
  const [eurRate, setEurRate] = useState<RateData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const enabled = store?.enable_currency_conversion;

  const loadRates = useCallback(async () => {
    if (!store?.id || !enabled) return;

    try {
      // Fetch USD rate
      const { data: usdData } = await supabase
        .from("exchange_rates")
        .select("rate, last_updated")
        .eq("from_currency", "USD")
        .eq("to_currency", "VES")
        .eq("store_id", store.id)
        .order("last_updated", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (usdData) {
        setUsdRate({ rate: usdData.rate, lastUpdate: usdData.last_updated });
      }

      // Fetch EUR rate
      const { data: eurData } = await supabase
        .from("exchange_rates")
        .select("rate, last_updated")
        .eq("from_currency", "EUR")
        .eq("to_currency", "VES")
        .eq("store_id", store.id)
        .order("last_updated", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (eurData) {
        setEurRate({ rate: eurData.rate, lastUpdate: eurData.last_updated });
      }
    } catch (err) {
      console.error("Error loading exchange rates:", err);
    } finally {
      setLoaded(true);
    }
  }, [store?.id, enabled]);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const handleRefresh = async () => {
    if (!store?.id) return;
    setIsRefreshing(true);

    try {
      // Read from local_currency table (maintained by external cron)
      const { data: currencies, error } = await supabase
        .from("local_currency")
        .select("id, dolar")
        .in("id", [1, 2]);

      if (error || !currencies || currencies.length === 0) {
        Alert.alert("Error", "No se pudo obtener la tasa del BCV");
        return;
      }

      const usdValue = currencies.find((c: any) => c.id === 1)?.dolar;
      const eurValue = currencies.find((c: any) => c.id === 2)?.dolar;

      // Upsert into exchange_rates
      if (usdValue) {
        await supabase.from("exchange_rates").upsert(
          {
            from_currency: "USD",
            to_currency: "VES",
            rate: usdValue,
            source: "bcv_auto",
            store_id: store.id,
          },
          { onConflict: "from_currency,to_currency,store_id" }
        );
      }

      if (eurValue) {
        await supabase.from("exchange_rates").upsert(
          {
            from_currency: "EUR",
            to_currency: "VES",
            rate: eurValue,
            source: "bcv_auto",
            store_id: store.id,
          },
          { onConflict: "from_currency,to_currency,store_id" }
        );
      }

      await loadRates();
      Alert.alert("Actualizado", `USD: ${usdValue?.toFixed(2)} Bs`);
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar la tasa");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!enabled || !loaded) return null;

  return (
    <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <TrendingUp size={18} color="#EB1C8D" />
          <Text className="text-white font-sans-semibold text-base">Tasa BCV</Text>
        </View>
        <TouchableOpacity
          className="bg-elegant-dark p-2 rounded-lg"
          onPress={handleRefresh}
          disabled={isRefreshing}
          activeOpacity={0.7}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#EB1C8D" />
          ) : (
            <RefreshCw size={16} color="#EB1C8D" />
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-3">
        {/* USD Rate */}
        <View className="flex-1 bg-elegant-dark rounded-xl p-3">
          <Text className="text-cream-400 font-sans text-xs mb-1">USD</Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-white font-sans-bold text-2xl">
              {usdRate ? usdRate.rate.toFixed(2) : "—"}
            </Text>
            <Text className="text-cream-400 font-sans text-xs">Bs</Text>
          </View>
          {usdRate && (
            <Text className="text-cream-400/60 font-sans text-[10px] mt-1">
              {formatDate(usdRate.lastUpdate)}
            </Text>
          )}
        </View>

        {/* EUR Rate */}
        {eurRate && (
          <View className="flex-1 bg-elegant-dark rounded-xl p-3">
            <Text className="text-cream-400 font-sans text-xs mb-1">EUR</Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-white font-sans-bold text-2xl">
                {eurRate.rate.toFixed(2)}
              </Text>
              <Text className="text-cream-400 font-sans text-xs">Bs</Text>
            </View>
            <Text className="text-cream-400/60 font-sans text-[10px] mt-1">
              {formatDate(eurRate.lastUpdate)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
