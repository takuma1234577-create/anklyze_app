import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

type Props = {
  liveValue: number;
};

export function Waveform({ liveValue }: Props) {
  const [bars, setBars] = useState<number[]>(
    Array.from({ length: 36 }, () => 12 + Math.random() * 18)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setBars((prev) => {
        const next = [...prev.slice(1)];
        const base = 10 + Math.min(30, liveValue * 0.4);
        next.push(base + Math.random() * 10);
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [liveValue]);

  const max = useMemo(() => Math.max(...bars, 1), [bars]);

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-xs font-semibold tracking-widest text-slate-500">SENSOR ACTIVITY</Text>
        <View className="flex-row items-center">
          <View className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <Text className="text-xs font-semibold text-emerald-600">LIVE</Text>
        </View>
      </View>
      <View className="h-14 flex-row items-end gap-[2px]">
        {bars.map((value, idx) => {
          const height = Math.max(4, (value / max) * 46);
          return (
            <View
              key={`bar-${idx}`}
              className="flex-1 rounded-full bg-blue-400/80"
              style={{ height }}
            />
          );
        })}
      </View>
    </View>
  );
}
