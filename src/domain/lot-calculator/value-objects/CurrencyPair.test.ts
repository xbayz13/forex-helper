/**
 * Unit tests for CurrencyPair Value Object
 */

import { describe, test, expect } from "bun:test";
import { CurrencyPair } from "./CurrencyPair";

describe("CurrencyPair", () => {
  describe("create", () => {
    test("should create a valid major pair", () => {
      const pair = CurrencyPair.create("EURUSD");
      expect(pair.pair).toBe("EURUSD");
      expect(pair.baseCurrency).toBe("EUR");
      expect(pair.quoteCurrency).toBe("USD");
      expect(pair.type).toBe("major");
    });

    test("should create a valid cross pair", () => {
      const pair = CurrencyPair.create("EURGBP");
      expect(pair.pair).toBe("EURGBP");
      expect(pair.type).toBe("cross");
    });

    test("should create XAU/USD as metal", () => {
      const pair = CurrencyPair.create("XAUUSD");
      expect(pair.pair).toBe("XAUUSD");
      expect(pair.baseCurrency).toBe("XAU");
      expect(pair.quoteCurrency).toBe("USD");
      expect(pair.type).toBe("metal");
    });

    test("should normalize input to uppercase", () => {
      const pair = CurrencyPair.create("eurusd");
      expect(pair.pair).toBe("EURUSD");
    });

    test("should handle pair with slash", () => {
      const pair = CurrencyPair.create("EUR/USD");
      expect(pair.pair).toBe("EURUSD");
    });

    test("should throw error for invalid format (too short)", () => {
      expect(() => CurrencyPair.create("EUR")).toThrow(
        "Invalid currency pair format"
      );
    });

    test("should throw error for invalid format (too long)", () => {
      expect(() => CurrencyPair.create("EURUSDD")).toThrow(
        "Invalid currency pair format"
      );
    });
  });

  describe("isBaseUsd", () => {
    test("should return true for XXX/USD pairs", () => {
      const pair = CurrencyPair.create("EURUSD");
      expect(pair.isBaseUsd()).toBe(true);
    });

    test("should return false for USD/XXX pairs", () => {
      const pair = CurrencyPair.create("USDJPY");
      expect(pair.isBaseUsd()).toBe(false);
    });

    test("should return false for cross pairs", () => {
      const pair = CurrencyPair.create("EURGBP");
      expect(pair.isBaseUsd()).toBe(false);
    });
  });

  describe("isUsdQuote", () => {
    test("should return true for USD/XXX pairs", () => {
      const pair = CurrencyPair.create("USDJPY");
      expect(pair.isUsdQuote()).toBe(true);
    });

    test("should return false for XXX/USD pairs", () => {
      const pair = CurrencyPair.create("EURUSD");
      expect(pair.isUsdQuote()).toBe(false);
    });
  });

  describe("isCrossPair", () => {
    test("should return true for cross pairs", () => {
      const pair = CurrencyPair.create("EURGBP");
      expect(pair.isCrossPair()).toBe(true);
    });

    test("should return false for major pairs", () => {
      const pair = CurrencyPair.create("EURUSD");
      expect(pair.isCrossPair()).toBe(false);
    });

    test("should return false for metal pairs", () => {
      const pair = CurrencyPair.create("XAUUSD");
      expect(pair.isCrossPair()).toBe(false);
    });
  });

  describe("isMetal", () => {
    test("should return true for XAU/USD", () => {
      const pair = CurrencyPair.create("XAUUSD");
      expect(pair.isMetal()).toBe(true);
    });

    test("should return false for other pairs", () => {
      const pair = CurrencyPair.create("EURUSD");
      expect(pair.isMetal()).toBe(false);
    });
  });

  describe("toDisplayString", () => {
    test("should return formatted display string", () => {
      const pair = CurrencyPair.create("EURUSD");
      expect(pair.toDisplayString()).toBe("EUR/USD");
    });
  });

  describe("equals", () => {
    test("should return true for equal pairs", () => {
      const pair1 = CurrencyPair.create("EURUSD");
      const pair2 = CurrencyPair.create("EURUSD");
      expect(pair1.equals(pair2)).toBe(true);
    });

    test("should return false for different pairs", () => {
      const pair1 = CurrencyPair.create("EURUSD");
      const pair2 = CurrencyPair.create("GBPUSD");
      expect(pair1.equals(pair2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return the pair string", () => {
      const pair = CurrencyPair.create("EURUSD");
      expect(pair.toString()).toBe("EURUSD");
    });
  });
});

