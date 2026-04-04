import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router, Stack } from "expo-router";
import {
  ShoppingBag,
  ArrowRightLeft,
  PackageX,
  CreditCard,
  Info,
  CheckCheck,
} from "lucide-react-native";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  type AppNotification,
} from "@/hooks/useNotifications";

const TYPE_CONFIG: Record<
  AppNotification["type"],
  { icon: typeof ShoppingBag; color: string; bg: string }
> = {
  new_order: { icon: ShoppingBag, color: "#EB1C8D", bg: "rgba(235,28,141,0.1)" },
  order_status: { icon: ArrowRightLeft, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  low_stock: { icon: PackageX, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  payment: { icon: CreditCard, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  system: { icon: Info, color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function NotificationItem({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: () => void;
}) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;
  const Icon = config.icon;

  return (
    <TouchableOpacity
      className="flex-row px-4 py-3"
      style={{
        backgroundColor: notification.is_read ? "transparent" : "rgba(235,28,141,0.03)",
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: config.bg }}
      >
        <Icon size={18} color={config.color} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            className={`font-sans-${notification.is_read ? "medium" : "bold"} text-sm text-text-primary flex-1`}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text className="text-text-secondary font-sans text-xs ml-2">
            {timeAgo(notification.created_at)}
          </Text>
        </View>
        <Text className="text-text-secondary font-sans text-sm mt-0.5" numberOfLines={2}>
          {notification.body}
        </Text>
      </View>

      {/* Unread dot */}
      {!notification.is_read ? (
        <View className="w-2 h-2 rounded-full bg-brand-pink ml-2 mt-1.5" />
      ) : null}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { data: notifications, isLoading, refetch, isRefetching } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const hasUnread = notifications?.some((n) => !n.is_read);

  const handlePress = useCallback(
    (notification: AppNotification) => {
      if (!notification.is_read) {
        markAsRead.mutate(notification.id);
      }
      // Navigate based on type
      if (notification.type === "new_order" || notification.type === "order_status") {
        const orderId = (notification.data as { orderId?: string })?.orderId;
        if (orderId) {
          router.push(`/(admin)/orders/${orderId}`);
        }
      }
    },
    [markAsRead],
  );

  const renderItem = useCallback(
    ({ item }: { item: AppNotification }) => (
      <NotificationItem notification={item} onPress={() => handlePress(item)} />
    ),
    [handlePress],
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notificaciones",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#EB1C8D",
          headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
          headerRight: hasUnread
            ? () => (
                <TouchableOpacity
                  onPress={() => markAllAsRead.mutate()}
                  activeOpacity={0.7}
                  style={{ marginRight: 4 }}
                >
                  <CheckCheck size={20} color="#EB1C8D" />
                </TouchableOpacity>
              )
            : undefined,
        }}
      />
      <View className="flex-1 bg-background-main">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#EB1C8D" />
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="#EB1C8D"
                colors={["#EB1C8D"]}
              />
            }
            ItemSeparatorComponent={() => (
              <View className="h-px mx-4" style={{ backgroundColor: "rgba(0,0,0,0.05)" }} />
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-20 px-8">
                <View className="bg-white rounded-3xl p-8 items-center w-full">
                  <Info size={48} color="#D4D4D4" />
                  <Text className="text-text-primary font-sans-semibold text-lg mt-4">
                    Sin notificaciones
                  </Text>
                  <Text className="text-text-secondary font-sans text-sm text-center mt-1">
                    Acá vas a ver las alertas de pedidos, stock y pagos
                  </Text>
                </View>
              </View>
            }
          />
        )}
      </View>
    </>
  );
}
