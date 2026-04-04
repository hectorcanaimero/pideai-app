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

import { useOrders, useOrderDetail, useUpdateOrderStatus } from "@/hooks/useOrders";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockOrders = [
  { id: "order-1", store_id: "store-123", customer_name: "Juan", status: "pending", total_amount: 25.50, created_at: new Date().toISOString() },
  { id: "order-2", store_id: "store-123", customer_name: "María", status: "confirmed", total_amount: 18.00, created_at: new Date().toISOString() },
  { id: "order-3", store_id: "store-123", customer_name: "Carlos", status: "cancelled", total_amount: 12.00, created_at: new Date().toISOString() },
];

describe("useOrders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useOrders hook", () => {
    it("fetches orders for the current store", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
      });

      const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(3);
      expect(supabase.from).toHaveBeenCalledWith("orders");
    });

    it("applies status filter when provided", async () => {
      const mockEq = jest.fn().mockResolvedValue({ data: [mockOrders[0]], error: null });
      const mockLimit = jest.fn().mockReturnValue({ eq: mockEq });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: mockLimit,
      });

      const { result } = renderHook(() => useOrders("pending"), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it("returns empty array when store has no orders", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([]);
    });
  });

  describe("useOrderDetail hook", () => {
    it("fetches order with items", async () => {
      const mockOrder = { ...mockOrders[0] };
      const mockItems = [
        { id: "item-1", order_id: "order-1", item_name: "Hamburguesa", quantity: 2, price_at_time: 10, extras: null },
      ];

      (supabase.from as jest.Mock)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockOrder, error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: mockItems, error: null }),
        });

      const { result } = renderHook(() => useOrderDetail("order-1"), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.order_items).toHaveLength(1);
      expect(result.current.data?.customer_name).toBe("Juan");
    });

    it("does not fetch when orderId is undefined", () => {
      const { result } = renderHook(() => useOrderDetail(undefined), { wrapper: createWrapper() });
      expect(result.current.isFetching).toBe(false);
    });
  });

  describe("useUpdateOrderStatus hook", () => {
    it("updates order status and logs to history", async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });
      const mockInsert = jest.fn().mockResolvedValue({ error: null });

      (supabase.from as jest.Mock)
        .mockReturnValueOnce({ update: mockUpdate })
        .mockReturnValueOnce({ insert: mockInsert });

      const { result } = renderHook(() => useUpdateOrderStatus(), { wrapper: createWrapper() });

      result.current.mutate({ orderId: "order-1", newStatus: "confirmed" });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ status: "confirmed" })
      );
    });
  });
});
