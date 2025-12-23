/**
 * Unit tests for Pips Value Object
 */

import { describe, test, expect } from "bun:test";
import { Pips } from "./Pips";

describe("Pips", () => {
  describe("createInPips", () => {
    test("should create valid pips", () => {
      const pips = Pips.createInPips(50);
      expect(pips.value).toBe(50);
      expect(pips.unit).toBe("pips");
    });

    test("should handle negative pips", () => {
      const pips = Pips.createInPips(-50);
      expect(pips.value).toBe(-50);
    });

    test("should handle zero pips", () => {
      const pips = Pips.createInPips(0);
      expect(pips.value).toBe(0);
    });
  });

  describe("createInPoints", () => {
    test("should create valid points", () => {
      const pips = Pips.createInPoints(500);
      expect(pips.value).toBe(500);
      expect(pips.unit).toBe("points");
    });
  });

  describe("isInPips", () => {
    test("should return true for pips", () => {
      const pips = Pips.createInPips(50);
      expect(pips.isInPips()).toBe(true);
    });

    test("should return false for points", () => {
      const pips = Pips.createInPoints(500);
      expect(pips.isInPips()).toBe(false);
    });
  });

  describe("isInPoints", () => {
    test("should return true for points", () => {
      const pips = Pips.createInPoints(500);
      expect(pips.isInPoints()).toBe(true);
    });

    test("should return false for pips", () => {
      const pips = Pips.createInPips(50);
      expect(pips.isInPoints()).toBe(false);
    });
  });

  describe("getAbsoluteValue", () => {
    test("should return absolute value for positive", () => {
      const pips = Pips.createInPips(50);
      expect(pips.getAbsoluteValue()).toBe(50);
    });

    test("should return absolute value for negative", () => {
      const pips = Pips.createInPips(-50);
      expect(pips.getAbsoluteValue()).toBe(50);
    });
  });

  describe("equals", () => {
    test("should return true for equal pips", () => {
      const pips1 = Pips.createInPips(50);
      const pips2 = Pips.createInPips(50);
      expect(pips1.equals(pips2)).toBe(true);
    });

    test("should return false for different values", () => {
      const pips1 = Pips.createInPips(50);
      const pips2 = Pips.createInPips(100);
      expect(pips1.equals(pips2)).toBe(false);
    });

    test("should return false for different units", () => {
      const pips1 = Pips.createInPips(50);
      const pips2 = Pips.createInPoints(50);
      expect(pips1.equals(pips2)).toBe(false);
    });

    test("should handle floating point comparison", () => {
      const pips1 = Pips.createInPips(50.001);
      const pips2 = Pips.createInPips(50.002);
      expect(pips1.equals(pips2)).toBe(true);
    });
  });

  describe("toString", () => {
    test("should return formatted string for positive pips", () => {
      const pips = Pips.createInPips(50);
      expect(pips.toString()).toBe("+50.00 pips");
    });

    test("should return formatted string for negative pips", () => {
      const pips = Pips.createInPips(-50);
      expect(pips.toString()).toBe("-50.00 pips");
    });

    test("should return formatted string for points", () => {
      const pips = Pips.createInPoints(500);
      expect(pips.toString()).toBe("+500.00 points");
    });
  });
});

