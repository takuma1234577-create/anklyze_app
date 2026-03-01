import React from "react";
import { Text, View } from "react-native";

type Props = {
  score: number;
};

export function SymmetryScore({ score }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <View className="items-center">
      <View className="h-32 w-32 items-center justify-center rounded-full border-4 border-emerald-100 bg-white">
        <Text className="text-3xl font-light text-slate-900">{clamped}%</Text>
      </View>
      <View className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-slate-100">
        <View
          className="h-2 rounded-full bg-emerald-500"
          style={{ width: `${clamped}%` as `${number}%` }}
        />
      </View>
      <Text className="mt-2 text-xs font-semibold tracking-widest text-slate-500">
        SYMMETRY SCORE
      </Text>
    </View>
  );
}
