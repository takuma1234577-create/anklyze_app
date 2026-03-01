import { Platform } from "react-native";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import Purchases, { PurchasesOffering, CustomerInfo } from "react-native-purchases";
import { ENV, RC_ENTITLEMENT_PREMIUM } from "../config/constants";

type RevenueCatContextValue = {
  ready: boolean;
  isPremium: boolean;
  currentOffering: PurchasesOffering | null;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
};

export const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(
  undefined
);

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(
    null
  );

  const syncCustomerInfo = useCallback((info: CustomerInfo) => {
    setIsPremium(Boolean(info.entitlements.active[RC_ENTITLEMENT_PREMIUM]));
  }, []);

  useEffect(() => {
    const configure = async () => {
      const apiKey =
        Platform.OS === "ios"
          ? ENV.revenueCatApiKeyIos
          : ENV.revenueCatApiKeyAndroid;
      if (!apiKey) {
        setReady(true);
        return;
      }

      await Purchases.configure({ apiKey });
      const info = await Purchases.getCustomerInfo();
      syncCustomerInfo(info);
      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current ?? null);
      setReady(true);
    };

    configure().catch(() => {
      setReady(true);
    });
  }, [syncCustomerInfo]);

  const purchasePremium = useCallback(async () => {
    if (!currentOffering?.availablePackages.length) return;
    const pkg = currentOffering.availablePackages[0];
    const result = await Purchases.purchasePackage(pkg);
    syncCustomerInfo(result.customerInfo);
  }, [currentOffering, syncCustomerInfo]);

  const restorePurchases = useCallback(async () => {
    const info = await Purchases.restorePurchases();
    syncCustomerInfo(info);
  }, [syncCustomerInfo]);

  const value = useMemo<RevenueCatContextValue>(
    () => ({ ready, isPremium, currentOffering, purchasePremium, restorePurchases }),
    [currentOffering, isPremium, purchasePremium, ready, restorePurchases]
  );

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
}
