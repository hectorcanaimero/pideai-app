import { render, screen, fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import { OrderCard } from "@/components/orders/OrderCard";
import type { OrderWithItems } from "@/lib/orderConstants";

const mockOrder: OrderWithItems = {
  id: "abcd1234-5678-90ab-cdef-111111111111",
  store_id: "store-123",
  customer_name: "Juan Pérez",
  customer_email: "juan@test.com",
  customer_phone: "+58412111222",
  order_type: "delivery",
  delivery_address: "Av. Principal #123, Caracas",
  delivery_price: 3,
  status: "pending",
  payment_method: "efectivo",
  total_amount: 25.5,
  notes: null,
  coupon_code: null,
  coupon_discount: null,
  tracking_code: null,
  assigned_driver_id: null,
  created_at: new Date().toISOString(),
  updated_at: null,
};

describe("OrderCard", () => {
  it("renders order number from first 8 chars of id", () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText("#ABCD1234")).toBeTruthy();
  });

  it("renders customer name", () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText("Juan Pérez")).toBeTruthy();
  });

  it("renders total amount formatted", () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText("$25.50")).toBeTruthy();
  });

  it("renders phone number when present", () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText("+58412111222")).toBeTruthy();
  });

  it("renders delivery address for delivery orders", () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText("Av. Principal #123, Caracas")).toBeTruthy();
  });

  it("does not render address for pickup orders", () => {
    const pickupOrder = { ...mockOrder, order_type: "pickup", delivery_address: null };
    render(<OrderCard order={pickupOrder} />);
    expect(screen.queryByText("Av. Principal #123, Caracas")).toBeNull();
  });

  it("navigates to order detail on press", () => {
    render(<OrderCard order={mockOrder} />);
    const card = screen.getByText("#ABCD1234").parent?.parent;
    if (card) fireEvent.press(card);
    expect(router.push).toHaveBeenCalledWith(`/(admin)/orders/${mockOrder.id}`);
  });

  it("renders order type label", () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText("Delivery")).toBeTruthy();
  });

  it("shows 'Ahora' for very recent orders", () => {
    const recentOrder = { ...mockOrder, created_at: new Date().toISOString() };
    render(<OrderCard order={recentOrder} />);
    expect(screen.getByText("Ahora")).toBeTruthy();
  });
});
