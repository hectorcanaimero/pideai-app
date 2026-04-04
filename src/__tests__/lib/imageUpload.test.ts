import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/services/supabase";
import { pickImage, takePhoto, uploadProductImage } from "@/lib/imageUpload";

// Mock permissions
const mockRequestMediaLibraryPermissionsAsync = jest.fn();
const mockRequestCameraPermissionsAsync = jest.fn();

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: (...args: any[]) => mockRequestMediaLibraryPermissionsAsync(...args),
  requestCameraPermissionsAsync: (...args: any[]) => mockRequestCameraPermissionsAsync(...args),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

describe("pickImage", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("returns null when permission denied", async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });
    const result = await pickImage();
    expect(result).toBeNull();
  });

  it("returns null when user cancels", async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true });
    const result = await pickImage();
    expect(result).toBeNull();
  });

  it("returns uri when image selected", async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///photo.jpg" }],
    });
    const result = await pickImage();
    expect(result).toBe("file:///photo.jpg");
  });
});

describe("takePhoto", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("returns null when permission denied", async () => {
    mockRequestCameraPermissionsAsync.mockResolvedValue({ granted: false });
    const result = await takePhoto();
    expect(result).toBeNull();
  });

  it("returns null when user cancels", async () => {
    mockRequestCameraPermissionsAsync.mockResolvedValue({ granted: true });
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({ canceled: true });
    const result = await takePhoto();
    expect(result).toBeNull();
  });

  it("returns uri when photo taken", async () => {
    mockRequestCameraPermissionsAsync.mockResolvedValue({ granted: true });
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///camera.jpg" }],
    });
    const result = await takePhoto();
    expect(result).toBe("file:///camera.jpg");
  });
});

describe("uploadProductImage", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("returns public URL on success", async () => {
    // Mock fetch for blob conversion
    global.fetch = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      }),
    }) as any;

    const result = await uploadProductImage("file:///photo.jpg", "store-123");
    expect(result).toBe("https://test.com/test.jpg");
  });

  it("returns null on upload error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      }),
    }) as any;

    // Override upload to fail
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockResolvedValue({ data: null, error: { message: "Upload failed" } }),
      getPublicUrl: jest.fn(),
    });

    const result = await uploadProductImage("file:///photo.jpg", "store-123");
    expect(result).toBeNull();
  });

  it("returns null on exception", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error")) as any;
    const result = await uploadProductImage("file:///photo.jpg", "store-123");
    expect(result).toBeNull();
  });
});
