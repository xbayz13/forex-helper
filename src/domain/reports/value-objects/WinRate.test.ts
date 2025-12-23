/**
 * Unit tests for WinRate Value Object
 */

import { describe, test, expect } from "bun:test";
import { WinRate } from "./WinRate";

describe("WinRate", () => {
  describe("create", () => {
    test("should create a valid win rate", () => {
      const winRate = WinRate.create(50);
      expect(winRate.value).toBe(50);
    });

    test("should create win rate with 0", () => {
      const winRate = WinRate.create(0);
      expect(winRate.value).toBe(0);
    });

    test("should create win rate with 100", () => {
      const winRate = WinRate.create(100);
      expect(winRate.value).toBe(100);
    });

    test("should throw error for negative value", () => {
      expect(() => WinRate.create(-1)).toThrow(
        "Win rate must be between 0 and 100"
      );
    });

    test("should throw error for value greater than 100", () => {
      expect(() => WinRate.create(101)).toThrow(
        "Win rate must be between 0 and 100"
      );
    });
  });

  describe("value", () => {
    test("should return the win rate value", () => {
      const winRate = WinRate.create(75);
      expect(winRate.value).toBe(75);
    });
  });

  describe("decimal", () => {
    test("should return decimal representation", () => {
      const winRate = WinRate.create(50);
      expect(winRate.decimal).toBe(0.5);
    });

    test("should return 0 for 0%", () => {
      const winRate = WinRate.create(0);
      expect(winRate.decimal).toBe(0);
    });

    test("should return 1 for 100%", () => {
      const winRate = WinRate.create(100);
      expect(winRate.decimal).toBe(1);
    });
  });

  describe("equals", () => {
    test("should return true for equal win rates", () => {
      const winRate1 = WinRate.create(50);
      const winRate2 = WinRate.create(50);
      expect(winRate1.equals(winRate2)).toBe(true);
    });

    test("should return false for different win rates", () => {
      const winRate1 = WinRate.create(50);
      const winRate2 = WinRate.create(75);
      expect(winRate1.equals(winRate2)).toBe(false);
    });

    test("should handle floating point comparison", () => {
      const winRate1 = WinRate.create(50.001);
      const winRate2 = WinRate.create(50.002);
      expect(winRate1.equals(winRate2)).toBe(true);
    });
  });

  describe("toString", () => {
    test("should return formatted string", () => {
      const winRate = WinRate.create(50.5);
      expect(winRate.toString()).toBe("50.50%");
    });
  });
});

