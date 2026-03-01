import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Text, View } from "react-native";

type Props = {
  degrees: number;
  isActive?: boolean;
};

export function PulseRing({ degrees, isActive = true }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const clamped = useMemo(() => Math.max(0, Math.min(90, degrees)), [degrees]);

  useEffect(() => {
    if (!isActive) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.03,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isActive, pulse]);

  const progress = (clamped / 90) * 100;

  return (
    <View className="items-center justify-center">
      <Animated.View
        className="absolute h-72 w-72 rounded-full bg-blue-100/60"
        style={{ transform: [{ scale: pulse }] }}
      />
      <View className="h-64 w-64 items-center justify-center rounded-full border border-slate-200 bg-white">
        <View className="h-56 w-56 items-center justify-center rounded-full border-2 border-blue-100">
          <View className="h-48 w-48 items-center justify-center rounded-full border border-slate-100">
            <Text className="text-6xl font-extralight text-slate-900">{clamped.toFixed(1)}</Text>
            <Text className="mt-1 text-xs font-semibold tracking-widest text-slate-500">
              DEGREES
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
        <View
          className="h-1.5 rounded-full bg-blue-500"
          style={{ width: `${progress}%` as `${number}%` }}
        />
      </View>
    </View>
  );
}
