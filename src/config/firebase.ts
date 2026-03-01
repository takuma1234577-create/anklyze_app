import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import type { Analytics } from "firebase/analytics";
import { ENV } from "./constants";

const firebaseConfig = {
  apiKey: ENV.firebaseApiKey,
  authDomain: ENV.firebaseAuthDomain,
  projectId: ENV.firebaseProjectId,
  storageBucket: ENV.firebaseStorageBucket,
  messagingSenderId: ENV.firebaseMessagingSenderId,
  appId: ENV.firebaseAppId,
  measurementId: ENV.firebaseMeasurementId,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = (() => {
  try {
    return getAuth(firebaseApp);
  } catch {
    return initializeAuth(firebaseApp);
  }
})();

export const db = getFirestore(firebaseApp);

export let analytics: Analytics | null = null;

if (Platform.OS === "web" && typeof window !== "undefined") {
  import("firebase/analytics")
    .then(async ({ getAnalytics, isSupported }) => {
      if (await isSupported()) {
        analytics = getAnalytics(firebaseApp);
      }
    })
    .catch(() => {
      analytics = null;
    });
}
