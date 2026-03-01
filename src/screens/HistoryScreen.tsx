import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useRevenueCat } from "../hooks/useRevenueCat";
import { fetchHistory } from "../services/history";
import { HistoryRecord } from "../types/history";
import { HistoryChart } from "../components/ankle-pro/HistoryChart";
import { SessionList } from "../components/ankle-pro/SessionList";

export function HistoryScreen() {
  const { user } = useAuth();
  const { isPremium } = useRevenueCat();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchHistory(user.uid);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load().catch(() => {
      // noop
    });
  }, [load]);

  const visible = useMemo(
    () => (isPremium ? records : records.slice(0, 5)),
    [isPremium, records]
  );

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <View className="rounded-2xl bg-blue-50 p-5">
        <Text className="text-xs font-semibold tracking-wider text-slate-500">7-DAY TREND</Text>
        <Text className="mt-1 text-3xl font-light text-slate-900">
          {visible.length >= 2
            ? `${(
                Math.max(visible[0].leftAngle ?? 0, visible[0].rightAngle ?? 0) -
                Math.max(
                  visible[visible.length - 1].leftAngle ?? 0,
                  visible[visible.length - 1].rightAngle ?? 0
                )
              ).toFixed(1)}°`
            : "0.0°"}
        </Text>
      </View>

      {!isPremium ? (
        <View className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <Text className="text-sm text-amber-800">
            無料版では最新5件まで表示。プレミアムで無制限履歴と詳細グラフを解放できます。
          </Text>
        </View>
      ) : null}

      <View className="rounded-2xl bg-white p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-slate-900">Mobility Trends</Text>
          <View className="flex-row gap-4">
            <View className="flex-row items-center">
              <View className="mr-1 h-2 w-2 rounded-full bg-blue-500" />
              <Text className="text-xs text-slate-500">Left</Text>
            </View>
            <View className="flex-row items-center">
              <View className="mr-1 h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs text-slate-500">Right</Text>
            </View>
          </View>
        </View>
        <HistoryChart sessions={visible.slice(0, 7)} />
      </View>

      <View>
        <Text className="mb-3 text-sm font-semibold text-slate-900">Recent Sessions</Text>
        <SessionList sessions={visible.slice(0, 8)} />
      </View>

      {!visible.length ? (
        <View className="rounded-2xl border border-slate-200 bg-white p-5">
          <Text className="text-sm text-slate-600">まだ履歴がありません。計測して保存してください。</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
