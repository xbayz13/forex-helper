/**
 * Unit tests for Drawdown Value Object
 */

import { describe, test, expect } from "bun:test";
import { Drawdown } from "./Drawdown";

describe("Drawdown", () => {
  describe("create", () => {
    test("should create a valid drawdown", () => {
      const drawdown = Drawdown.create(10, 1000, "USD");
      expect(drawdown.percentage).toBe(10);
      expect(drawdown.amount).toBe(1000);
      expect(drawdown.currency).toBe("USD");
    });

    test("should create drawdown with 0", () => {
      const drawdown = Drawdown.create(0, 0, "USD");
      expect(drawdown.percentage).toBe(0);
      expect(drawdown.amount).toBe(0);
    });

    test("should convert currency to uppercase", () => {
      const drawdown = Drawdown.create(10, 1000, "usd");
      expect(drawdown.currency).toBe("USD");
    });

    test("should throw error for negative percentage", () => {
      expect(() => Drawdown.create(-1, 1000, "USD")).toThrow(
        "Drawdown percentage must be between 0 and 100"
      );
    });

    test("should throw error for percentage > 100", () => {
      expect(() => Drawdown.create(101, 1000, "USD")).toThrow(
        "Drawdown percentage must be between 0 and 100"
      );
    });

    test("should throw error for negative amount", () => {
      expect(() => Drawdown.create(10, -1000, "USD")).toThrow(
        "Drawdown amount cannot be negative"
      );
    });

    test("should throw error for invalid currency", () => {
      expect(() => Drawdown.create(10, 1000, "US")).toThrow(
        "Currency must be a 3-letter code"
      );
    });
  });

  describe("percentage", () => {
    test("should return the percentage", () => {
      const drawdown = Drawdown.create(15, 1500, "USD");
      expect(drawdown.percentage).toBe(15);
    });
  });

  describe("amount", () => {
    test("should return the amount", () => {
      const drawdown = Drawdown.create(10, 1000, "USD");
      expect(drawdown.amount).toBe(1000);
    });
  });

  describe("currency", () => {
    test("should return the currency", () => {
      const drawdown = Drawdown.create(10, 1000, "EUR");
      expect(drawdown.currency).toBe("EUR");
    });
  });

  describe("isSignificant", () => {
    test("should return true for drawdown > 20%", () => {
      const drawdown = Drawdown.create(21, 2100, "USD");
      expect(drawdown.isSignificant()).toBe(true);
    });

    test("should return false for drawdown <= 20%", () => {
      const drawdown = Drawdown.create(20, 2000, "USD");
      expect(drawdown.isSignificant()).toBe(false);
    });

    test("should return false for small drawdown", () => {
      const drawdown = Drawdown.create(5, 500, "USD");
      expect(drawdown.isSignificant()).toBe(false);
    });
  });

  describe("equals", () => {
    test("should return true for equal drawdowns", () => {
      const drawdown1 = Drawdown.create(10, 1000, "USD");
      const drawdown2 = Drawdown.create(10, 1000, "USD");
      expect(drawdown1.equals(drawdown2)).toBe(true);
    });

    test("should return false for different percentages", () => {
      const drawdown1 = Drawdown.create(10, 1000, "USD");
      const drawdown2 = Drawdown.create(20, 1000, "USD");
      expect(drawdown1.equals(drawdown2)).toBe(false);
    });

    test("should return false for different amounts", () => {
      const drawdown1 = Drawdown.create(10, 1000, "USD");
      const drawdown2 = Drawdown.create(10, 2000, "USD");
      expect(drawdown1.equals(drawdown2)).toBe(false);
    });

    test("should return false for different currencies", () => {
      const drawdown1 = Drawdown.create(10, 1000, "USD");
      const drawdown2 = Drawdown.create(10, 1000, "EUR");
      expect(drawdown1.equals(drawdown2)).toBe(false);
    });

    test("should handle floating point comparison", () => {
      const drawdown1 = Drawdown.create(10.001, 1000.01, "USD");
      const drawdown2 = Drawdown.create(10.002, 1000.02, "USD");
      expect(drawdown1.equals(drawdown2)).toBe(true);
    });
  });

  describe("toString", () => {
    test("should return formatted string", () => {
      const drawdown = Drawdown.create(10.5, 1050.25, "USD");
      expect(drawdown.toString()).toBe("10.50% (USD 1050.25)");
    });
  });
});

