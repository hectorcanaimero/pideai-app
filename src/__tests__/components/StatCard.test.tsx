import { render, screen } from "@testing-library/react-native";
import { createElement } from "react";
import { Text } from "react-native";
import { StatCard } from "@/components/dashboard/StatCard";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(
      <StatCard
        icon={createElement(Text, null, "icon")}
        label="Pedidos hoy"
        value="42"
      />
    );
    expect(screen.getByText("Pedidos hoy")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("renders subtitle when provided", () => {
    render(
      <StatCard
        icon={createElement(Text, null, "icon")}
        label="Pendientes"
        value="5"
        subtitle="pedidos por atender"
      />
    );
    expect(screen.getByText("pedidos por atender")).toBeTruthy();
  });

  it("does not render subtitle when not provided", () => {
    render(
      <StatCard
        icon={createElement(Text, null, "icon")}
        label="Productos"
        value="100"
      />
    );
    expect(screen.queryByText("pedidos por atender")).toBeNull();
  });

  it("renders icon", () => {
    render(
      <StatCard
        icon={createElement(Text, { testID: "test-icon" }, "IC")}
        label="Test"
        value="0"
      />
    );
    expect(screen.getByTestId("test-icon")).toBeTruthy();
  });
});
