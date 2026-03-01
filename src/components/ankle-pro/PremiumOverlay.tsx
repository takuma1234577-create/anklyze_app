import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  onUnlock: () => void;
};

export function PremiumOverlay({ onUnlock }: Props) {
  return (
    <View className="absolute inset-0 z-20 items-center justify-center rounded-2xl bg-white/85 px-6">
      <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <Text className="text-lg">🔒</Text>
      </View>
      <Text className="text-center text-lg font-semibold text-slate-900">Premium Feature</Text>
      <Text className="mt-2 text-center text-sm text-slate-600">
        詳細なスクワット適性分析とパーソナル提案を解放できます
      </Text>
      <Pressable
        onPress={onUnlock}
        className="mt-5 rounded-xl bg-primary px-5 py-3 active:opacity-85"
      >
        <Text className="font-semibold text-white">Unlock Premium - ¥980</Text>
      </Pressable>
    </View>
  );
}
