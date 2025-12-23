/**
 * Unit tests for LotSize Value Object
 */

import { describe, test, expect } from "bun:test";
import { LotSize } from "./LotSize";

describe("LotSize", () => {
  describe("create", () => {
    test("should create a valid lot size", () => {
      const lotSize = LotSize.create(1.0);
      expect(lotSize.value).toBe(1.0);
    });

    test("should create lot size with 0", () => {
      const lotSize = LotSize.create(0);
      expect(lotSize.value).toBe(0);
    });

    test("should create fractional lot size", () => {
      const lotSize = LotSize.create(0.1);
      expect(lotSize.value).toBe(0.1);
    });

    test("should throw error for negative value", () => {
      expect(() => LotSize.create(-1)).toThrow(
        "Lot size cannot be negative"
      );
    });
  });

  describe("value", () => {
    test("should return the correct value", () => {
      const lotSize = LotSize.create(1.5);
      expect(lotSize.value).toBe(1.5);
    });
  });

  describe("toPositionSize", () => {
    test("should calculate position size for standard lot", () => {
      const lotSize = LotSize.create(1.0);
      expect(lotSize.toPositionSize()).toBe(100000);
    });

    test("should calculate position size for mini lot", () => {
      const lotSize = LotSize.create(0.1);
      expect(lotSize.toPositionSize()).toBe(10000);
    });

    test("should calculate position size for micro lot", () => {
      const lotSize = LotSize.create(0.01);
      expect(lotSize.toPositionSize()).toBe(1000);
    });

    test("should calculate position size for multiple lots", () => {
      const lotSize = LotSize.create(2.5);
      expect(lotSize.toPositionSize()).toBe(250000);
    });
  });

  describe("toPositionSizeWithContractSize", () => {
    test("should calculate position size with custom contract size", () => {
      const lotSize = LotSize.create(1.0);
      expect(lotSize.toPositionSizeWithContractSize(10000)).toBe(10000);
    });

    test("should calculate position size for fractional lot", () => {
      const lotSize = LotSize.create(0.5);
      expect(lotSize.toPositionSizeWithContractSize(100000)).toBe(50000);
    });
  });

  describe("getLotType", () => {
    test("should return 'standard' for 1.0 lot", () => {
      const lotSize = LotSize.create(1.0);
      expect(lotSize.getLotType()).toBe("standard");
    });

    test("should return 'standard' for multiple lots", () => {
      const lotSize = LotSize.create(2.5);
      expect(lotSize.getLotType()).toBe("standard");
    });

    test("should return 'mini' for 0.1 lot", () => {
      const lotSize = LotSize.create(0.1);
      expect(lotSize.getLotType()).toBe("mini");
    });

    test("should return 'mini' for 0.5 lot", () => {
      const lotSize = LotSize.create(0.5);
      expect(lotSize.getLotType()).toBe("mini");
    });

    test("should return 'micro' for 0.01 lot", () => {
      const lotSize = LotSize.create(0.01);
      expect(lotSize.getLotType()).toBe("micro");
    });

    test("should return 'micro' for 0.05 lot", () => {
      const lotSize = LotSize.create(0.05);
      expect(lotSize.getLotType()).toBe("micro");
    });

    test("should return 'mixed' for very small lot", () => {
      const lotSize = LotSize.create(0.001);
      expect(lotSize.getLotType()).toBe("mixed");
    });
  });

  describe("equals", () => {
    test("should return true for equal lot sizes", () => {
      const lotSize1 = LotSize.create(1.0);
      const lotSize2 = LotSize.create(1.0);
      expect(lotSize1.equals(lotSize2)).toBe(true);
    });

    test("should return false for different lot sizes", () => {
      const lotSize1 = LotSize.create(1.0);
      const lotSize2 = LotSize.create(2.0);
      expect(lotSize1.equals(lotSize2)).toBe(false);
    });

    test("should handle floating point comparison", () => {
      const lotSize1 = LotSize.create(0.1);
      const lotSize2 = LotSize.create(0.1000001);
      expect(lotSize1.equals(lotSize2)).toBe(true);
    });
  });

  describe("toString", () => {
    test("should return formatted string for singular lot", () => {
      const lotSize = LotSize.create(1.0);
      expect(lotSize.toString()).toBe("1.00 lot");
    });

    test("should return formatted string for plural lots", () => {
      const lotSize = LotSize.create(2.5);
      expect(lotSize.toString()).toBe("2.50 lots");
    });

    test("should return formatted string for fractional lot", () => {
      const lotSize = LotSize.create(0.1);
      expect(lotSize.toString()).toBe("0.10 lots");
    });
  });
});

