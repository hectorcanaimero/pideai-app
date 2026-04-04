import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { supabase } from "@/services/supabase";

import { registerForPushNotifications, setBadgeCount } from "@/services/notificationService";

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerForPushNotifications", () => {
    it("returns null on non-physical device", async () => {
      Object.defineProperty(Device, "isDevice", { value: false, writable: true });

      const result = await registerForPushNotifications("user-1", "store-123");
      expect(result).toBeNull();

      Object.defineProperty(Device, "isDevice", { value: true, writable: true });
    });

    it("requests permission if not granted", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: "undetermined" });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({ data: "ExponentPushToken[abc]" });

      (supabase.from as jest.Mock).mockReturnValue({
        upsert: jest.fn().mockResolvedValue({ error: null }),
      });

      const result = await registerForPushNotifications("user-1", "store-123");
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(result).toBe("ExponentPushToken[abc]");
    });

    it("returns null when permission denied", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });

      const result = await registerForPushNotifications("user-1", "store-123");
      expect(result).toBeNull();
    });

    it("saves token to device_tokens table", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({ data: "ExponentPushToken[xyz]" });

      const mockUpsert = jest.fn().mockResolvedValue({ error: null });
      (supabase.from as jest.Mock).mockReturnValue({ upsert: mockUpsert });

      await registerForPushNotifications("user-1", "store-123");

      expect(supabase.from).toHaveBeenCalledWith("device_tokens");
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-1",
          store_id: "store-123",
          expo_push_token: "ExponentPushToken[xyz]",
        }),
        expect.objectContaining({ onConflict: "user_id,store_id" })
      );
    });
  });

  describe("setBadgeCount", () => {
    it("calls setBadgeCountAsync", async () => {
      await setBadgeCount(5);
      expect(Notifications.setBadgeCountAsync).toHaveBeenCalledWith(5);
    });

    it("sets badge to zero", async () => {
      await setBadgeCount(0);
      expect(Notifications.setBadgeCountAsync).toHaveBeenCalledWith(0);
    });
  });
});
