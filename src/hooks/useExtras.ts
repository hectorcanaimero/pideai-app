import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

export interface ExtraGroup {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  selection_type: "single" | "multiple";
  is_required: boolean;
  min_selections: number;
  max_selections: number | null;
  display_order: number;
  is_active: boolean;
}

export interface ProductExtra {
  id: string;
  group_id: string | null;
  menu_item_id: string | null;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean | null;
  is_default: boolean;
  display_order: number;
}

const extrasKeys = {
  all: ["extras"] as const,
  groups: (storeId: string) => [...extrasKeys.all, "groups", storeId] as const,
  extras: (groupId: string) => [...extrasKeys.all, "items", groupId] as const,
};

export function useExtraGroups(storeId: string | undefined) {
  return useQuery({
    queryKey: extrasKeys.groups(storeId ?? ""),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extra_groups")
        .select("*")
        .eq("store_id", storeId!)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data ?? []) as ExtraGroup[];
    },
    enabled: !!storeId,
  });
}

export function useGroupExtras(groupId: string | undefined) {
  return useQuery({
    queryKey: extrasKeys.extras(groupId ?? ""),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_extras")
        .select("*")
        .eq("group_id", groupId!)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data ?? []) as ProductExtra[];
    },
    enabled: !!groupId,
  });
}

export function useCreateExtra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      group_id: string;
      name: string;
      price: number;
      description?: string;
    }) => {
      const { error } = await supabase.from("product_extras").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extrasKeys.all });
    },
  });
}

export function useUpdateExtra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      price?: number;
      is_available?: boolean;
    }) => {
      const { error } = await supabase
        .from("product_extras")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extrasKeys.all });
    },
  });
}

export function useDeleteExtra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_extras")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extrasKeys.all });
    },
  });
}

export function useCreateExtraGroup() {
  const queryClient = useQueryClient();
  const { store } = useStore();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      selection_type: "single" | "multiple";
      is_required: boolean;
      min_selections?: number;
      max_selections?: number | null;
      category_id?: string | null;
    }) => {
      const { error } = await supabase.from("extra_groups").insert({
        ...data,
        store_id: store!.id,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extrasKeys.all }),
  });
}

export function useUpdateExtraGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      selection_type?: string;
      is_required?: boolean;
      min_selections?: number;
      max_selections?: number | null;
      is_active?: boolean;
      category_id?: string | null;
    }) => {
      const { error } = await supabase
        .from("extra_groups")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extrasKeys.all }),
  });
}

export function useDeleteExtraGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("extra_groups")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extrasKeys.all }),
  });
}
