import { useContext } from "react";
import { RevenueCatContext } from "../providers/RevenueCatProvider";

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error("useRevenueCat must be used within RevenueCatProvider");
  }
  return context;
}
