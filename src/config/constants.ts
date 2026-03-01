export const RC_ENTITLEMENT_PREMIUM = "premium";

export const ENV = {
  firebaseApiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyBlmbNxu4o37V1C2JnMIlNHarIUR_F3TwM",
  firebaseAuthDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "analyze-91625.firebaseapp.com",
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "analyze-91625",
  firebaseStorageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "analyze-91625.firebasestorage.app",
  firebaseMessagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "633190392899",
  firebaseAppId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "1:633190392899:web:4ca00b7130de44384260f6",
  firebaseMeasurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-17XBESZ111",
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
