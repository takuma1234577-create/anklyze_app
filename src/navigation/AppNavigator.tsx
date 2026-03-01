import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MeasurementScreen } from "../screens/MeasurementScreen";
import { AnalysisScreen } from "../screens/AnalysisScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { useAuth } from "../hooks/useAuth";
import { preloadInterstitialAd } from "../services/admob";
import { useRevenueCat } from "../hooks/useRevenueCat";

type RootTabParamList = {
  Measure: undefined;
  Analysis: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  const { initializing } = useAuth();
  const { isPremium } = useRevenueCat();

  useEffect(() => {
    if (!isPremium) preloadInterstitialAd();
  }, [isPremium]);

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="mt-2 text-slate-600">認証情報を読み込み中...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerShadowVisible: false,
          tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: "#E2E8F0" },
          tabBarActiveTintColor: "#2563EB",
          tabBarInactiveTintColor: "#64748B",
        }}
      >
        <Tab.Screen
          name="Measure"
          component={MeasurementScreen}
          options={{ title: "計測" }}
        />
        <Tab.Screen
          name="Analysis"
          component={AnalysisScreen}
          options={{ title: "分析" }}
        />
        <Tab.Screen name="History" component={HistoryScreen} options={{ title: "履歴" }} />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "設定" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
