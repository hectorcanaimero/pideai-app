import { useStore } from '@/contexts/StoreContext';
import { supabase } from '@/services/supabase';
import { useQuery } from '@tanstack/react-query';
import { Tabs } from 'expo-router';
import { ClipboardList, LayoutDashboard, MoreHorizontal, Package, Users } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AdminLayout() {
  const { store, loading, isStoreOwner } = useStore();

  const { data: pendingCount } = useQuery({
    queryKey: ['pending-orders-count', store?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', store!.id)
        .in('status', ['pending', 'confirmed']);
      return count ?? 0;
    },
    enabled: !!store?.id,
    refetchInterval: 10000,
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark">
        <ActivityIndicator size="large" color="#EB1C8D" />
        <Text className="text-cream-300 mt-4 font-sans">Cargando tienda...</Text>
      </View>
    );
  }

  if (!store || !isStoreOwner) {
    return (
      <View className="flex-1 items-center justify-center bg-elegant-dark px-8">
        <Text className="text-xl font-sans-bold text-text-primary text-center">No tenés acceso a ninguna tienda</Text>
        <Text className="text-cream-400 mt-2 text-center font-sans">Contactá al soporte si creés que es un error.</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5E5',
          borderTopWidth: 1,
          height: 110,
          paddingBottom: 28,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#EB1C8D',
        tabBarInactiveTintColor: '#6B6B6B',
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
          tabBarBadge: pendingCount && pendingCount > 0 ? pendingCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            fontFamily: 'Poppins-Bold',
            fontSize: 10,
          },
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Más',
          tabBarIcon: ({ color, size }) => <MoreHorizontal size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
