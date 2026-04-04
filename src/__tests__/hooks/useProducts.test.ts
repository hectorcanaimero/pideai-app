import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { supabase } from "@/services/supabase";

jest.mock("@/contexts/StoreContext", () => ({
  useStore: () => ({
    store: { id: "store-123", name: "Test Store", owner_id: "user-1", is_food_business: true },
    loading: false,
    isStoreOwner: true,
  }),
}));

import { useProductsByCategory, useProductDetail, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockProducts = [
  { id: "prod-1", name: "Hamburguesa", price: 10, category_id: "cat-1", is_available: true, is_featured: false, admin_only: false, display_order: 1 },
  { id: "prod-2", name: "Pizza", price: 15, category_id: "cat-1", is_available: true, is_featured: true, admin_only: false, display_order: 2 },
];

describe("useProductsByCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches products by category ordered by display_order", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockProducts, error: null }),
        }),
      }),
    });

    const { result } = renderHook(() => useProductsByCategory("cat-1"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(supabase.from).toHaveBeenCalledWith("menu_items");
  });

  it("does not fetch when categoryId is undefined", () => {
    const { result } = renderHook(() => useProductsByCategory(undefined), { wrapper: createWrapper() });
    expect(result.current.isFetching).toBe(false);
  });
});

describe("useProductDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches single product by id", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProducts[0], error: null }),
    });

    const { result } = renderHook(() => useProductDetail("prod-1"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe("Hamburguesa");
  });

  it("does not fetch when productId is undefined", () => {
    const { result } = renderHook(() => useProductDetail(undefined), { wrapper: createWrapper() });
    expect(result.current.isFetching).toBe(false);
  });
});

describe("useCreateProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inserts a new product with store_id", async () => {
    const mockInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: "new-prod" }, error: null }),
    });

    (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

    const { result } = renderHook(() => useCreateProduct(), { wrapper: createWrapper() });

    result.current.mutate({
      name: "Nuevo Producto",
      price: 20,
      category_id: "cat-1",
      is_featured: true,
      admin_only: false,
      display_order: 5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Nuevo Producto",
        price: 20,
        store_id: "store-123",
        is_featured: true,
        display_order: 5,
      })
    );
  });
});

describe("useUpdateProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates product by id", async () => {
    const mockEq = jest.fn().mockResolvedValue({ error: null });
    const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });

    (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

    const { result } = renderHook(() => useUpdateProduct(), { wrapper: createWrapper() });

    result.current.mutate({
      id: "prod-1",
      name: "Hamburguesa XL",
      price: 15,
      is_featured: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Hamburguesa XL",
        price: 15,
        is_featured: true,
      })
    );
    // Should NOT include 'id' in the update payload
    expect(mockUpdate).not.toHaveBeenCalledWith(expect.objectContaining({ id: "prod-1" }));
  });
});
