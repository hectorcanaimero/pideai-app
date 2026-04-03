import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/services/supabase";

export async function pickImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function takePhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function uploadProductImage(
  uri: string,
  storeId: string
): Promise<string | null> {
  try {
    const ext = uri.split(".").pop() ?? "jpg";
    const fileName = `${storeId}/${Date.now()}.${ext}`;

    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, arrayBuffer, {
        contentType: `image/${ext === "png" ? "png" : "jpeg"}`,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("menu-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error("Image upload failed:", err);
    return null;
  }
}
