/**
 * Unit tests for ProfitLoss Value Object
 */

import { describe, test, expect } from "bun:test";
import { ProfitLoss } from "./ProfitLoss";

describe("ProfitLoss", () => {
  describe("create", () => {
    test("should create a profit", () => {
      const profit = ProfitLoss.create(100, "USD");
      expect(profit.amount).toBe(100);
      expect(profit.currency).toBe("USD");
    });

    test("should create a loss", () => {
      const loss = ProfitLoss.create(-50, "USD");
      expect(loss.amount).toBe(-50);
    });

    test("should convert currency to uppercase", () => {
      const profit = ProfitLoss.create(100, "usd");
      expect(profit.currency).toBe("USD");
    });

    test("should throw error for invalid currency", () => {
      expect(() => ProfitLoss.create(100, "US")).toThrow(
        "Currency must be a 3-letter code"
      );
    });

    test("should throw error for Infinity", () => {
      expect(() => ProfitLoss.create(Infinity, "USD")).toThrow(
        "Profit/Loss amount must be a finite number"
      );
    });
  });

  describe("profit", () => {
    test("should create a profit", () => {
      const profit = ProfitLoss.profit(100, "USD");
      expect(profit.amount).toBe(100);
      expect(profit.isProfit()).toBe(true);
    });

    test("should throw error for negative amount", () => {
      expect(() => ProfitLoss.profit(-100, "USD")).toThrow(
        "Profit amount cannot be negative"
      );
    });
  });

  describe("loss", () => {
    test("should create a loss", () => {
      const loss = ProfitLoss.loss(-50, "USD");
      expect(loss.amount).toBe(-50);
      expect(loss.isLoss()).toBe(true);
    });

    test("should throw error for positive amount", () => {
      expect(() => ProfitLoss.loss(50, "USD")).toThrow(
        "Loss amount cannot be positive"
      );
    });
  });

  describe("isProfit", () => {
    test("should return true for profit", () => {
      const profit = ProfitLoss.create(100, "USD");
      expect(profit.isProfit()).toBe(true);
    });

    test("should return false for loss", () => {
      const loss = ProfitLoss.create(-50, "USD");
      expect(loss.isProfit()).toBe(false);
    });
  });

  describe("isLoss", () => {
    test("should return true for loss", () => {
      const loss = ProfitLoss.create(-50, "USD");
      expect(loss.isLoss()).toBe(true);
    });

    test("should return false for profit", () => {
      const profit = ProfitLoss.create(100, "USD");
      expect(profit.isLoss()).toBe(false);
    });
  });

  describe("isBreakEven", () => {
    test("should return true for zero amount", () => {
      const profitLoss = ProfitLoss.create(0, "USD");
      expect(profitLoss.isBreakEven()).toBe(true);
    });

    test("should return true for very small amount", () => {
      const profitLoss = ProfitLoss.create(0.005, "USD");
      expect(profitLoss.isBreakEven()).toBe(true);
    });

    test("should return false for significant amount", () => {
      const profit = ProfitLoss.create(10, "USD");
      expect(profit.isBreakEven()).toBe(false);
    });
  });

  describe("getAbsoluteValue", () => {
    test("should return absolute value for profit", () => {
      const profit = ProfitLoss.create(100, "USD");
      expect(profit.getAbsoluteValue()).toBe(100);
    });

    test("should return absolute value for loss", () => {
      const loss = ProfitLoss.create(-50, "USD");
      expect(loss.getAbsoluteValue()).toBe(50);
    });
  });

  describe("add", () => {
    test("should add two profits", () => {
      const profit1 = ProfitLoss.create(100, "USD");
      const profit2 = ProfitLoss.create(50, "USD");
      const result = profit1.add(profit2);
      expect(result.amount).toBe(150);
    });

    test("should add profit and loss", () => {
      const profit = ProfitLoss.create(100, "USD");
      const loss = ProfitLoss.create(-50, "USD");
      const result = profit.add(loss);
      expect(result.amount).toBe(50);
    });

    test("should throw error for different currencies", () => {
      const profit1 = ProfitLoss.create(100, "USD");
      const profit2 = ProfitLoss.create(50, "EUR");
      expect(() => profit1.add(profit2)).toThrow(
        "Cannot add profit/loss with different currencies"
      );
    });
  });

  describe("equals", () => {
    test("should return true for equal profit/loss", () => {
      const profit1 = ProfitLoss.create(100, "USD");
      const profit2 = ProfitLoss.create(100, "USD");
      expect(profit1.equals(profit2)).toBe(true);
    });

    test("should return false for different amounts", () => {
      const profit1 = ProfitLoss.create(100, "USD");
      const profit2 = ProfitLoss.create(200, "USD");
      expect(profit1.equals(profit2)).toBe(false);
    });

    test("should handle floating point comparison", () => {
      const profit1 = ProfitLoss.create(100.001, "USD");
      const profit2 = ProfitLoss.create(100.002, "USD");
      expect(profit1.equals(profit2)).toBe(true);
    });
  });

  describe("toString", () => {
    test("should return formatted string for profit", () => {
      const profit = ProfitLoss.create(100.5, "USD");
      expect(profit.toString()).toBe("+USD 100.50");
    });

    test("should return formatted string for loss", () => {
      const loss = ProfitLoss.create(-50.25, "USD");
      // toString shows the actual amount with sign prefix only for positive, so -50.25 becomes "USD -50.25"
      expect(loss.toString()).toBe("USD -50.25");
    });
  });
});

