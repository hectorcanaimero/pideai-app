import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

// Mock lucide icons
jest.mock("lucide-react-native", () => ({
  AlertTriangle: ({ size, color }: any) => null,
  RefreshCw: ({ size, color }: any) => null,
}));

// Mock sentry captureError
jest.mock("@/lib/sentry", () => ({
  captureError: jest.fn(),
}));

// Suppress console.error for expected errors
const originalError = console.error;
beforeAll(() => { console.error = jest.fn(); });
afterAll(() => { console.error = originalError; });

function ThrowingComponent() {
  throw new Error("Test error message");
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <Text>Hello</Text>
      </ErrorBoundary>
    );
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("shows error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Algo salió mal")).toBeTruthy();
    expect(screen.getByText("Test error message")).toBeTruthy();
  });

  it("shows custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<Text>Custom error</Text>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom error")).toBeTruthy();
  });

  it("shows reintentar button in default fallback", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Reintentar")).toBeTruthy();
  });
});
