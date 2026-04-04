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

import { useCustomers } from "@/hooks/useCustomers";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useCustomers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches orders and aggregates customers by phone", async () => {
    const mockOrders = [
      { customer_name: "Juan", customer_email: "juan@test.com", customer_phone: "+58412111", customer_id: null, total_amount: 25, created_at: "2026-04-01" },
      { customer_name: "Juan", customer_email: "juan@test.com", customer_phone: "+58412111", customer_id: null, total_amount: 30, created_at: "2026-04-02" },
      { customer_name: "María", customer_email: "maria@test.com", customer_phone: "+58412222", customer_id: null, total_amount: 15, created_at: "2026-04-01" },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
    });

    const { result } = renderHook(() => useCustomers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // Juan's 2 orders should be aggregated into 1 customer
    expect(result.current.data).toHaveLength(2);
    const juan = result.current.data?.find((c) => c.name === "Juan");
    expect(juan?.order_count).toBe(2);
    expect(juan?.total_spent).toBe(55);
  });

  it("deduplicates by email when phone is missing", async () => {
    const mockOrders = [
      { customer_name: "Ana", customer_email: "ana@test.com", customer_phone: null, customer_id: null, total_amount: 10, created_at: "2026-04-01" },
      { customer_name: "Ana M", customer_email: "ana@test.com", customer_phone: null, customer_id: null, total_amount: 20, created_at: "2026-04-02" },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
    });

    const { result } = renderHook(() => useCustomers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].order_count).toBe(2);
  });
});
