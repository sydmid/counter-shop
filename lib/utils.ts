import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function parseTradeUrl(url: string): { partnerId: string; token: string } | null {
  try {
    const parsed = new URL(url);
    const partnerId = parsed.searchParams.get("partner");
    const token = parsed.searchParams.get("token");
    if (!partnerId || !token) return null;
    return { partnerId, token };
  } catch {
    return null;
  }
}

export function getRarityColor(rarity: string): string {
  const r = rarity.toUpperCase();
  switch (r) {
    case "COVERT":
    case "ANCIENT":
      return "#eb4b4b";
    case "CLASSIFIED":
    case "LEGENDARY":
      return "#d32ce6";
    case "RESTRICTED":
    case "MYTHICAL":
      return "#8847ff";
    case "MIL_SPEC":
    case "RARE":
      return "#4b69ff";
    case "INDUSTRIAL":
    case "UNCOMMON":
      return "#5e98d9";
    case "CONSUMER":
    case "COMMON":
      return "#b0c3d9";
    case "CONTRABAND":
      return "#e4ae39";
    case "EXTRAORDINARY":
    case "IMMORTAL":
      return "#ffd700";
    case "ARCANA":
      return "#ade55c";
    default:
      return "#888888";
  }
}

export function getConditionLabel(condition: string): string {
  switch (condition) {
    case "FACTORY_NEW":
      return "FN";
    case "MINIMAL_WEAR":
      return "MW";
    case "FIELD_TESTED":
      return "FT";
    case "WELL_WORN":
      return "WW";
    case "BATTLE_SCARRED":
      return "BS";
    default:
      return "N/A";
  }
}
