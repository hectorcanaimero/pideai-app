import { View, Text, TouchableOpacity } from "react-native";
import { Share as ShareIcon, QrCode } from "lucide-react-native";
import { Share } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useStore } from "@/contexts/StoreContext";
import { useRef } from "react";

export function StoreQRCode() {
  const { store } = useStore();
  const qrRef = useRef<any>(null);

  if (!store) return null;

  const storeUrl = `https://${store.subdomain}.pideai.com`;

  const handleShare = async () => {
    try {
      // Try to get QR as base64 for sharing
      if (qrRef.current) {
        qrRef.current.toDataURL((dataURL: string) => {
          Share.share({
            message: `¡Hacé tu pedido en ${store.name}! 👉 ${storeUrl}`,
            url: storeUrl,
            title: store.name,
          });
        });
      } else {
        await Share.share({
          message: `¡Hacé tu pedido en ${store.name}! 👉 ${storeUrl}`,
          url: storeUrl,
          title: store.name,
        });
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  return (
    <View className="bg-elegant-gray rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <QrCode size={18} color="#FFC300" />
          <Text className="text-white font-sans-semibold text-base">Código QR de tu tienda</Text>
        </View>
      </View>

      <Text className="text-cream-400 font-sans text-xs mb-4">
        Compartí este código con tus clientes para que accedan fácilmente
      </Text>

      {/* QR Code */}
      <View className="items-center mb-4">
        <View className="bg-white rounded-2xl p-4">
          <QRCode
            value={storeUrl}
            size={180}
            backgroundColor="white"
            color="#1A1A2E"
            getRef={(ref: any) => (qrRef.current = ref)}
          />
        </View>
        <Text className="text-cream-400 font-sans text-xs mt-2">{storeUrl}</Text>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        className="bg-gold-500 py-3 rounded-xl flex-row items-center justify-center gap-2"
        onPress={handleShare}
        activeOpacity={0.8}
      >
        <ShareIcon size={16} color="#1A1A2E" />
        <Text className="text-elegant-dark font-sans-bold text-sm">Compartir</Text>
      </TouchableOpacity>
    </View>
  );
}
