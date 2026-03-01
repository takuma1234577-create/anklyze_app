import React from "react";
import { Text, View } from "react-native";

type Props = {
  angle: number;
  lockedAngle: number | null;
  countdown: number;
  isMeasuring: boolean;
};

export const AngleGauge = React.memo(function AngleGauge({
  angle,
  lockedAngle,
  countdown,
  isMeasuring,
}: Props) {
  const display = lockedAngle ?? angle;
  return (
    <View className="items-center justify-center rounded-3xl border border-slate-200 bg-white px-10 py-10 shadow-sm">
      <Text className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Dorsiflexion
      </Text>
      <Text className="mt-2 text-6xl font-bold text-slate-900">{display.toFixed(1)}°</Text>
      {countdown > 0 ? (
        <Text className="mt-4 text-sm text-primary">開始まで {countdown} 秒</Text>
      ) : null}
      {isMeasuring && countdown === 0 && lockedAngle === null ? (
        <Text className="mt-4 text-sm text-slate-500">スマホを安定させると自動確定</Text>
      ) : null}
      {lockedAngle !== null ? (
        <Text className="mt-4 text-sm font-semibold text-emerald-600">計測完了</Text>
      ) : null}
    </View>
  );
});
