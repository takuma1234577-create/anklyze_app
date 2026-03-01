import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeviceMotion } from "expo-sensors";
import * as Haptics from "expo-haptics";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";

type UseMeasurementParams = {
  soundEnabled: boolean;
  countdownSeconds: number;
  onAutoLock?: (value: number) => void;
};

const STABLE_THRESHOLD = 0.2;
const STABLE_MS = 1500;
const AUDIO_STEP_THRESHOLD = 0.2;

export function useMeasurement({
  soundEnabled,
  countdownSeconds,
  onAutoLock,
}: UseMeasurementParams) {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [angle, setAngle] = useState(0);
  const [lockedAngle, setLockedAngle] = useState<number | null>(null);

  const stableSinceRef = useRef<number | null>(null);
  const lastStableAngleRef = useRef<number | null>(null);
  const lastAudioAngleRef = useRef<number | null>(null);
  const clickSoundRef = useRef<Audio.Sound | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopCountdownTimer = useCallback(() => {
    if (!countdownTimerRef.current) return;
    clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = null;
  }, []);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(50);
    const prepareAudio = async () => {
      if (!soundEnabled) return;
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
      const { sound } = await Audio.Sound.createAsync({
        uri: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
      });
      clickSoundRef.current = sound;
    };
    prepareAudio().catch(() => {
      // noop
    });
    return () => {
      stopCountdownTimer();
      clickSoundRef.current?.unloadAsync().catch(() => {
        // noop
      });
    };
  }, [soundEnabled, stopCountdownTimer]);

  const notifyAudioByAngle = useCallback(
    async (nextAngle: number) => {
      if (!soundEnabled || !clickSoundRef.current) return;
      const last = lastAudioAngleRef.current;
      if (last !== null && Math.abs(nextAngle - last) < AUDIO_STEP_THRESHOLD) return;
      lastAudioAngleRef.current = nextAngle;

      const normalized = Math.min(2, Math.max(0.75, 0.75 + nextAngle / 40));
      const status = (await clickSoundRef.current.getStatusAsync()) as
        | AVPlaybackStatusSuccess
        | { isLoaded: false };
      if (!status.isLoaded) return;
      await clickSoundRef.current.setRateAsync(normalized, true);
      await clickSoundRef.current.replayAsync();
    },
    [soundEnabled]
  );

  const reset = useCallback(() => {
    setIsMeasuring(false);
    setCountdown(0);
    setAngle(0);
    setLockedAngle(null);
    stableSinceRef.current = null;
    lastStableAngleRef.current = null;
    lastAudioAngleRef.current = null;
    stopCountdownTimer();
  }, [stopCountdownTimer]);

  const lockMeasurement = useCallback(
    async (value: number) => {
      setLockedAngle(value);
      setIsMeasuring(false);
      stableSinceRef.current = null;
      lastStableAngleRef.current = null;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onAutoLock?.(value);
    },
    [onAutoLock]
  );

  useEffect(() => {
    if (!isMeasuring || countdown > 0) return;
    const subscription = DeviceMotion.addListener((event) => {
      const x = event.accelerationIncludingGravity?.x ?? 0;
      const z = event.accelerationIncludingGravity?.z ?? -1;

      const raw = Math.atan2(x, -z) * (180 / Math.PI);
      const rounded = Number(Math.abs(raw).toFixed(1));
      setAngle(rounded);
      notifyAudioByAngle(rounded).catch(() => {
        // noop
      });

      const lastStable = lastStableAngleRef.current;
      const now = Date.now();
      if (lastStable === null || Math.abs(rounded - lastStable) > STABLE_THRESHOLD) {
        lastStableAngleRef.current = rounded;
        stableSinceRef.current = now;
        return;
      }

      if (!stableSinceRef.current) {
        stableSinceRef.current = now;
        return;
      }

      if (now - stableSinceRef.current >= STABLE_MS && lockedAngle === null) {
        lockMeasurement(rounded).catch(() => {
          // noop
        });
      }
    });
    return () => {
      subscription.remove();
    };
  }, [countdown, isMeasuring, lockMeasurement, lockedAngle, notifyAudioByAngle]);

  const startMeasurement = useCallback(() => {
    setLockedAngle(null);
    setIsMeasuring(true);
    setCountdown(countdownSeconds);
    stopCountdownTimer();
    stableSinceRef.current = null;
    lastStableAngleRef.current = null;
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopCountdownTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [countdownSeconds, stopCountdownTimer]);

  return useMemo(
    () => ({
      isMeasuring,
      angle,
      lockedAngle,
      countdown,
      startMeasurement,
      reset,
      lockMeasurement,
    }),
    [angle, countdown, isMeasuring, lockMeasurement, lockedAngle, reset, startMeasurement]
  );
}
