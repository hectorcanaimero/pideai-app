import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, className }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={{
        width: width as any,
        height,
        borderRadius,
        backgroundColor: "#2A2A2A",
        opacity,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <View className="bg-elegant-gray rounded-2xl p-4 mb-3">
      <View className="flex-row items-center gap-3 mb-3">
        <Skeleton width={44} height={44} borderRadius={22} />
        <View className="flex-1 gap-2">
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={10} />
        </View>
      </View>
      <Skeleton width="80%" height={12} />
    </View>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View className="p-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}
