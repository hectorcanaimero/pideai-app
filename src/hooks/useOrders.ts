import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";
import type { OrderStatus, OrderWithItems } from "@/lib/orderConstants";

const orderKeys = {
  all: ["orders"] as const,
  list: (storeId: string) => [...orderKeys.all, "list", storeId] as const,
  detail: (orderId: string) => [...orderKeys.all, "detail", orderId] as const,
};

/**
 * Subscribes to realtime order changes ONCE per store.
 * Use this in a single parent component (e.g. OrdersLayout),
 * NOT in every screen that calls useOrders.
 */
export function useOrdersRealtime() {
  const { store } = useStore();
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!store?.id) return;

    // Avoid duplicate subscriptions
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`orders-rt-${store.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `store_id=eq.${store.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: orderKeys.list(store.id) });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [store?.id, queryClient]);
}

export function useOrders(statusFilter?: OrderStatus | null) {
  const { store } = useStore();

  return useQuery({
    queryKey: [...orderKeys.list(store?.id ?? ""), statusFilter],
    queryFn: async () => {
      let q = supabase
        .from("orders")
        .select("*")
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (statusFilter) {
        q = q.eq("status", statusFilter);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as OrderWithItems[];
    },
    enabled: !!store?.id,
    staleTime: 30 * 1000,
  });
}

export function useOrderDetail(orderId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: async () => {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId!)
        .single();

      if (orderError) throw orderError;

      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId!);

      if (itemsError) throw itemsError;

      return { ...order, order_items: items ?? [] } as OrderWithItems;
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { store } = useStore();

  return useMutation({
    mutationFn: async ({ orderId, newStatus, notes }: { orderId: string; newStatus: OrderStatus; notes?: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      await supabase.from("order_status_history").insert({
        order_id: orderId,
        store_id: store!.id,
        to_status: newStatus,
        notes: notes ?? null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
