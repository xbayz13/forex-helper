/**
 * Unit tests for StopLoss Value Object
 */

import { describe, test, expect } from "bun:test";
import { StopLoss } from "./StopLoss";

describe("StopLoss", () => {
  describe("createInPips", () => {
    test("should create a valid stop loss in pips", () => {
      const stopLoss = StopLoss.createInPips(50);
      expect(stopLoss.value).toBe(50);
      expect(stopLoss.unit).toBe("pips");
    });

    test("should throw error for zero value", () => {
      expect(() => StopLoss.createInPips(0)).toThrow(
        "Stop loss must be greater than 0"
      );
    });

    test("should throw error for negative value", () => {
      expect(() => StopLoss.createInPips(-10)).toThrow(
        "Stop loss must be greater than 0"
      );
    });
  });

  describe("createInPoints", () => {
    test("should create a valid stop loss in points", () => {
      const stopLoss = StopLoss.createInPoints(500);
      expect(stopLoss.value).toBe(500);
      expect(stopLoss.unit).toBe("points");
    });

    test("should throw error for zero value", () => {
      expect(() => StopLoss.createInPoints(0)).toThrow(
        "Stop loss must be greater than 0"
      );
    });

    test("should throw error for negative value", () => {
      expect(() => StopLoss.createInPoints(-100)).toThrow(
        "Stop loss must be greater than 0"
      );
    });
  });

  describe("value", () => {
    test("should return the correct value for pips", () => {
      const stopLoss = StopLoss.createInPips(50);
      expect(stopLoss.value).toBe(50);
    });

    test("should return the correct value for points", () => {
      const stopLoss = StopLoss.createInPoints(500);
      expect(stopLoss.value).toBe(500);
    });
  });

  describe("unit", () => {
    test("should return 'pips' for pips unit", () => {
      const stopLoss = StopLoss.createInPips(50);
      expect(stopLoss.unit).toBe("pips");
    });

    test("should return 'points' for points unit", () => {
      const stopLoss = StopLoss.createInPoints(500);
      expect(stopLoss.unit).toBe("points");
    });
  });

  describe("isInPips", () => {
    test("should return true for pips", () => {
      const stopLoss = StopLoss.createInPips(50);
      expect(stopLoss.isInPips()).toBe(true);
    });

    test("should return false for points", () => {
      const stopLoss = StopLoss.createInPoints(500);
      expect(stopLoss.isInPips()).toBe(false);
    });
  });

  describe("isInPoints", () => {
    test("should return true for points", () => {
      const stopLoss = StopLoss.createInPoints(500);
      expect(stopLoss.isInPoints()).toBe(true);
    });

    test("should return false for pips", () => {
      const stopLoss = StopLoss.createInPips(50);
      expect(stopLoss.isInPoints()).toBe(false);
    });
  });

  describe("equals", () => {
    test("should return true for equal stop losses (pips)", () => {
      const stopLoss1 = StopLoss.createInPips(50);
      const stopLoss2 = StopLoss.createInPips(50);
      expect(stopLoss1.equals(stopLoss2)).toBe(true);
    });

    test("should return true for equal stop losses (points)", () => {
      const stopLoss1 = StopLoss.createInPoints(500);
      const stopLoss2 = StopLoss.createInPoints(500);
      expect(stopLoss1.equals(stopLoss2)).toBe(true);
    });

    test("should return false for different values", () => {
      const stopLoss1 = StopLoss.createInPips(50);
      const stopLoss2 = StopLoss.createInPips(100);
      expect(stopLoss1.equals(stopLoss2)).toBe(false);
    });

    test("should return false for different units", () => {
      const stopLoss1 = StopLoss.createInPips(50);
      const stopLoss2 = StopLoss.createInPoints(50);
      expect(stopLoss1.equals(stopLoss2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return formatted string for pips", () => {
      const stopLoss = StopLoss.createInPips(50);
      expect(stopLoss.toString()).toBe("50 pips");
    });

    test("should return formatted string for points", () => {
      const stopLoss = StopLoss.createInPoints(500);
      expect(stopLoss.toString()).toBe("500 points");
    });
  });
});

