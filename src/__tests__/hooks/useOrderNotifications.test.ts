import { renderHook } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import { supabase } from "@/services/supabase";

jest.mock("@/contexts/StoreContext", () => ({
  useStore: () => ({
    store: {
      id: "store-123",
      name: "Test Store",
      owner_id: "user-1",
      enable_audio_notifications: true,
      notification_volume: 80,
      notification_repeat_count: 2,
    },
    loading: false,
    isStoreOwner: true,
  }),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "test@test.com" },
    session: { access_token: "token" },
    loading: false,
  }),
}));

jest.mock("@/services/notificationService", () => ({
  registerForPushNotifications: jest.fn(),
  setBadgeCount: jest.fn(),
}));

jest.mock("@/lib/notificationSound", () => ({
  playNotificationSound: jest.fn(),
}));

import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { registerForPushNotifications, setBadgeCount } from "@/services/notificationService";

describe("useOrderNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock supabase queries for polling
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockResolvedValue({ count: 3, error: null }),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [{ id: "order-1", customer_name: "Juan", total_amount: 25, status: "pending" }], error: null }),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("registers for push notifications on mount", () => {
    renderHook(() => useOrderNotifications());
    expect(registerForPushNotifications).toHaveBeenCalledWith("user-1", "store-123");
  });

  it("sets up notification listeners", () => {
    renderHook(() => useOrderNotifications());
    expect(Notifications.addNotificationReceivedListener).toHaveBeenCalled();
    expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalled();
  });

  it("starts polling for new orders", async () => {
    renderHook(() => useOrderNotifications());
    // Initial poll happens immediately
    expect(supabase.from).toHaveBeenCalledWith("orders");
  });
});
