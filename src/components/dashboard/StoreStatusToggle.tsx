import { useStore } from '@/contexts/StoreContext';
import { supabase } from '@/services/supabase';
import { Store } from 'lucide-react-native';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export function StoreStatusToggle() {
  const { store, reloadStore } = useStore();

  if (!store) return null;

  const isForceOpen = store.force_status === 'force_open';
  const isForceClosed = store.force_status === 'force_closed';
  const isNormal = store.force_status === 'normal' || !store.force_status;

  const toggleStatus = async (newStatus: 'normal' | 'force_open' | 'force_closed') => {
    const labels: Record<string, string> = {
      normal: 'Horario normal',
      force_open: 'Forzar apertura',
      force_closed: 'Forzar cierre',
    };

    Alert.alert('Cambiar estado', `\u00bfCambiar a "${labels[newStatus]}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          const { error } = await supabase.from('stores').update({ force_status: newStatus }).eq('id', store.id);

          if (error) {
            Alert.alert('Error', 'No se pudo cambiar el estado');
          } else {
            await reloadStore();
          }
        },
      },
    ]);
  };

  return (
    <View className="bg-elegant-gray rounded-2xl p-4">
      <View className="flex-row items-center gap-2 mb-3">
        <Store size={18} color="#EB1C8D" />
        <Text className="text-text-primary font-sans-medium text-base">Estado de la tienda</Text>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-xl items-center ${isNormal ? 'bg-gold-500' : 'bg-elegant-dark'}`}
          onPress={() => toggleStatus('normal')}
          activeOpacity={0.7}
        >
          <Text className={`font-sans-medium text-xs ${isNormal ? 'text-text-inverted' : 'text-cream-400'}`}>
            Normal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-xl items-center ${isForceOpen ? 'bg-green-600' : 'bg-elegant-dark'}`}
          onPress={() => toggleStatus('force_open')}
          activeOpacity={0.7}
        >
          <Text className={`font-sans-medium text-xs ${isForceOpen ? 'text-text-primary' : 'text-cream-400'}`}>
            Abrir
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-xl items-center ${isForceClosed ? 'bg-red-600' : 'bg-elegant-dark'}`}
          onPress={() => toggleStatus('force_closed')}
          activeOpacity={0.7}
        >
          <Text className={`font-sans-medium text-xs ${isForceClosed ? 'text-text-primary' : 'text-cream-400'}`}>
            Cerrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
