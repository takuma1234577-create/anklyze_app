import React, { useMemo, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useRevenueCat } from "../hooks/useRevenueCat";
import { PaywallCard } from "../components/PaywallCard";
import { useSettings } from "../hooks/useSettings";
import { ENV } from "../config/constants";

export function SettingsScreen() {
  const {
    user,
    isAnonymous,
    anonymousRestricted,
    linkWithGoogle,
    linkWithEmail,
    signInEmail,
    logout,
  } = useAuth();
  const { isPremium, purchasePremium, restorePurchases } = useRevenueCat();
  const { countdownSeconds, soundEnabled, updateSettings } = useSettings();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const accountLabel = useMemo(() => {
    if (!user) return "未ログイン";
    if (isAnonymous) return "匿名アカウント";
    return user.email ?? "Google連携済み";
  }, [isAnonymous, user]);

  const guardBusy = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } catch {
      Alert.alert("エラー", "処理に失敗しました。入力値や接続状態を確認してください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text className="text-2xl font-bold text-slate-900">設定</Text>

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="text-base font-semibold text-slate-900">アカウント</Text>
        <Text className="mt-2 text-sm text-slate-700">状態: {accountLabel}</Text>
        {anonymousRestricted ? (
          <View className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <Text className="text-xs text-amber-800">
              Firebase側で匿名認証が無効です。メールまたはGoogleでサインインしてください。
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => guardBusy(linkWithGoogle)}
          className="mt-3 rounded-xl border border-slate-300 bg-white px-4 py-3 active:opacity-80"
        >
          <Text className="text-center font-semibold text-slate-700">
            Googleで連携する
          </Text>
        </Pressable>

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="email@example.com"
          keyboardType="email-address"
          className="mt-3 rounded-xl border border-slate-300 px-3 py-3 text-slate-900"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="パスワード"
          secureTextEntry
          className="mt-2 rounded-xl border border-slate-300 px-3 py-3 text-slate-900"
        />
        <View className="mt-2 flex-row gap-2">
          <Pressable
            onPress={() => guardBusy(() => linkWithEmail(email, password))}
            className="flex-1 rounded-xl bg-slate-900 px-3 py-3 active:opacity-80"
          >
            <Text className="text-center text-sm font-semibold text-white">メール連携</Text>
          </Pressable>
          <Pressable
            onPress={() => guardBusy(() => signInEmail(email, password))}
            className="flex-1 rounded-xl bg-slate-100 px-3 py-3 active:opacity-80"
          >
            <Text className="text-center text-sm font-semibold text-slate-700">
              メールログイン
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => guardBusy(logout)}
          className="mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 active:opacity-80"
        >
          <Text className="text-center font-semibold text-red-700">ログアウト</Text>
        </Pressable>
      </View>

      {!isPremium ? (
        <PaywallCard
          onPurchase={() => guardBusy(purchasePremium)}
          onRestore={() => guardBusy(restorePurchases)}
        />
      ) : (
        <View className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <Text className="text-sm font-semibold text-emerald-700">
            Premium有効: 広告は非表示です
          </Text>
        </View>
      )}

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="text-base font-semibold text-slate-900">計測設定</Text>
        <Text className="mt-2 text-sm text-slate-700">カウントダウン秒数</Text>
        <View className="mt-2 flex-row gap-2">
          {[2, 3, 5].map((sec) => (
            <Pressable
              key={sec}
              onPress={() => updateSettings({ countdownSeconds: sec })}
              className={`rounded-xl px-4 py-2 ${
                countdownSeconds === sec ? "bg-primary" : "bg-slate-100"
              }`}
            >
              <Text
                className={`font-semibold ${
                  countdownSeconds === sec ? "text-white" : "text-slate-700"
                }`}
              >
                {sec}秒
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-sm text-slate-700">効果音</Text>
          <Switch
            value={soundEnabled}
            onValueChange={(next) => {
              updateSettings({ soundEnabled: next }).catch(() => {
                // noop
              });
            }}
          />
        </View>
      </View>

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <Pressable onPress={() => Linking.openURL(ENV.termsUrl)}>
          <Text className="font-medium text-primary">利用規約</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(ENV.privacyUrl)} className="mt-3">
          <Text className="font-medium text-primary">プライバシーポリシー</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
