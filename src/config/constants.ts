export const RC_ENTITLEMENT_PREMIUM = "premium";

export const ENV = {
  firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  firebaseMessagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
  revenueCatApiKeyIos: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? "",
  revenueCatApiKeyAndroid:
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? "",
  admobInterstitialId:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ?? "ca-app-pub-3940256099942544/1033173712",
  googleClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
  termsUrl: process.env.EXPO_PUBLIC_TERMS_URL ?? "https://example.com/terms",
  privacyUrl:
    process.env.EXPO_PUBLIC_PRIVACY_URL ?? "https://example.com/privacy",
};
