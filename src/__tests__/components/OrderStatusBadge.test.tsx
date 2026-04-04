import { render, screen } from "@testing-library/react-native";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

describe("OrderStatusBadge", () => {
  it("renders the correct label for each status", () => {
    const { unmount } = render(<OrderStatusBadge status="pending" />);
    expect(screen.getByText("Pendiente")).toBeTruthy();
    unmount();

    render(<OrderStatusBadge status="confirmed" />);
    expect(screen.getByText("Confirmado")).toBeTruthy();
  });

  it("renders with sm size by default", () => {
    render(<OrderStatusBadge status="ready" />);
    expect(screen.getByText("Listo")).toBeTruthy();
  });

  it("renders with md size when specified", () => {
    render(<OrderStatusBadge status="cancelled" size="md" />);
    expect(screen.getByText("Cancelado")).toBeTruthy();
  });
});
