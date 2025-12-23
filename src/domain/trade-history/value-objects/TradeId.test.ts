/**
 * Unit tests for TradeId Value Object
 */

import { describe, test, expect } from "bun:test";
import { TradeId } from "./TradeId";

describe("TradeId", () => {
  describe("create", () => {
    test("should create a valid trade ID", () => {
      const tradeId = TradeId.create("trade_123");
      expect(tradeId.value).toBe("trade_123");
    });

    test("should trim whitespace", () => {
      const tradeId = TradeId.create("  trade_123  ");
      expect(tradeId.value).toBe("trade_123");
    });

    test("should throw error for empty string", () => {
      expect(() => TradeId.create("")).toThrow("Trade ID cannot be empty");
    });

    test("should throw error for whitespace-only string", () => {
      expect(() => TradeId.create("   ")).toThrow("Trade ID cannot be empty");
    });
  });

  describe("generate", () => {
    test("should generate a unique trade ID", () => {
      const tradeId1 = TradeId.generate();
      const tradeId2 = TradeId.generate();
      
      expect(tradeId1.value).toBeTruthy();
      expect(tradeId2.value).toBeTruthy();
      expect(tradeId1.value).not.toBe(tradeId2.value);
      expect(tradeId1.value).toMatch(/^trade_\d+_[a-z0-9]+$/);
    });
  });

  describe("value", () => {
    test("should return the ID value", () => {
      const tradeId = TradeId.create("trade_123");
      expect(tradeId.value).toBe("trade_123");
    });
  });

  describe("equals", () => {
    test("should return true for equal IDs", () => {
      const tradeId1 = TradeId.create("trade_123");
      const tradeId2 = TradeId.create("trade_123");
      expect(tradeId1.equals(tradeId2)).toBe(true);
    });

    test("should return false for different IDs", () => {
      const tradeId1 = TradeId.create("trade_123");
      const tradeId2 = TradeId.create("trade_456");
      expect(tradeId1.equals(tradeId2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return the ID string", () => {
      const tradeId = TradeId.create("trade_123");
      expect(tradeId.toString()).toBe("trade_123");
    });
  });
});

