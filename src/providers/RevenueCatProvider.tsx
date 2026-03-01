import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

type RevenueCatContextValue = {
  ready: boolean;
  isPremium: boolean;
  currentOffering: null;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
};

export const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(
  undefined
);

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setReady(true);
    setIsPremium(false);
  }, []);

  const purchasePremium = useCallback(async () => {
    return;
  }, []);

  const restorePurchases = useCallback(async () => {
    return;
  }, []);

  const value = useMemo<RevenueCatContextValue>(
    () => ({ ready, isPremium, currentOffering: null, purchasePremium, restorePurchases }),
    [isPremium, purchasePremium, ready, restorePurchases]
  );

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
}
