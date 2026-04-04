import { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primary: "#EB1C8D",
  primaryLight: "#F7EBF4",
  gold: "#D4A017",
  goldLight: "#F5D76E",
  background: "#F0EFEF",
  textPrimary: "#1A1A1A",
  textMuted: "rgba(26, 26, 26, 0.3)",
};

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 260,
  mass: 1,
};

interface AnimatedSplashProps {
  onComplete: () => void;
}

export function AnimatedSplash({ onComplete }: AnimatedSplashProps) {
  // Logo animation values
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);

  // Ring animation values
  const ring1Scale = useSharedValue(0.8);
  const ring1Opacity = useSharedValue(0);
  const ring2Scale = useSharedValue(0.9);
  const ring2Opacity = useSharedValue(0);

  // Tagline animation values
  const taglineY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);

  // Loading bar
  const barOpacity = useSharedValue(0);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    // Logo bounce in
    logoOpacity.value = withTiming(1, { duration: 300 });
    logoScale.value = withSpring(1, SPRING_CONFIG);

    // Ring 1 - primary
    ring1Opacity.value = withDelay(
      300,
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 700 })
      )
    );
    ring1Scale.value = withDelay(
      300,
      withTiming(1.6, { duration: 1100, easing: Easing.out(Easing.ease) })
    );

    // Ring 2 - gold
    ring2Opacity.value = withDelay(
      500,
      withSequence(
        withTiming(0.8, { duration: 400 }),
        withTiming(0, { duration: 700 })
      )
    );
    ring2Scale.value = withDelay(
      500,
      withTiming(1.8, { duration: 1100, easing: Easing.out(Easing.ease) })
    );

    // Tagline slide up
    taglineOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 400 })
    );
    taglineY.value = withDelay(500, withSpring(0, SPRING_CONFIG));

    // Loading bar
    barOpacity.value = withDelay(
      800,
      withTiming(1, { duration: 300 })
    );
    barWidth.value = withDelay(
      1000,
      withTiming(1, {
        duration: 1800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );

    // Complete after animation
    const timer = setTimeout(() => {
      logoScale.value = withTiming(1.1, { duration: 300 });
      logoOpacity.value = withTiming(0, { duration: 400 }, () => {
        runOnJS(onComplete)();
      });
      taglineOpacity.value = withTiming(0, { duration: 300 });
      barOpacity.value = withTiming(0, { duration: 300 });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: taglineY.value }],
    opacity: taglineOpacity.value,
  }));

  const barContainerStyle = useAnimatedStyle(() => ({
    opacity: barOpacity.value,
  }));

  const barFillStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%` as any,
  }));

  return (
    <View style={styles.container}>
      {/* Logo area with rings */}
      <View style={styles.logoArea}>
        {/* Glow ring - primary */}
        <Animated.View style={[styles.ring, styles.ringPrimary, ring1Style]} />

        {/* Glow ring - gold */}
        <Animated.View style={[styles.ring, styles.ringGold, ring2Style]} />

        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image
            source={require("../../../assets/images/logo-pideai-1024.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Tagline */}
      <Animated.View style={[styles.tagline, taglineStyle]}>
        <Animated.Text style={styles.taglineFacil}>Fácil </Animated.Text>
        <Animated.Text style={styles.taglineY}>y </Animated.Text>
        <Animated.Text style={styles.taglineRapido}>rápido</Animated.Text>
      </Animated.View>

      {/* Loading bar */}
      <Animated.View style={[styles.barContainer, barContainerStyle]}>
        <Animated.View style={[styles.barFill, barFillStyle]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  logoArea: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  ringPrimary: {
    borderWidth: 2,
    borderColor: "rgba(235, 28, 141, 0.25)",
  },
  ringGold: {
    borderWidth: 1.5,
    borderColor: "rgba(212, 160, 23, 0.2)",
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  tagline: {
    flexDirection: "row",
    marginTop: 32,
    alignItems: "center",
  },
  taglineFacil: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.primary,
    letterSpacing: 2,
  },
  taglineY: {
    fontSize: 24,
    fontFamily: "Poppins-Regular",
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  taglineRapido: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.gold,
    letterSpacing: 2,
  },
  barContainer: {
    marginTop: 48,
    width: 120,
    height: 3,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});
