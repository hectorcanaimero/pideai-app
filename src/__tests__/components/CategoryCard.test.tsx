import { render, screen, fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";

jest.mock("lucide-react-native", () => ({
  ChevronRight: () => null,
  Package: () => null,
}));

import { CategoryCard } from "@/components/menu/CategoryCard";

const mockCategory = {
  id: "cat-1",
  store_id: "store-123",
  name: "Hamburguesas",
  description: "Las mejores hamburguesas de la ciudad",
  display_order: 1,
  product_count: 8,
};

describe("CategoryCard", () => {
  it("renders category name", () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText("Hamburguesas")).toBeTruthy();
  });

  it("renders description when present", () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText("Las mejores hamburguesas de la ciudad")).toBeTruthy();
  });

  it("does not render description when absent", () => {
    const noDesc = { ...mockCategory, description: null };
    render(<CategoryCard category={noDesc} />);
    expect(screen.queryByText("Las mejores hamburguesas de la ciudad")).toBeNull();
  });

  it("renders product count", () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText("8 productos")).toBeTruthy();
  });

  it("shows 0 products when product_count is undefined", () => {
    const noCount = { ...mockCategory, product_count: undefined };
    render(<CategoryCard category={noCount} />);
    expect(screen.getByText("0 productos")).toBeTruthy();
  });

  it("navigates to category on press", () => {
    render(<CategoryCard category={mockCategory} />);
    const card = screen.getByText("Hamburguesas").parent?.parent;
    if (card) fireEvent.press(card);
    expect(router.push).toHaveBeenCalledWith("/(admin)/menu/category/cat-1");
  });
});
