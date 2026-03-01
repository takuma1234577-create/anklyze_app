import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { ENV } from "../config/constants";

let interstitial: InterstitialAd | null = null;
let loaded = false;

function getInterstitial() {
  if (interstitial) return interstitial;
  interstitial = InterstitialAd.createForAdRequest(
    ENV.admobInterstitialId || TestIds.INTERSTITIAL
  );
  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    loaded = true;
  });
  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    loaded = false;
    interstitial?.load();
  });
  return interstitial;
}

export function preloadInterstitialAd() {
  const ad = getInterstitial();
  ad.load();
}

export async function showInterstitialAdIfReady() {
  const ad = getInterstitial();
  if (!loaded) {
    ad.load();
    return;
  }
  await ad.show();
}
