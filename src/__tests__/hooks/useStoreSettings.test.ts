import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { supabase } from "@/services/supabase";

jest.mock("@/contexts/StoreContext", () => ({
  useStore: () => ({
    store: { id: "store-123", name: "Test Store", owner_id: "user-1" },
    loading: false,
    isStoreOwner: true,
    reloadStore: jest.fn(),
  }),
}));

import { useStoreHours, useUpdateStore, getDayName } from "@/hooks/useStoreSettings";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("getDayName", () => {
  it("returns correct day names in Spanish", () => {
    expect(getDayName(0)).toBe("Domingo");
    expect(getDayName(1)).toBe("Lunes");
    expect(getDayName(2)).toBe("Martes");
    expect(getDayName(3)).toBe("Miércoles");
    expect(getDayName(4)).toBe("Jueves");
    expect(getDayName(5)).toBe("Viernes");
    expect(getDayName(6)).toBe("Sábado");
  });

  it("returns empty string for invalid day", () => {
    expect(getDayName(7)).toBe("");
    expect(getDayName(-1)).toBe("");
  });
});

describe("useStoreHours", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches store hours ordered by day_of_week", async () => {
    const mockHours = [
      { id: "h1", store_id: "store-123", day_of_week: 1, open_time: "09:00", close_time: "18:00", closes_next_day: false },
      { id: "h2", store_id: "store-123", day_of_week: 2, open_time: "09:00", close_time: "18:00", closes_next_day: false },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockHours, error: null }),
    });

    const { result } = renderHook(() => useStoreHours(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(supabase.from).toHaveBeenCalledWith("store_hours");
  });
});

describe("useUpdateStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates store fields", async () => {
    const mockUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

    const { result } = renderHook(() => useUpdateStore(), { wrapper: createWrapper() });

    result.current.mutate({ name: "New Store Name", currency: "USD" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdate).toHaveBeenCalledWith({ name: "New Store Name", currency: "USD" });
  });
});
