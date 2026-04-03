import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { supabase } from "@/services/supabase";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/hooks/useAuth";
import {
  registerForPushNotifications,
  setBadgeCount,
} from "@/services/notificationService";

export function useOrderNotifications() {
  const { store } = useStore();
  const { user } = useAuth();
  const lastOrderIdRef = useRef<string | null>(null);
  const responseListener = useRef<Notifications.EventSubscription>();

  // Register for push notifications
  useEffect(() => {
    if (!user?.id || !store?.id) return;
    registerForPushNotifications(user.id, store.id);
  }, [user?.id, store?.id]);

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
        Notifications.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, []);

  // Polling for new orders (fallback, same as web app pattern)
  useEffect(() => {
    if (!store?.id) return;

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
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Nuevo pedido",
              body: `${latestOrder.customer_name} - $${latestOrder.total_amount?.toFixed(2)}`,
              data: { orderId: latestOrder.id },
              sound: "default",
            },
            trigger: null,
          });
        }

        lastOrderIdRef.current = latestOrder.id;
      }

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
