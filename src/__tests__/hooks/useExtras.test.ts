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

import {
  useExtraGroups,
  useGroupExtras,
  useCreateExtra,
  useUpdateExtra,
  useDeleteExtra,
  useCreateExtraGroup,
  useUpdateExtraGroup,
  useDeleteExtraGroup,
} from "@/hooks/useExtras";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useExtraGroups", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("fetches active extra groups for the store", async () => {
    const mockGroups = [
      { id: "g1", store_id: "store-123", name: "Salsas", selection_type: "multiple", is_active: true, display_order: 1 },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockGroups, error: null }),
        }),
      }),
    });

    const { result } = renderHook(() => useExtraGroups("store-123"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(supabase.from).toHaveBeenCalledWith("extra_groups");
  });

  it("does not fetch when storeId is undefined", () => {
    const { result } = renderHook(() => useExtraGroups(undefined), { wrapper: createWrapper() });
    expect(result.current.isFetching).toBe(false);
  });
});

describe("useGroupExtras", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("fetches extras for a group ordered by display_order", async () => {
    const mockExtras = [
      { id: "e1", group_id: "g1", name: "Ketchup", price: 0, is_available: true, display_order: 1 },
      { id: "e2", group_id: "g1", name: "Mayonesa", price: 0.5, is_available: true, display_order: 2 },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockExtras, error: null }),
    });

    const { result } = renderHook(() => useGroupExtras("g1"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(supabase.from).toHaveBeenCalledWith("product_extras");
  });
});

describe("useCreateExtra", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("inserts a new extra", async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null });
    (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

    const { result } = renderHook(() => useCreateExtra(), { wrapper: createWrapper() });

    result.current.mutate({ group_id: "g1", name: "BBQ", price: 1.5 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockInsert).toHaveBeenCalledWith({ group_id: "g1", name: "BBQ", price: 1.5 });
  });
});

describe("useUpdateExtra", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("updates an extra by id", async () => {
    const mockUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });
    (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

    const { result } = renderHook(() => useUpdateExtra(), { wrapper: createWrapper() });

    result.current.mutate({ id: "e1", name: "Ketchup XL", price: 0.75 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdate).toHaveBeenCalledWith({ name: "Ketchup XL", price: 0.75 });
  });
});

describe("useDeleteExtra", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("deletes an extra by id", async () => {
    const mockEq = jest.fn().mockResolvedValue({ error: null });
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as jest.Mock).mockReturnValue({ delete: mockDelete });

    const { result } = renderHook(() => useDeleteExtra(), { wrapper: createWrapper() });

    result.current.mutate("e1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockEq).toHaveBeenCalledWith("id", "e1");
  });
});

describe("useCreateExtraGroup", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("inserts a new extra group with store_id", async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null });
    (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

    const { result } = renderHook(() => useCreateExtraGroup(), { wrapper: createWrapper() });

    result.current.mutate({ name: "Salsas", selection_type: "multiple", is_required: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Salsas",
        store_id: "store-123",
        is_active: true,
      })
    );
  });
});

describe("useUpdateExtraGroup", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("updates group by id", async () => {
    const mockUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });
    (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

    const { result } = renderHook(() => useUpdateExtraGroup(), { wrapper: createWrapper() });

    result.current.mutate({ id: "g1", name: "Aderezos" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdate).toHaveBeenCalledWith({ name: "Aderezos" });
  });
});

describe("useDeleteExtraGroup", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("deletes group by id", async () => {
    const mockEq = jest.fn().mockResolvedValue({ error: null });
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as jest.Mock).mockReturnValue({ delete: mockDelete });

    const { result } = renderHook(() => useDeleteExtraGroup(), { wrapper: createWrapper() });

    result.current.mutate("g1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockEq).toHaveBeenCalledWith("id", "g1");
  });
});
