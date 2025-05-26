import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CountdownCircleProps = {
  duration: number; // in Sekunden
  radius?: number;
  strokeWidth?: number;
  strokeColor?: string;
  start: boolean;
  onFinish?: () => void;
};

export default function AnimatedCountdownCircle({
  duration,
  radius = 120,
  strokeWidth = 10,
  strokeColor = "#000",
  start,
  onFinish,
}: CountdownCircleProps) {
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(1); // 1 = voller Kreis

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * progress.value,
    strokeOpacity: progress.value === 0 ? 0 : 1,
  }));

  useEffect(() => {
    if (start) {
      progress.value = withTiming(
        0,
        {
          duration: duration * 1000,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished && onFinish) {
            runOnJS(onFinish)();
          }
        }
      );
    } else {
      progress.value = 1; // Reset bei stop
    }
  }, [start]);

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.container}>
        <Svg width={radius * 2 + 50} height={radius * 2 + 50}>
          <Circle
            cx={radius + 20}
            cy={radius + 20}
            r={radius}
            stroke="white"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={radius + 20}
            cy={radius + 20}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            rotation="-90"
            originX={radius + 20}
            originY={radius + 20}
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
    top: "17%",
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    left: "1.8%",
  },
});
