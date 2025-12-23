/**
 * Unit tests for AccountCurrency Value Object
 */

import { describe, test, expect } from "bun:test";
import { AccountCurrency } from "./AccountCurrency";

describe("AccountCurrency", () => {
  describe("create", () => {
    test("should create a valid USD currency", () => {
      const currency = AccountCurrency.create("USD");
      expect(currency.currency).toBe("USD");
    });

    test("should create all supported currencies", () => {
      const supported = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "NZD", "IDR"];
      supported.forEach(code => {
        const currency = AccountCurrency.create(code);
        expect(currency.currency).toBe(code);
      });
    });

    test("should convert to uppercase", () => {
      const currency = AccountCurrency.create("usd");
      expect(currency.currency).toBe("USD");
    });

    test("should throw error for unsupported currency", () => {
      expect(() => AccountCurrency.create("XYZ")).toThrow(
        "Unsupported currency"
      );
    });
  });

  describe("currency", () => {
    test("should return the currency code", () => {
      const currency = AccountCurrency.create("EUR");
      expect(currency.currency).toBe("EUR");
    });
  });

  describe("getSupportedCurrencies", () => {
    test("should return all supported currencies", () => {
      const supported = AccountCurrency.getSupportedCurrencies();
      expect(supported.length).toBeGreaterThan(0);
      expect(supported).toContain("USD");
      expect(supported).toContain("EUR");
    });
  });

  describe("isSupported", () => {
    test("should return true for supported currencies", () => {
      expect(AccountCurrency.isSupported("USD")).toBe(true);
      expect(AccountCurrency.isSupported("usd")).toBe(true);
      expect(AccountCurrency.isSupported("EUR")).toBe(true);
    });

    test("should return false for unsupported currencies", () => {
      expect(AccountCurrency.isSupported("XYZ")).toBe(false);
      expect(AccountCurrency.isSupported("BTC")).toBe(false);
    });
  });

  describe("equals", () => {
    test("should return true for equal currencies", () => {
      const currency1 = AccountCurrency.create("USD");
      const currency2 = AccountCurrency.create("USD");
      expect(currency1.equals(currency2)).toBe(true);
    });

    test("should return false for different currencies", () => {
      const currency1 = AccountCurrency.create("USD");
      const currency2 = AccountCurrency.create("EUR");
      expect(currency1.equals(currency2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return the currency code", () => {
      const currency = AccountCurrency.create("USD");
      expect(currency.toString()).toBe("USD");
    });
  });
});

