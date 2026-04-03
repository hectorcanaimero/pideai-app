import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  store_id: string;
  image_url: string | null;
  is_available: boolean | null;
  is_featured: boolean | null;
  display_order: number | null;
  track_stock: boolean;
  stock_quantity: number | null;
  stock_minimum: number | null;
  created_at: string | null;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category_id: string | null;
  image_url?: string | null;
  is_available?: boolean;
  track_stock?: boolean;
  stock_quantity?: number | null;
  stock_minimum?: number | null;
}

const productKeys = {
  all: ["products"] as const,
  byCategory: (categoryId: string) =>
    [...productKeys.all, "category", categoryId] as const,
  detail: (productId: string) =>
    [...productKeys.all, "detail", productId] as const,
};

export function useProductsByCategory(categoryId: string | undefined) {
  const { store } = useStore();

  return useQuery({
    queryKey: productKeys.byCategory(categoryId ?? ""),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("store_id", store!.id)
        .eq("category_id", categoryId!)
        .order("display_order", { ascending: true, nullsFirst: false });

      if (error) throw error;
      return (data ?? []) as Product[];
    },
    enabled: !!store?.id && !!categoryId,
  });
}

export function useProductDetail(productId: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(productId ?? ""),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("id", productId!)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { store } = useStore();

  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      const { data: product, error } = await supabase
        .from("menu_items")
        .insert({ ...data, store_id: store!.id })
        .select()
        .single();

      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<Product> & { id: string }) => {
      const { error } = await supabase
        .from("menu_items")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);
      if (error) {
        if (error.code === "23503") {
          throw new Error("REFERENCED");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      is_available,
    }: {
      id: string;
      is_available: boolean;
    }) => {
      const { error } = await supabase
        .from("menu_items")
        .update({ is_available })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
