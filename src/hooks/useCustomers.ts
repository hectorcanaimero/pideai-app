import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  order_count: number;
  total_spent: number;
  last_order_at: string | null;
}

const customerKeys = {
  all: ["customers"] as const,
  list: (storeId: string) => [...customerKeys.all, "list", storeId] as const,
  detail: (customerId: string) =>
    [...customerKeys.all, "detail", customerId] as const,
};

export function useCustomers(search?: string) {
  const { store } = useStore();

  return useQuery({
    queryKey: [...customerKeys.list(store?.id ?? ""), search],
    queryFn: async () => {
      // Get all orders for this store with customer info
      const { data: orders, error } = await supabase
        .from("orders")
        .select(
          "customer_name, customer_email, customer_phone, customer_id, total_amount, created_at"
        )
        .eq("store_id", store!.id)
        .neq("status", "cancelled");

      if (error) throw error;

      // Aggregate by email (deduplicate)
      const customerMap = new Map<string, Customer>();

      for (const order of orders ?? []) {
        const key =
          order.customer_email?.toLowerCase() ??
          order.customer_phone ??
          order.customer_name;
        const existing = customerMap.get(key);

        if (existing) {
          existing.order_count += 1;
          existing.total_spent += order.total_amount ?? 0;
          if (
            order.created_at &&
            (!existing.last_order_at ||
              order.created_at > existing.last_order_at)
          ) {
            existing.last_order_at = order.created_at;
          }
        } else {
          customerMap.set(key, {
            id: order.customer_id ?? key,
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            country: null,
            order_count: 1,
            total_spent: order.total_amount ?? 0,
            last_order_at: order.created_at,
          });
        }
      }

      let customers = Array.from(customerMap.values()).sort((a, b) =>
        (b.last_order_at ?? "").localeCompare(a.last_order_at ?? "")
      );

      // Apply search filter
      if (search?.trim()) {
        const q = search.toLowerCase();
        customers = customers.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.phone?.includes(q)
        );
      }

      return customers;
    },
    enabled: !!store?.id,
  });
}

export function useCustomerOrders(email: string | undefined) {
  const { store } = useStore();

  return useQuery({
    queryKey: customerKeys.detail(email ?? ""),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total_amount, status, order_type, created_at")
        .eq("store_id", store!.id)
        .eq("customer_email", email!)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!store?.id && !!email,
  });
}
