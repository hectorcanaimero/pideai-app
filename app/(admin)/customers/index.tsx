import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Search } from "lucide-react-native";
import { router } from "expo-router";
import { useCustomers, type Customer } from "@/hooks/useCustomers";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { useStore } from "@/contexts/StoreContext";

export default function CustomersScreen() {
  const { store } = useStore();
  const [search, setSearch] = useState("");
  const {
    data: customers,
    isLoading,
    refetch,
    isRefetching,
  } = useCustomers(search);
  const currency = store?.currency ?? "USD";

  const renderCustomer = useCallback(
    ({ item }: { item: Customer }) => (
      <CustomerCard
        customer={item}
        currency={currency}
        onPress={() =>
          router.push({
            pathname: "/(admin)/customers/[id]",
            params: { id: item.email, name: item.name },
          })
        }
      />
    ),
    [currency]
  );

  return (
    <View className="flex-1 bg-elegant-dark">
      {/* Search */}
      <View className="px-4 pt-3 pb-2">
        <View className="bg-elegant-gray rounded-xl flex-row items-center px-3">
          <Search size={16} color="#666" />
          <TextInput
            className="flex-1 text-white font-sans text-sm py-3 px-2"
            placeholder="Buscar por nombre, email o telefono"
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Count */}
      <View className="px-4 pb-2">
        <Text className="text-cream-400 font-sans text-xs">
          {customers?.length ?? 0} clientes
        </Text>
      </View>

      {/* List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFC300" />
        </View>
      ) : (
        <FlatList
          data={customers}
          renderItem={renderCustomer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#FFC300"
              colors={["#FFC300"]}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-cream-400 font-sans text-base">
                {search ? "Sin resultados" : "No hay clientes aun"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
