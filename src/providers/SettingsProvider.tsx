import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

type SettingsState = {
  countdownSeconds: number;
  soundEnabled: boolean;
};

type SettingsContextValue = SettingsState & {
  updateSettings: (next: Partial<SettingsState>) => Promise<void>;
};

const SETTINGS_KEY = "anklepro/settings";

export const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<SettingsState>;
      if (typeof parsed.countdownSeconds === "number") {
        setCountdownSeconds(parsed.countdownSeconds);
      }
      if (typeof parsed.soundEnabled === "boolean") {
        setSoundEnabled(parsed.soundEnabled);
      }
    };
    load().catch(() => {
      // noop
    });
  }, []);

  const updateSettings = useCallback(
    async (next: Partial<SettingsState>) => {
      const merged = {
        countdownSeconds:
          next.countdownSeconds === undefined
            ? countdownSeconds
            : next.countdownSeconds,
        soundEnabled:
          next.soundEnabled === undefined ? soundEnabled : next.soundEnabled,
      };
      setCountdownSeconds(merged.countdownSeconds);
      setSoundEnabled(merged.soundEnabled);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    },
    [countdownSeconds, soundEnabled]
  );

  const value = useMemo<SettingsContextValue>(
    () => ({ countdownSeconds, soundEnabled, updateSettings }),
    [countdownSeconds, soundEnabled, updateSettings]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}
