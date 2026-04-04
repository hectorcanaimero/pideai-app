import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

export interface AppNotification {
  id: string;
  store_id: string;
  title: string;
  body: string;
  type: "new_order" | "order_status" | "low_stock" | "payment" | "system";
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

const notificationKeys = {
  all: ["notifications"] as const,
  list: (storeId: string) => [...notificationKeys.all, "list", storeId] as const,
  unreadCount: (storeId: string) => [...notificationKeys.all, "unread", storeId] as const,
};

export function useNotifications() {
  const { store } = useStore();

  return useQuery({
    queryKey: notificationKeys.list(store?.id ?? ""),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data ?? []) as AppNotification[];
    },
    enabled: !!store?.id,
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  const { store } = useStore();

  return useQuery({
    queryKey: notificationKeys.unreadCount(store?.id ?? ""),
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("store_id", store!.id)
        .eq("is_read", false);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!store?.id,
    refetchInterval: 15_000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { store } = useStore();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      if (store?.id) {
        queryClient.invalidateQueries({ queryKey: notificationKeys.list(store.id) });
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(store.id) });
      }
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { store } = useStore();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("store_id", store!.id)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      if (store?.id) {
        queryClient.invalidateQueries({ queryKey: notificationKeys.list(store.id) });
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(store.id) });
      }
    },
  });
}
