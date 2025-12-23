/**
 * Unit tests for AccountBalance Value Object
 */

import { describe, test, expect } from "bun:test";
import { AccountBalance } from "./AccountBalance";

describe("AccountBalance", () => {
  describe("create", () => {
    test("should create a valid account balance", () => {
      const balance = AccountBalance.create(10000, "USD");
      expect(balance.amount).toBe(10000);
      expect(balance.currency).toBe("USD");
    });

    test("should create account balance with 0", () => {
      const balance = AccountBalance.create(0, "EUR");
      expect(balance.amount).toBe(0);
      expect(balance.currency).toBe("EUR");
    });

    test("should convert currency to uppercase", () => {
      const balance = AccountBalance.create(1000, "usd");
      expect(balance.currency).toBe("USD");
    });

    test("should throw error for negative amount", () => {
      expect(() => AccountBalance.create(-100, "USD")).toThrow(
        "Account balance cannot be negative"
      );
    });

    test("should throw error for invalid currency (empty)", () => {
      expect(() => AccountBalance.create(1000, "")).toThrow(
        "Currency must be a 3-letter code (e.g., USD, EUR)"
      );
    });

    test("should throw error for invalid currency (too short)", () => {
      expect(() => AccountBalance.create(1000, "US")).toThrow(
        "Currency must be a 3-letter code (e.g., USD, EUR)"
      );
    });

    test("should throw error for invalid currency (too long)", () => {
      expect(() => AccountBalance.create(1000, "USDD")).toThrow(
        "Currency must be a 3-letter code (e.g., USD, EUR)"
      );
    });
  });

  describe("amount", () => {
    test("should return the correct amount", () => {
      const balance = AccountBalance.create(5000, "USD");
      expect(balance.amount).toBe(5000);
    });
  });

  describe("currency", () => {
    test("should return the correct currency", () => {
      const balance = AccountBalance.create(1000, "EUR");
      expect(balance.currency).toBe("EUR");
    });

    test("should return uppercase currency", () => {
      const balance = AccountBalance.create(1000, "jpy");
      expect(balance.currency).toBe("JPY");
    });
  });

  describe("equals", () => {
    test("should return true for equal balances", () => {
      const balance1 = AccountBalance.create(1000, "USD");
      const balance2 = AccountBalance.create(1000, "USD");
      expect(balance1.equals(balance2)).toBe(true);
    });

    test("should return false for different amounts", () => {
      const balance1 = AccountBalance.create(1000, "USD");
      const balance2 = AccountBalance.create(2000, "USD");
      expect(balance1.equals(balance2)).toBe(false);
    });

    test("should return false for different currencies", () => {
      const balance1 = AccountBalance.create(1000, "USD");
      const balance2 = AccountBalance.create(1000, "EUR");
      expect(balance1.equals(balance2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return formatted string", () => {
      const balance = AccountBalance.create(1000.50, "USD");
      expect(balance.toString()).toBe("USD 1000.50");
    });

    test("should return formatted string for 0", () => {
      const balance = AccountBalance.create(0, "EUR");
      expect(balance.toString()).toBe("EUR 0.00");
    });
  });
});

