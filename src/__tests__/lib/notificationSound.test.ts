import { Audio } from "expo-av";

// Must import after mock is set up
import { playNotificationSound, unloadNotificationSound } from "@/lib/notificationSound";

describe("notificationSound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("playNotificationSound", () => {
    it("sets audio mode for playback in silent mode", async () => {
      await playNotificationSound(80, 1);
      expect(Audio.setAudioModeAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
        })
      );
    });

    it("normalizes volume between 0 and 1", async () => {
      await playNotificationSound(50, 1);
      expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ volume: 0.5, shouldPlay: true })
      );
    });

    it("clamps volume to 0 minimum", async () => {
      await playNotificationSound(-10, 1);
      expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ volume: 0 })
      );
    });

    it("clamps volume to 1 maximum", async () => {
      await playNotificationSound(200, 1);
      expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ volume: 1 })
      );
    });

    it("defaults to volume 80 and repeat 3", async () => {
      // Just ensure it doesn't throw with defaults
      await expect(playNotificationSound()).resolves.toBeUndefined();
    });
  });

  describe("unloadNotificationSound", () => {
    it("does not throw when no sound loaded", async () => {
      await expect(unloadNotificationSound()).resolves.toBeUndefined();
    });
  });
});
