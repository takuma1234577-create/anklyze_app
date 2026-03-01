import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { ENV } from "./constants";

const firebaseConfig = {
  apiKey: ENV.firebaseApiKey,
  authDomain: ENV.firebaseAuthDomain,
  projectId: ENV.firebaseProjectId,
  storageBucket: ENV.firebaseStorageBucket,
  messagingSenderId: ENV.firebaseMessagingSenderId,
  appId: ENV.firebaseAppId,
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
