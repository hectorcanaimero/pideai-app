import { View, Text } from "react-native";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle?: string;
}

export function StatCard({ icon, label, value, subtitle }: StatCardProps) {
  return (
    <View className="bg-elegant-gray rounded-2xl p-4 flex-1 min-w-[140px]">
      <View className="flex-row items-center gap-2 mb-2">
        {icon}
        <Text className="text-cream-400 font-sans text-xs">{label}</Text>
      </View>
      <Text className="text-white font-sans-bold text-2xl">{value}</Text>
      {subtitle && (
        <Text className="text-cream-400 font-sans text-xs mt-1">{subtitle}</Text>
      )}
    </View>
  );
}
