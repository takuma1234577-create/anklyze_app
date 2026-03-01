import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SymmetryScore } from "../components/ankle-pro/SymmetryScore";
import { PremiumOverlay } from "../components/ankle-pro/PremiumOverlay";
import { useAuth } from "../hooks/useAuth";
import { useRevenueCat } from "../hooks/useRevenueCat";
import { fetchHistory } from "../services/history";
import { HistoryRecord } from "../types/history";

export function AnalysisScreen() {
  const { user } = useAuth();
  const { isPremium, purchasePremium } = useRevenueCat();
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await fetchHistory(user.uid);
    setRecords(data);
  }, [user]);

  useEffect(() => {
    load().catch(() => {
      // noop
    });
  }, [load]);

  const latest = records[0];
  const left = latest?.leftAngle ?? 0;
  const right = latest?.rightAngle ?? 0;
  const difference = latest?.difference ?? Math.abs(left - right);
  const symmetryScore = Math.max(0, Math.min(100, Math.round(100 - difference * 3)));

  const recommendation = useMemo(() => {
    if (!latest) return "まずは計測を1回保存して分析を開始しましょう。";
    if (difference <= 2) return "左右バランスは良好です。現状のルーティン継続を推奨します。";
    if (difference <= 5) return "軽度の左右差があります。弱い側のモビリティを追加しましょう。";
    return "左右差が大きい状態です。段階的な可動域改善ドリルを推奨します。";
  }, [difference, latest]);

  const handleUnlock = useCallback(async () => {
    try {
      await purchasePremium();
    } catch {
      Alert.alert("購入エラー", "購入処理に失敗しました。しばらくして再試行してください。");
    }
  }, [purchasePremium]);

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View className="rounded-2xl bg-white p-4">
        <Text className="text-xs font-semibold tracking-wider text-slate-500">ANALYSIS</Text>
        <Text className="mt-1 text-xl font-semibold text-slate-900">Mobility Insight</Text>
      </View>

      <View className="flex-row gap-3">
        <StatCard title="LEFT" value={left} subtitle="vs last week +1.2°" />
        <StatCard title="RIGHT" value={right} subtitle="vs last week +0.8°" />
      </View>

      <View className="items-center rounded-2xl bg-white p-6">
        <SymmetryScore score={symmetryScore} />
        <Text className="mt-4 text-center text-sm text-slate-600">{recommendation}</Text>
      </View>

      <View className="relative rounded-2xl bg-white p-5">
        {!isPremium ? <PremiumOverlay onUnlock={handleUnlock} /> : null}
        <Text className="mb-4 text-sm font-semibold text-slate-900">Squat Style Suitability</Text>
        {[
          { style: "High Bar Squat", score: Math.max(30, 90 - difference * 2) },
          { style: "Low Bar Squat", score: Math.max(25, 78 - difference * 2) },
          { style: "Front Squat", score: Math.max(20, 72 - difference * 2) },
        ].map((item) => (
          <View key={item.style} className="mb-3 flex-row items-center gap-3">
            <Text className="w-28 text-xs text-slate-500">{item.style}</Text>
            <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
              <View
                className="h-1.5 rounded-full bg-blue-500"
                style={{ width: `${item.score}%` as `${number}%` }}
              />
            </View>
            <Text className="w-10 text-right text-xs font-medium text-slate-900">
              {item.score.toFixed(0)}%
            </Text>
          </View>
        ))}
      </View>

      <View className="rounded-2xl bg-blue-50 p-5">
        <Text className="mb-3 text-sm font-semibold text-slate-900">Recommended Exercises</Text>
        {[
          "Wall ankle stretches - 3 sets, 30 seconds each",
          "Foam rolling calves - 2 minutes per leg",
          "Banded ankle mobilizations - 15 reps each side",
        ].map((item) => (
          <View key={item} className="mb-2 flex-row items-start">
            <View className="mt-1.5 mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <Text className="flex-1 text-sm text-slate-700">{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: number; subtitle: string }) {
  return (
    <View className="flex-1 items-center rounded-2xl bg-white p-5">
      <Text className="text-xs font-semibold tracking-wider text-slate-500">{title}</Text>
      <Text className="mt-2 text-4xl font-light text-slate-900">{value.toFixed(1)}°</Text>
      <Text className="mt-3 text-xs text-emerald-600">{subtitle}</Text>
    </View>
  );
}
