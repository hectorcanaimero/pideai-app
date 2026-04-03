import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";

export interface StoreHour {
  id: string;
  store_id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  closes_next_day: boolean;
}

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function getDayName(day: number): string {
  return DAY_NAMES[day] ?? "";
}

export function useStoreHours() {
  const { store } = useStore();

  return useQuery({
    queryKey: ["store-hours", store?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_hours")
        .select("*")
        .eq("store_id", store!.id)
        .order("day_of_week", { ascending: true });

      if (error) throw error;
      return (data ?? []) as StoreHour[];
    },
    enabled: !!store?.id,
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  const { store, reloadStore } = useStore();

  return useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      const { error } = await supabase
        .from("stores")
        .update(updates)
        .eq("id", store!.id);

      if (error) throw error;
    },
    onSuccess: async () => {
      await reloadStore();
    },
  });
}
