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
  detail: (identifier: string) =>
    [...customerKeys.all, "detail", identifier] as const,
};

/**
 * Normalizes a phone number by removing all non-digit characters.
 * This ensures "0412-1234567", "+58 412 1234567", and "04121234567"
 * all map to the same customer.
 */
function normalizePhone(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 ? digits : null;
}

export function useCustomers(search?: string) {
  const { store } = useStore();

  return useQuery({
    queryKey: [...customerKeys.list(store?.id ?? ""), search],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(
          "customer_name, customer_email, customer_phone, customer_id, total_amount, created_at"
        )
        .eq("store_id", store!.id)
        .neq("status", "cancelled");

      if (error) throw error;

      // Aggregate by PHONE (primary key for deduplication)
      // Fallback to email if no phone, then to name as last resort
      const customerMap = new Map<string, Customer>();

      for (const order of orders ?? []) {
        const phone = normalizePhone(order.customer_phone);
        const key =
          phone ??
          order.customer_email?.toLowerCase() ??
          order.customer_name;

        const existing = customerMap.get(key);

        if (existing) {
          existing.order_count += 1;
          existing.total_spent += order.total_amount ?? 0;
          // Keep the most recent name/email (customer may update their info)
          if (
            order.created_at &&
            (!existing.last_order_at || order.created_at > existing.last_order_at)
          ) {
            existing.last_order_at = order.created_at;
            existing.name = order.customer_name || existing.name;
            existing.email = order.customer_email || existing.email;
          }
        } else {
          customerMap.set(key, {
            id: key,
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

/**
 * Fetches orders for a specific customer.
 * Uses phone as primary identifier, falls back to email.
 */
export function useCustomerOrders(
  phone: string | null | undefined,
  email: string | undefined
) {
  const { store } = useStore();
  const normalizedPhone = normalizePhone(phone ?? null);

  return useQuery({
    queryKey: customerKeys.detail(normalizedPhone ?? email ?? ""),
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("id, total_amount, status, order_type, created_at")
        .eq("store_id", store!.id)
        .order("created_at", { ascending: false })
        .limit(20);

      // Prefer phone match, fallback to email
      if (normalizedPhone) {
        // Use ilike to match phone numbers with different formats
        query = query.ilike("customer_phone", `%${normalizedPhone.slice(-7)}%`);
      } else if (email) {
        query = query.eq("customer_email", email);
      } else {
        return [];
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!store?.id && !!(normalizedPhone || email),
  });
}
