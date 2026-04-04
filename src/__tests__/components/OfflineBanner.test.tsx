import { render, screen, act } from "@testing-library/react-native";
import NetInfo from "@react-native-community/netinfo";
import { OfflineBanner } from "@/components/shared/OfflineBanner";

describe("OfflineBanner", () => {
  let listenerCallback: (state: any) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb) => {
      listenerCallback = cb;
      return jest.fn();
    });
  });

  it("does not render when online", () => {
    const { toJSON } = render(<OfflineBanner />);
    act(() => {
      listenerCallback({ isConnected: true, isInternetReachable: true });
    });
    // When online, component returns null
    expect(screen.queryByText("Sin conexión a internet")).toBeNull();
  });

  it("renders banner when offline", () => {
    render(<OfflineBanner />);
    act(() => {
      listenerCallback({ isConnected: false, isInternetReachable: false });
    });
    expect(screen.getByText("Sin conexión a internet")).toBeTruthy();
  });

  it("subscribes to NetInfo on mount", () => {
    render(<OfflineBanner />);
    expect(NetInfo.addEventListener).toHaveBeenCalled();
  });
});
