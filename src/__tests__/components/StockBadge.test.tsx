import { render, screen } from "@testing-library/react-native";
import { StockBadge } from "@/components/menu/StockBadge";

describe("StockBadge", () => {
  it("returns null when stock tracking disabled", () => {
    const { toJSON } = render(
      <StockBadge trackStock={false} quantity={10} minimum={5} />
    );
    expect(toJSON()).toBeNull();
  });

  it("shows 'Agotado' when quantity is 0", () => {
    render(<StockBadge trackStock={true} quantity={0} minimum={5} />);
    expect(screen.getByText("Agotado")).toBeTruthy();
  });

  it("shows 'Agotado' when quantity is negative", () => {
    render(<StockBadge trackStock={true} quantity={-1} minimum={5} />);
    expect(screen.getByText("Agotado")).toBeTruthy();
  });

  it("shows low stock warning when quantity <= minimum", () => {
    render(<StockBadge trackStock={true} quantity={3} minimum={5} />);
    expect(screen.getByText("Stock: 3")).toBeTruthy();
  });

  it("shows normal stock when quantity > minimum", () => {
    render(<StockBadge trackStock={true} quantity={20} minimum={5} />);
    expect(screen.getByText("Stock: 20")).toBeTruthy();
  });

  it("handles null quantity", () => {
    const { toJSON } = render(
      <StockBadge trackStock={true} quantity={null} minimum={5} />
    );
    // With null quantity, it doesn't match isOutOfStock or isLowStock, shows normal
    expect(toJSON()).toBeTruthy();
  });

  it("shows stock at exact minimum level as low stock", () => {
    render(<StockBadge trackStock={true} quantity={5} minimum={5} />);
    expect(screen.getByText("Stock: 5")).toBeTruthy();
  });
});
