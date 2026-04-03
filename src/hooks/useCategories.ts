import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
  store_id: string;
  created_at: string | null;
  product_count?: number;
}

const categoryKeys = {
  all: ["categories"] as const,
  list: (storeId: string) => [...categoryKeys.all, "list", storeId] as const,
};

export function useCategories() {
  const { store } = useStore();

  return useQuery({
    queryKey: categoryKeys.list(store?.id ?? ""),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*, menu_items(count)")
        .eq("store_id", store!.id)
        .order("display_order", { ascending: true, nullsFirst: false });

      if (error) throw error;

      return (data ?? []).map((cat: any) => ({
        ...cat,
        product_count: cat.menu_items?.[0]?.count ?? 0,
      })) as Category[];
    },
    enabled: !!store?.id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { store } = useStore();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name, description: description || null, store_id: store!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description?: string }) => {
      const { error } = await supabase
        .from("categories")
        .update({ name, description: description || null })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
