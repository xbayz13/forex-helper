import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency pair with "/" separator
 * Example: "EURUSD" -> "EUR/USD", "XAUUSD" -> "XAU/USD"
 */
export function formatCurrencyPair(pair: string): string {
  if (!pair) return pair;
  
  // If already has "/", return as is
  if (pair.includes("/")) {
    return pair;
  }
  
  // For standard pairs (3 chars base, 3 chars quote)
  // This works for most pairs including XAU/USD (XAU is 3 chars, USD is 3 chars)
  if (pair.length >= 6) {
    return `${pair.slice(0, 3)}/${pair.slice(3)}`;
  }
  
  // For pairs with unusual length, try to split after 3 chars
  if (pair.length >= 4) {
    return `${pair.slice(0, 3)}/${pair.slice(3)}`;
  }
  
  return pair;
}

/**
 * Normalize currency pair (remove "/" if present)
 * Example: "EUR/USD" -> "EURUSD", "EURUSD" -> "EURUSD"
 */
export function normalizeCurrencyPair(pair: string): string {
  if (!pair) return pair;
  return pair.replace("/", "");
}
