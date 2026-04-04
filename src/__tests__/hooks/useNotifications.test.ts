import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { supabase } from "@/services/supabase";

// Mock StoreContext
jest.mock("@/contexts/StoreContext", () => ({
  useStore: () => ({
    store: { id: "store-123", name: "Test Store", owner_id: "user-1" },
    loading: false,
    isStoreOwner: true,
  }),
}));

import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from "@/hooks/useNotifications";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useNotifications hook", () => {
    it("queries notifications for the current store", async () => {
      const mockData = [
        { id: "n1", store_id: "store-123", title: "Nuevo pedido", body: "Test", type: "new_order", is_read: false, created_at: new Date().toISOString() },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockData);
      expect(supabase.from).toHaveBeenCalledWith("notifications");
    });
  });

  describe("useUnreadCount hook", () => {
    it("returns count of unread notifications", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ count: 5, error: null }),
        }),
      });

      const { result } = renderHook(() => useUnreadCount(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toBe(5);
    });
  });

  describe("useMarkAsRead hook", () => {
    it("updates a single notification to read", async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const { result } = renderHook(() => useMarkAsRead(), { wrapper: createWrapper() });

      result.current.mutate("notif-123");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
    });
  });

  describe("useMarkAllAsRead hook", () => {
    it("updates all unread notifications for the store", async () => {
      const mockEqIsRead = jest.fn().mockResolvedValue({ error: null });
      const mockEqStore = jest.fn().mockReturnValue({ eq: mockEqIsRead });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEqStore });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const { result } = renderHook(() => useMarkAllAsRead(), { wrapper: createWrapper() });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
    });
  });
});
