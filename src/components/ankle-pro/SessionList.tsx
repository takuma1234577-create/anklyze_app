import React from "react";
import { Text, View } from "react-native";
import { HistoryRecord } from "../../types/history";

type Props = {
  sessions: HistoryRecord[];
};

export function SessionList({ sessions }: Props) {
  return (
    <View className="gap-2">
      {sessions.map((session) => (
        <View key={session.id} className="flex-row items-center justify-between rounded-xl bg-white p-4">
          <View>
            <Text className="text-sm font-medium text-slate-900">
              {new Date(session.date).toLocaleDateString()}
            </Text>
            <Text className="text-xs text-slate-500">
              {new Date(session.date).toLocaleTimeString()}
            </Text>
          </View>
          <View className="flex-row gap-4">
            <Metric label="L" value={session.leftAngle} colorClassName="text-blue-600" />
            <Metric label="R" value={session.rightAngle} colorClassName="text-emerald-600" />
            <Metric
              label="Sym"
              value={session.difference === null ? null : Number((100 - session.difference * 3).toFixed(0))}
              suffix="%"
              colorClassName="text-slate-900"
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function Metric({
  label,
  value,
  suffix = "°",
  colorClassName,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  colorClassName: string;
}) {
  return (
    <View className="items-end">
      <Text className="text-[11px] text-slate-500">{label}</Text>
      <Text className={`text-xs font-semibold ${colorClassName}`}>
        {value === null ? "-" : `${value}${suffix}`}
      </Text>
    </View>
  );
}
