import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";
import type { OrderStatus, OrderWithItems } from "@/lib/orderConstants";

const orderKeys = {
  all: ["orders"] as const,
  list: (storeId: string) => [...orderKeys.all, "list", storeId] as const,
  detail: (orderId: string) => [...orderKeys.all, "detail", orderId] as const,
};

export function useOrders(statusFilter?: OrderStatus | null) {
  const { store } = useStore();
  const queryClient = useQueryClient();

  const query = useQuery({
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

  useEffect(() => {
    if (!store?.id) return;

    const channel = supabase
      .channel(`orders-${store.id}`)
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [store?.id, queryClient]);

  return query;
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
