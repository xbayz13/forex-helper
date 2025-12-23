/**
 * Unit tests for TradeValidator Domain Service
 */

import { describe, test, expect } from "bun:test";
import { TradeValidator } from "./TradeValidator";
import { Price } from "../value-objects/Price";
import { LotSize } from "../../lot-calculator/value-objects/LotSize";

describe("TradeValidator", () => {
  const validator = new TradeValidator();

  describe("validateTradeCreation", () => {
    const entryPrice = Price.create(1.1000);
    const lotSize = LotSize.create(0.1);

    test("should validate valid BUY trade", () => {
      const stopLoss = Price.create(1.0950);
      const takeProfit = Price.create(1.1050);
      
      const result = validator.validateTradeCreation(
        entryPrice,
        stopLoss,
        takeProfit,
        lotSize,
        "BUY"
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should validate valid SELL trade", () => {
      const stopLoss = Price.create(1.1050);
      const takeProfit = Price.create(1.0950);
      
      const result = validator.validateTradeCreation(
        entryPrice,
        stopLoss,
        takeProfit,
        lotSize,
        "SELL"
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should reject stop loss above entry for BUY", () => {
      const stopLoss = Price.create(1.1050);
      
      const result = validator.validateTradeCreation(
        entryPrice,
        stopLoss,
        null,
        lotSize,
        "BUY"
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Stop loss for BUY trade must be below entry price");
    });

    test("should reject stop loss below entry for SELL", () => {
      const stopLoss = Price.create(1.0950);
      
      const result = validator.validateTradeCreation(
        entryPrice,
        stopLoss,
        null,
        lotSize,
        "SELL"
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Stop loss for SELL trade must be above entry price");
    });

    test("should reject take profit below entry for BUY", () => {
      const takeProfit = Price.create(1.0950);
      
      const result = validator.validateTradeCreation(
        entryPrice,
        null,
        takeProfit,
        lotSize,
        "BUY"
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Take profit for BUY trade must be above entry price");
    });

    test("should reject take profit above entry for SELL", () => {
      const takeProfit = Price.create(1.1050);
      
      const result = validator.validateTradeCreation(
        entryPrice,
        null,
        takeProfit,
        lotSize,
        "SELL"
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Take profit for SELL trade must be below entry price");
    });

    test("should reject invalid stop loss and take profit relationship for BUY", () => {
      const stopLoss = Price.create(1.0950);
      const takeProfit = Price.create(1.0940);
      
      const result = validator.validateTradeCreation(
        entryPrice,
        stopLoss,
        takeProfit,
        lotSize,
        "BUY"
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Take profit must be above stop loss for BUY trade");
    });

    test("should reject zero lot size", () => {
      const zeroLotSize = LotSize.create(0);
      
      const result = validator.validateTradeCreation(
        entryPrice,
        null,
        null,
        zeroLotSize,
        "BUY"
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Lot size must be greater than 0");
    });
  });
});

