import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  onPurchase: () => void;
  onRestore: () => void;
};

export function PaywallCard({ onPurchase, onRestore }: Props) {
  return (
    <View className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
      <Text className="text-base font-semibold text-indigo-900">
        Premium (買い切り ¥980)
      </Text>
      <Text className="mt-2 text-sm leading-5 text-indigo-700">
        広告非表示 / 左右差の詳細診断 / クラウド履歴の無制限保存
      </Text>
      <Pressable
        onPress={onPurchase}
        className="mt-3 rounded-xl bg-primary px-4 py-3 active:opacity-80"
      >
        <Text className="text-center font-semibold text-white">プレミアムを購入</Text>
      </Pressable>
      <Pressable onPress={onRestore} className="mt-2 px-4 py-2">
        <Text className="text-center text-sm font-medium text-primary">購入を復元</Text>
      </Pressable>
    </View>
  );
}
