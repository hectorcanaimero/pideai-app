import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

export type Period = "today" | "week" | "month";

function getPeriodStart(period: Period): string {
  const now = new Date();
  if (period === "today") {
    now.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    now.setDate(now.getDate() - 7);
  } else {
    now.setDate(now.getDate() - 30);
  }
  return now.toISOString();
}

export function useAnalytics(period: Period) {
  const { store } = useStore();

  return useQuery({
    queryKey: ["analytics", store?.id, period],
    queryFn: async () => {
      const start = getPeriodStart(period);

      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, total_amount, status, order_type, created_at")
        .eq("store_id", store!.id)
        .gte("created_at", start)
        .neq("status", "cancelled");

      if (error) throw error;

      const totalOrders = orders?.length ?? 0;
      const totalRevenue = (orders ?? []).reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Orders by type
      const byType: Record<string, number> = {};
      for (const o of orders ?? []) {
        const t = o.order_type ?? "other";
        byType[t] = (byType[t] ?? 0) + 1;
      }

      // Orders by status
      const byStatus: Record<string, number> = {};
      for (const o of orders ?? []) {
        byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
      }

      // Top products
      const { data: items } = await supabase
        .from("order_items")
        .select("item_name, quantity")
        .in("order_id", (orders ?? []).map((o) => o.id));

      const productMap = new Map<string, number>();
      for (const item of items ?? []) {
        productMap.set(item.item_name, (productMap.get(item.item_name) ?? 0) + item.quantity);
      }

      const topProducts = Array.from(productMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));

      return { totalOrders, totalRevenue, avgOrderValue, byType, byStatus, topProducts };
    },
    enabled: !!store?.id,
  });
}
