/**
 * Unit tests for ProfitFactor Value Object
 */

import { describe, test, expect } from "bun:test";
import { ProfitFactor } from "./ProfitFactor";

describe("ProfitFactor", () => {
  describe("create", () => {
    test("should create a valid profit factor", () => {
      const profitFactor = ProfitFactor.create(1.5);
      expect(profitFactor.value).toBe(1.5);
    });

    test("should create profit factor with 0", () => {
      const profitFactor = ProfitFactor.create(0);
      expect(profitFactor.value).toBe(0);
    });

    test("should throw error for negative value", () => {
      expect(() => ProfitFactor.create(-1)).toThrow(
        "Profit factor cannot be negative"
      );
    });

    test("should throw error for Infinity", () => {
      expect(() => ProfitFactor.create(Infinity)).toThrow(
        "Profit factor must be a finite number"
      );
    });

    test("should throw error for NaN", () => {
      expect(() => ProfitFactor.create(NaN)).toThrow(
        "Profit factor must be a finite number"
      );
    });
  });

  describe("value", () => {
    test("should return the profit factor value", () => {
      const profitFactor = ProfitFactor.create(1.5);
      expect(profitFactor.value).toBe(1.5);
    });
  });

  describe("isProfitable", () => {
    test("should return true for profit factor > 1.0", () => {
      const profitFactor = ProfitFactor.create(1.5);
      expect(profitFactor.isProfitable()).toBe(true);
    });

    test("should return false for profit factor = 1.0", () => {
      const profitFactor = ProfitFactor.create(1.0);
      expect(profitFactor.isProfitable()).toBe(false);
    });

    test("should return false for profit factor < 1.0", () => {
      const profitFactor = ProfitFactor.create(0.5);
      expect(profitFactor.isProfitable()).toBe(false);
    });
  });

  describe("getRating", () => {
    test("should return 'excellent' for >= 2.0", () => {
      expect(ProfitFactor.create(2.0).getRating()).toBe("excellent");
      expect(ProfitFactor.create(3.0).getRating()).toBe("excellent");
    });

    test("should return 'good' for >= 1.5 and < 2.0", () => {
      expect(ProfitFactor.create(1.5).getRating()).toBe("good");
      expect(ProfitFactor.create(1.99).getRating()).toBe("good");
    });

    test("should return 'fair' for >= 1.0 and < 1.5", () => {
      expect(ProfitFactor.create(1.0).getRating()).toBe("fair");
      expect(ProfitFactor.create(1.49).getRating()).toBe("fair");
    });

    test("should return 'poor' for < 1.0", () => {
      expect(ProfitFactor.create(0.99).getRating()).toBe("poor");
      expect(ProfitFactor.create(0.5).getRating()).toBe("poor");
    });
  });

  describe("equals", () => {
    test("should return true for equal profit factors", () => {
      const profitFactor1 = ProfitFactor.create(1.5);
      const profitFactor2 = ProfitFactor.create(1.5);
      expect(profitFactor1.equals(profitFactor2)).toBe(true);
    });

    test("should return false for different profit factors", () => {
      const profitFactor1 = ProfitFactor.create(1.5);
      const profitFactor2 = ProfitFactor.create(2.0);
      expect(profitFactor1.equals(profitFactor2)).toBe(false);
    });

    test("should handle floating point comparison with tolerance", () => {
      const profitFactor1 = ProfitFactor.create(1.501);
      const profitFactor2 = ProfitFactor.create(1.502);
      expect(profitFactor1.equals(profitFactor2)).toBe(true);
    });
  });

  describe("toString", () => {
    test("should return formatted string", () => {
      const profitFactor = ProfitFactor.create(1.5);
      expect(profitFactor.toString()).toBe("1.50");
      
      const profitFactor2 = ProfitFactor.create(2.0);
      expect(profitFactor2.toString()).toBe("2.00");
    });
  });
});

