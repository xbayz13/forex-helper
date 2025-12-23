/**
 * Unit tests for PipValue Value Object
 */

import { describe, test, expect } from "bun:test";
import { PipValue } from "./PipValue";

describe("PipValue", () => {
  describe("create", () => {
    test("should create a valid pip value", () => {
      const pipValue = PipValue.create(10, "USD");
      expect(pipValue.value).toBe(10);
      expect(pipValue.currency).toBe("USD");
    });

    test("should convert currency to uppercase", () => {
      const pipValue = PipValue.create(10, "usd");
      expect(pipValue.currency).toBe("USD");
    });

    test("should throw error for zero value", () => {
      expect(() => PipValue.create(0, "USD")).toThrow(
        "Pip value must be greater than 0"
      );
    });

    test("should throw error for negative value", () => {
      expect(() => PipValue.create(-10, "USD")).toThrow(
        "Pip value must be greater than 0"
      );
    });

    test("should throw error for invalid currency (empty)", () => {
      expect(() => PipValue.create(10, "")).toThrow(
        "Currency must be a 3-letter code"
      );
    });

    test("should throw error for invalid currency (too short)", () => {
      expect(() => PipValue.create(10, "US")).toThrow(
        "Currency must be a 3-letter code"
      );
    });
  });

  describe("value", () => {
    test("should return the correct value", () => {
      const pipValue = PipValue.create(10, "USD");
      expect(pipValue.value).toBe(10);
    });
  });

  describe("currency", () => {
    test("should return the correct currency", () => {
      const pipValue = PipValue.create(10, "EUR");
      expect(pipValue.currency).toBe("EUR");
    });
  });

  describe("forLotSize", () => {
    test("should calculate pip value for lot size", () => {
      const pipValue = PipValue.create(10, "USD");
      expect(pipValue.forLotSize(1)).toBe(10);
      expect(pipValue.forLotSize(0.1)).toBe(1);
      expect(pipValue.forLotSize(2.5)).toBe(25);
    });
  });

  describe("equals", () => {
    test("should return true for equal pip values", () => {
      const pipValue1 = PipValue.create(10, "USD");
      const pipValue2 = PipValue.create(10, "USD");
      expect(pipValue1.equals(pipValue2)).toBe(true);
    });

    test("should return false for different values", () => {
      const pipValue1 = PipValue.create(10, "USD");
      const pipValue2 = PipValue.create(20, "USD");
      expect(pipValue1.equals(pipValue2)).toBe(false);
    });

    test("should return false for different currencies", () => {
      const pipValue1 = PipValue.create(10, "USD");
      const pipValue2 = PipValue.create(10, "EUR");
      expect(pipValue1.equals(pipValue2)).toBe(false);
    });

    test("should handle floating point comparison", () => {
      const pipValue1 = PipValue.create(10.001, "USD");
      const pipValue2 = PipValue.create(10.002, "USD");
      expect(pipValue1.equals(pipValue2)).toBe(true);
    });
  });

  describe("toString", () => {
    test("should return formatted string", () => {
      const pipValue = PipValue.create(10.5, "USD");
      expect(pipValue.toString()).toBe("USD 10.50 per lot");
    });
  });
});

