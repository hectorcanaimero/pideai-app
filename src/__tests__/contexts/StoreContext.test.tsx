import { renderHook, waitFor } from "@testing-library/react-native";
import { createElement, type ReactNode } from "react";
import { supabase } from "@/services/supabase";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "test@test.com" },
    session: { access_token: "token" },
    loading: false,
  }),
}));

import { StoreProvider, useStore } from "@/contexts/StoreContext";

function createWrapper() {
  return ({ children }: { children: ReactNode }) =>
    createElement(StoreProvider, null, children);
}

describe("StoreContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads store for authenticated user", async () => {
    const mockStore = {
      id: "store-123",
      name: "Mi Tienda",
      subdomain: "mitienda",
      owner_id: "user-1",
      is_food_business: true,
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: mockStore, error: null }),
    });

    const { result } = renderHook(() => useStore(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.store?.name).toBe("Mi Tienda");
    expect(result.current.isStoreOwner).toBe(true);
  });

  it("sets isStoreOwner false when no store found", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    });

    // Mock rpc for platform admin check
    (supabase as any).rpc = jest.fn().mockResolvedValue({ data: false });

    const { result } = renderHook(() => useStore(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.store).toBeNull();
    expect(result.current.isStoreOwner).toBe(false);
  });

  it("handles database error gracefully", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: { message: "DB error" } }),
    });

    const { result } = renderHook(() => useStore(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.store).toBeNull();
    expect(result.current.isStoreOwner).toBe(false);
  });
});
