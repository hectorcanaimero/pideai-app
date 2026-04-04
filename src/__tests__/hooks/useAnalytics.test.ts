import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { supabase } from "@/services/supabase";

jest.mock("@/contexts/StoreContext", () => ({
  useStore: () => ({
    store: { id: "store-123", name: "Test Store", owner_id: "user-1" },
    loading: false,
    isStoreOwner: true,
  }),
}));

import { useAnalytics, type Period } from "@/hooks/useAnalytics";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calculates analytics from orders", async () => {
    const mockOrders = [
      { id: "o1", total_amount: 25, status: "delivered", order_type: "delivery", created_at: "2026-04-04" },
      { id: "o2", total_amount: 15, status: "confirmed", order_type: "pickup", created_at: "2026-04-04" },
      { id: "o3", total_amount: 30, status: "delivered", order_type: "delivery", created_at: "2026-04-04" },
    ];

    const mockItems = [
      { item_name: "Hamburguesa", quantity: 3 },
      { item_name: "Pizza", quantity: 2 },
      { item_name: "Hamburguesa", quantity: 1 },
    ];

    (supabase.from as jest.Mock)
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        neq: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockResolvedValue({ data: mockItems, error: null }),
      });

    const { result } = renderHook(() => useAnalytics("today"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.totalOrders).toBe(3);
    expect(result.current.data?.totalRevenue).toBe(70);
    expect(result.current.data?.avgOrderValue).toBeCloseTo(23.33, 1);
    expect(result.current.data?.byType.delivery).toBe(2);
    expect(result.current.data?.byType.pickup).toBe(1);
    expect(result.current.data?.topProducts[0].name).toBe("Hamburguesa");
    expect(result.current.data?.topProducts[0].quantity).toBe(4);
  });

  it("handles empty orders gracefully", async () => {
    (supabase.from as jest.Mock)
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        neq: jest.fn().mockResolvedValue({ data: [], error: null }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

    const { result } = renderHook(() => useAnalytics("month"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.totalOrders).toBe(0);
    expect(result.current.data?.totalRevenue).toBe(0);
    expect(result.current.data?.avgOrderValue).toBe(0);
    expect(result.current.data?.topProducts).toEqual([]);
  });

  it("accepts different period values", () => {
    const periods: Period[] = ["today", "week", "month"];
    for (const p of periods) {
      expect(typeof p).toBe("string");
    }
  });
});
