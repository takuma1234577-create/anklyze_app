import React, { useMemo } from "react";
import { View } from "react-native";
import { HistoryRecord } from "../../types/history";

type Props = {
  sessions: HistoryRecord[];
};

export function HistoryChart({ sessions }: Props) {
  const max = useMemo(() => {
    const values = sessions.flatMap((x) => [x.leftAngle ?? 0, x.rightAngle ?? 0]);
    return Math.max(...values, 1);
  }, [sessions]);

  return (
    <View className="h-44 flex-row items-end gap-2">
      {sessions.map((item) => {
        const left = ((item.leftAngle ?? 0) / max) * 100;
        const right = ((item.rightAngle ?? 0) / max) * 100;
        return (
          <View key={item.id} className="flex-1 flex-row items-end justify-center gap-1">
            <View
              className="w-2 rounded-full bg-blue-500"
              style={{ height: `${Math.max(4, left)}%` as `${number}%` }}
            />
            <View
              className="w-2 rounded-full bg-emerald-500"
              style={{ height: `${Math.max(4, right)}%` as `${number}%` }}
            />
          </View>
        );
      })}
    </View>
  );
}
