import React, { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useMeasurement } from "../hooks/useMeasurement";
import { useSettings } from "../hooks/useSettings";
import { useAuth } from "../hooks/useAuth";
import { saveHistory } from "../services/history";
import { useRevenueCat } from "../hooks/useRevenueCat";
import { showInterstitialAdIfReady } from "../services/admob";
import { SquatStyle } from "../types/history";
import { PulseRing } from "../components/ankle-pro/PulseRing";
import { Waveform } from "../components/ankle-pro/Waveform";

type FootSide = "left" | "right";

export function MeasurementScreen() {
  const [footSide, setFootSide] = useState<FootSide>("left");
  const [leftAngle, setLeftAngle] = useState<number | null>(null);
  const [rightAngle, setRightAngle] = useState<number | null>(null);
  const [squatStyle, setSquatStyle] = useState<SquatStyle>("high-bar");
  const [saving, setSaving] = useState(false);

  const { soundEnabled, countdownSeconds } = useSettings();
  const { user } = useAuth();
  const { isPremium } = useRevenueCat();

  const onAutoLock = useCallback(async () => {
    if (!isPremium) {
      await showInterstitialAdIfReady();
    }
  }, [isPremium]);

  const measurement = useMeasurement({
    soundEnabled,
    countdownSeconds,
    onAutoLock,
  });

  const diff = useMemo(() => {
    if (leftAngle === null || rightAngle === null) return null;
    return Number(Math.abs(leftAngle - rightAngle).toFixed(1));
  }, [leftAngle, rightAngle]);

  const diagnosis = useMemo(() => {
    if (!isPremium) return "詳細診断はプレミアムで利用できます";
    if (diff === null) return "左右とも計測すると詳細診断を表示します";
    if (diff <= 2) return "左右差は小さく、バランスは良好です。";
    if (diff <= 5) return "軽度の左右差があります。ウォームアップを増やしましょう。";
    return "左右差が大きめです。可動域改善ドリルを推奨します。";
  }, [diff, isPremium]);

  const quickStats = useMemo(() => {
    const savedAngles = [leftAngle, rightAngle].filter((v): v is number => v !== null);
    const current = measurement.lockedAngle ?? measurement.angle;
    const values = savedAngles.length ? savedAngles : [current];
    const peak = Math.max(...values);
    const avg = values.reduce((acc, v) => acc + v, 0) / values.length;
    const range = Math.max(...values) - Math.min(...values);
    return {
      peak: peak.toFixed(1),
      avg: avg.toFixed(1),
      range: range.toFixed(1),
    };
  }, [leftAngle, measurement.angle, measurement.lockedAngle, rightAngle]);

  const applyLockedAngle = useCallback(() => {
    if (measurement.lockedAngle === null) return;
    if (footSide === "left") setLeftAngle(measurement.lockedAngle);
    if (footSide === "right") setRightAngle(measurement.lockedAngle);
  }, [footSide, measurement.lockedAngle]);

  const onSaveSession = useCallback(async () => {
    if (!user) {
      Alert.alert("ログインが必要です", "設定画面からメールまたはGoogleでサインインしてください。");
      return;
    }
    if (leftAngle === null && rightAngle === null) {
      Alert.alert("未計測", "左右どちらかの計測を先に行ってください。");
      return;
    }
    setSaving(true);
    try {
      await saveHistory(user.uid, {
        date: new Date().toISOString(),
        leftAngle,
        rightAngle,
        difference: diff,
        squatStyle,
        createdAtMs: Date.now(),
      });
      Alert.alert("保存完了", "計測結果をクラウドに保存しました。");
    } catch {
      Alert.alert("保存失敗", "ネットワーク状態を確認してください。");
    } finally {
      setSaving(false);
    }
  }, [diff, leftAngle, rightAngle, squatStyle, user]);

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View className="rounded-2xl bg-white p-4">
        <Text className="text-xl font-semibold text-slate-900">AnklePro</Text>
        <Text className="text-xs text-slate-500">Mobility Analysis</Text>
      </View>

      <View className="flex-row rounded-full bg-slate-100 p-1">
        {(["left", "right"] as FootSide[]).map((side) => (
          <Pressable
            key={side}
            onPress={() => setFootSide(side)}
            className={`flex-1 rounded-full px-4 py-2.5 ${
              footSide === side ? "bg-primary" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                footSide === side ? "text-white" : "text-slate-600"
              }`}
            >
              {side === "left" ? "Left Foot" : "Right Foot"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="items-center rounded-2xl bg-white py-6">
        <PulseRing
          degrees={measurement.lockedAngle ?? measurement.angle}
          isActive={measurement.isMeasuring}
        />
        <View className="mt-5 flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-emerald-500" />
          <Text className="text-sm font-medium text-slate-500">
            {measurement.lockedAngle === null ? "Measuring in progress" : "Measurement locked"}
          </Text>
        </View>
        {measurement.countdown > 0 ? (
          <Text className="mt-2 text-sm text-primary">Starting in {measurement.countdown}s</Text>
        ) : null}
      </View>

      <Waveform liveValue={measurement.angle} />

      <View className="flex-row gap-3">
        <QuickStat label="Peak" value={`${quickStats.peak}°`} />
        <QuickStat label="Average" value={`${quickStats.avg}°`} />
        <QuickStat label="Range" value={`${quickStats.range}°`} />
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={measurement.startMeasurement}
          className="flex-1 rounded-xl bg-primary px-4 py-4 active:opacity-85"
        >
          <Text className="text-center font-semibold text-white">計測開始</Text>
        </Pressable>
        <Pressable
          onPress={measurement.reset}
          className="rounded-xl border border-slate-300 bg-white px-5 py-4 active:opacity-85"
        >
          <Text className="font-semibold text-slate-700">リセット</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={applyLockedAngle}
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 active:opacity-85"
      >
        <Text className="text-center font-semibold text-emerald-700">
          この値を{footSide === "left" ? "左足" : "右足"}として確定
        </Text>
      </Pressable>

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="text-base font-semibold text-slate-900">Session Result</Text>
        <Text className="mt-2 text-sm text-slate-700">
          左足: {leftAngle === null ? "-" : `${leftAngle.toFixed(1)}°`}
        </Text>
        <Text className="mt-1 text-sm text-slate-700">
          右足: {rightAngle === null ? "-" : `${rightAngle.toFixed(1)}°`}
        </Text>
        <Text className="mt-1 text-sm text-slate-700">
          左右差: {diff === null ? "-" : `${diff.toFixed(1)}°`}
        </Text>

        <View className="mt-3 flex-row gap-2">
          {(["high-bar", "low-bar", "front-squat"] as SquatStyle[]).map((style) => (
            <Pressable
              key={style}
              onPress={() => setSquatStyle(style)}
              className={`rounded-lg px-3 py-2 ${
                squatStyle === style ? "bg-slate-900" : "bg-slate-100"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  squatStyle === style ? "text-white" : "text-slate-700"
                }`}
              >
                {style}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="text-base font-semibold text-slate-900">Detail Diagnosis</Text>
        <Text className={`mt-2 text-sm ${isPremium ? "text-slate-700" : "text-slate-500"}`}>
          {diagnosis}
        </Text>
      </View>

      <Pressable
        onPress={onSaveSession}
        disabled={saving}
        className={`rounded-xl px-4 py-4 ${saving ? "bg-slate-300" : "bg-slate-900"}`}
      >
        <Text className="text-center font-semibold text-white">
          {saving ? "保存中..." : "セッションを保存"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center rounded-xl bg-white py-3">
      <Text className="text-lg font-medium text-slate-900">{value}</Text>
      <Text className="text-xs text-slate-500">{label}</Text>
    </View>
  );
}
