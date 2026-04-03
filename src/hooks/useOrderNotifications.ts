import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { type EventSubscription } from "expo-modules-core";
import { AppState } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/hooks/useAuth";
import {
  registerForPushNotifications,
  setBadgeCount,
} from "@/services/notificationService";
import { playNotificationSound } from "@/lib/notificationSound";

export function useOrderNotifications() {
  const { store } = useStore();
  const { user } = useAuth();
  const lastOrderIdRef = useRef<string | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);
  const foregroundListener = useRef<EventSubscription | null>(null);

  // Register for push notifications
  useEffect(() => {
    if (!user?.id || !store?.id) return;
    registerForPushNotifications(user.id, store.id);
  }, [user?.id, store?.id]);

  // Handle notification received while app is in FOREGROUND
  // This is where we play the audio alert
  useEffect(() => {
    if (!store) return;

    const s = store as any;
    const audioEnabled = s.enable_audio_notifications !== false;
    const volume = s.notification_volume ?? 80;
    const repeatCount = s.notification_repeat_count ?? 3;

    foregroundListener.current =
      Notifications.addNotificationReceivedListener(async (_notification) => {
        // Only play sound if audio is enabled and app is active
        if (audioEnabled && AppState.currentState === "active") {
          await playNotificationSound(volume, repeatCount);
        }
      });

    return () => {
      if (foregroundListener.current) {
        foregroundListener.current.remove();
      }
    };
  }, [store]);

  // Handle notification tap (deep link to order)
  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const orderId = response.notification.request.content.data?.orderId;
        if (orderId) {
          router.push(`/(admin)/orders/${orderId}` as never);
        }
      });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Polling for new orders (fallback)
  useEffect(() => {
    if (!store?.id) return;

    const s = store as any;
    const audioEnabled = s.enable_audio_notifications !== false;
    const volume = s.notification_volume ?? 80;
    const repeatCount = s.notification_repeat_count ?? 3;

    const checkNewOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, customer_name, total_amount, order_type, status")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const latestOrder = data[0];

        if (
          lastOrderIdRef.current &&
          latestOrder.id !== lastOrderIdRef.current
        ) {
          // Schedule local notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Nuevo pedido",
              body: `${latestOrder.customer_name} - $${latestOrder.total_amount?.toFixed(2)}`,
              data: { orderId: latestOrder.id },
              sound: "default",
            },
            trigger: null,
          });

          // Play audio alert if app is in foreground
          if (audioEnabled && AppState.currentState === "active") {
            await playNotificationSound(volume, repeatCount);
          }
        }

        lastOrderIdRef.current = latestOrder.id;
      }

      // Update badge count
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("store_id", store.id)
        .in("status", ["pending", "confirmed"]);

      setBadgeCount(count ?? 0);
    };

    checkNewOrders();
    const interval = setInterval(checkNewOrders, 5000);

    return () => clearInterval(interval);
  }, [store?.id]);
}
