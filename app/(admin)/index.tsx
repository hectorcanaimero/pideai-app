import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react-native";
import { useStore } from "@/contexts/StoreContext";
import { supabase } from "@/services/supabase";
import { StatCard } from "@/components/dashboard/StatCard";
import { StoreStatusToggle } from "@/components/dashboard/StoreStatusToggle";

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalProducts: number;
}

export default function DashboardScreen() {
  const { store } = useStore();
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    if (!store?.id) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { data: todayOrders } = await supabase
        .from("orders")
        .select("id, total_amount, status")
        .eq("store_id", store.id)
        .gte("created_at", todayISO)
        .neq("status", "cancelled");

      const { count: pendingCount } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("store_id", store.id)
        .in("status", ["pending", "confirmed"]);

      const { count: productCount } = await supabase
        .from("menu_items")
        .select("id", { count: "exact", head: true })
        .eq("store_id", store.id);

      const revenue = (todayOrders ?? []).reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      setStats({
        todayOrders: todayOrders?.length ?? 0,
        todayRevenue: revenue,
        pendingOrders: pendingCount ?? 0,
        totalProducts: productCount ?? 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [store?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    const currency = store?.currency || "USD";
    return `${currency} ${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark">
        <ActivityIndicator size="large" color="#FFC300" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#FFC300"
          colors={["#FFC300"]}
        />
      }
    >
      <View className="mb-6">
        <Text className="text-2xl font-sans-bold text-white">Hola!</Text>
        <Text className="text-cream-400 font-sans mt-1">{store?.name ?? "Mi Tienda"}</Text>
      </View>

      <View className="mb-4">
        <StoreStatusToggle />
      </View>

      <View className="flex-row flex-wrap gap-3 mb-4">
        <StatCard
          icon={<ShoppingBag size={16} color="#FFC300" />}
          label="Pedidos hoy"
          value={String(stats.todayOrders)}
        />
        <StatCard
          icon={<DollarSign size={16} color="#22C55E" />}
          label="Ventas hoy"
          value={formatCurrency(stats.todayRevenue)}
        />
      </View>

      <View className="flex-row flex-wrap gap-3">
        <StatCard
          icon={<TrendingUp size={16} color="#F59E0B" />}
          label="Pendientes"
          value={String(stats.pendingOrders)}
          subtitle="pedidos por atender"
        />
        <StatCard
          icon={<Package size={16} color="#8B5CF6" />}
          label="Productos"
          value={String(stats.totalProducts)}
          subtitle="en tu catalogo"
        />
      </View>
    </ScrollView>
  );
}
