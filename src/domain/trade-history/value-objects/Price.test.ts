/**
 * Unit tests for Price Value Object
 */

import { describe, test, expect } from "bun:test";
import { Price } from "./Price";

describe("Price", () => {
  describe("create", () => {
    test("should create a valid price", () => {
      const price = Price.create(1.23456);
      expect(price.value).toBe(1.23456);
    });

    test("should create price with zero", () => {
      const price = Price.create(0);
      expect(price.value).toBe(0);
    });

    test("should throw error for negative price", () => {
      expect(() => Price.create(-1)).toThrow("Price cannot be negative");
    });

    test("should throw error for Infinity", () => {
      expect(() => Price.create(Infinity)).toThrow("Price must be a finite number");
    });

    test("should throw error for NaN", () => {
      expect(() => Price.create(NaN)).toThrow("Price must be a finite number");
    });
  });

  describe("value", () => {
    test("should return the price value", () => {
      const price = Price.create(1.23456);
      expect(price.value).toBe(1.23456);
    });
  });

  describe("percentageChangeFrom", () => {
    test("should calculate percentage change correctly", () => {
      const price1 = Price.create(100);
      const price2 = Price.create(110);
      expect(price2.percentageChangeFrom(price1)).toBe(10);
    });

    test("should handle negative percentage change", () => {
      const price1 = Price.create(100);
      const price2 = Price.create(90);
      expect(price2.percentageChangeFrom(price1)).toBe(-10);
    });

    test("should throw error for zero base price", () => {
      const price1 = Price.create(0);
      const price2 = Price.create(100);
      expect(() => price2.percentageChangeFrom(price1)).toThrow(
        "Cannot calculate percentage change from zero price"
      );
    });
  });

  describe("differenceFrom", () => {
    test("should calculate absolute difference", () => {
      const price1 = Price.create(100);
      const price2 = Price.create(110);
      expect(price2.differenceFrom(price1)).toBe(10);
    });

    test("should return absolute value for negative difference", () => {
      const price1 = Price.create(100);
      const price2 = Price.create(90);
      expect(price2.differenceFrom(price1)).toBe(10);
    });
  });

  describe("equals", () => {
    test("should return true for equal prices", () => {
      const price1 = Price.create(1.23456);
      const price2 = Price.create(1.23456);
      expect(price1.equals(price2)).toBe(true);
    });

    test("should return false for different prices", () => {
      const price1 = Price.create(1.23456);
      const price2 = Price.create(1.23556);
      expect(price1.equals(price2)).toBe(false);
    });

    test("should handle floating point comparison with tolerance", () => {
      const price1 = Price.create(1.23456);
      const price2 = Price.create(1.23457);
      expect(price1.equals(price2, 0.001)).toBe(true);
    });
  });

  describe("toString", () => {
    test("should return formatted string with default decimal places", () => {
      const price = Price.create(1.23456789);
      expect(price.toString()).toBe("1.23457");
    });

    test("should return formatted string with custom decimal places", () => {
      const price = Price.create(1.23456789);
      expect(price.toString(2)).toBe("1.23");
    });
  });
});

