import { render, screen, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";

jest.mock("@/contexts/StoreContext", () => ({
  useStore: () => ({
    store: { id: "store-123", name: "Test Store", owner_id: "user-1" },
    loading: false,
    isStoreOwner: true,
  }),
}));

jest.mock("lucide-react-native", () => ({
  Clock: () => null,
  ChevronRight: () => null,
  StickyNote: () => null,
}));

import { KitchenCard } from "@/components/kitchen/KitchenCard";
import type { OrderWithItems } from "@/lib/orderConstants";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockOrder: OrderWithItems = {
  id: "abcd1234-0000-0000-0000-000000000000",
  store_id: "store-123",
  customer_name: "Carlos",
  customer_email: "carlos@test.com",
  customer_phone: null,
  order_type: "delivery",
  delivery_address: null,
  delivery_price: null,
  status: "preparing",
  payment_method: null,
  total_amount: 30,
  notes: "Sin cebolla",
  coupon_code: null,
  coupon_discount: null,
  tracking_code: null,
  assigned_driver_id: null,
  created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
  updated_at: null,
  order_items: [
    { id: "i1", order_id: "abcd1234", menu_item_id: "m1", item_name: "Hamburguesa", quantity: 2, price_at_time: 10, extras: [{ name: "Queso extra", price: 1 }], created_at: null },
    { id: "i2", order_id: "abcd1234", menu_item_id: "m2", item_name: "Papas", quantity: 1, price_at_time: 5, extras: null, created_at: null },
  ],
};

describe("KitchenCard", () => {
  it("renders order number", () => {
    render(<KitchenCard order={mockOrder} />, { wrapper: createWrapper() });
    expect(screen.getByText("#ABCD1234")).toBeTruthy();
  });

  it("renders customer name", () => {
    render(<KitchenCard order={mockOrder} />, { wrapper: createWrapper() });
    expect(screen.getByText("Carlos")).toBeTruthy();
  });

  it("renders order items with quantities", () => {
    render(<KitchenCard order={mockOrder} />, { wrapper: createWrapper() });
    expect(screen.getByText("Hamburguesa")).toBeTruthy();
    expect(screen.getByText("Papas")).toBeTruthy();
    expect(screen.getByText("2x")).toBeTruthy();
    expect(screen.getByText("1x")).toBeTruthy();
  });

  it("renders extras for items", () => {
    render(<KitchenCard order={mockOrder} />, { wrapper: createWrapper() });
    expect(screen.getByText("+ Queso extra")).toBeTruthy();
  });

  it("renders order notes", () => {
    render(<KitchenCard order={mockOrder} />, { wrapper: createWrapper() });
    expect(screen.getByText("Sin cebolla")).toBeTruthy();
  });

  it("shows next status button", () => {
    render(<KitchenCard order={mockOrder} />, { wrapper: createWrapper() });
    expect(screen.getByText("Mover a Listo")).toBeTruthy();
  });

  it("does not show button for delivered orders", () => {
    const delivered = { ...mockOrder, status: "delivered" as const };
    render(<KitchenCard order={delivered} />, { wrapper: createWrapper() });
    expect(screen.queryByText(/Mover a/)).toBeNull();
  });

  it("renders time since order was placed", () => {
    render(<KitchenCard order={mockOrder} />, { wrapper: createWrapper() });
    expect(screen.getByText("10min")).toBeTruthy();
  });

  it("renders without items gracefully", () => {
    const noItems = { ...mockOrder, order_items: undefined };
    render(<KitchenCard order={noItems} />, { wrapper: createWrapper() });
    expect(screen.getByText("Sin items cargados")).toBeTruthy();
  });
});
