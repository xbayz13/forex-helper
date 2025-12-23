/**
 * Unit tests for RiskPercentage Value Object
 */

import { describe, test, expect } from "bun:test";
import { RiskPercentage } from "./RiskPercentage";

describe("RiskPercentage", () => {
  describe("create", () => {
    test("should create a valid risk percentage", () => {
      const risk = RiskPercentage.create(5);
      expect(risk.value).toBe(5);
    });

    test("should create risk percentage with 0", () => {
      const risk = RiskPercentage.create(0);
      expect(risk.value).toBe(0);
    });

    test("should create risk percentage with 100", () => {
      const risk = RiskPercentage.create(100);
      expect(risk.value).toBe(100);
    });

    test("should throw error for negative value", () => {
      expect(() => RiskPercentage.create(-1)).toThrow(
        "Risk percentage must be between 0 and 100"
      );
    });

    test("should throw error for value greater than 100", () => {
      expect(() => RiskPercentage.create(101)).toThrow(
        "Risk percentage must be between 0 and 100"
      );
    });
  });

  describe("value", () => {
    test("should return the correct value", () => {
      const risk = RiskPercentage.create(25);
      expect(risk.value).toBe(25);
    });
  });

  describe("decimal", () => {
    test("should return decimal representation", () => {
      const risk = RiskPercentage.create(5);
      expect(risk.decimal).toBe(0.05);
    });

    test("should return 0 for 0%", () => {
      const risk = RiskPercentage.create(0);
      expect(risk.decimal).toBe(0);
    });

    test("should return 1 for 100%", () => {
      const risk = RiskPercentage.create(100);
      expect(risk.decimal).toBe(1);
    });
  });

  describe("calculateRiskAmount", () => {
    test("should calculate risk amount correctly", () => {
      const risk = RiskPercentage.create(5);
      const accountBalance = 10000;
      const riskAmount = risk.calculateRiskAmount(accountBalance);
      expect(riskAmount).toBe(500);
    });

    test("should return 0 for 0% risk", () => {
      const risk = RiskPercentage.create(0);
      const accountBalance = 10000;
      const riskAmount = risk.calculateRiskAmount(accountBalance);
      expect(riskAmount).toBe(0);
    });

    test("should return full balance for 100% risk", () => {
      const risk = RiskPercentage.create(100);
      const accountBalance = 10000;
      const riskAmount = risk.calculateRiskAmount(accountBalance);
      expect(riskAmount).toBe(10000);
    });
  });

  describe("equals", () => {
    test("should return true for equal risk percentages", () => {
      const risk1 = RiskPercentage.create(5);
      const risk2 = RiskPercentage.create(5);
      expect(risk1.equals(risk2)).toBe(true);
    });

    test("should return false for different risk percentages", () => {
      const risk1 = RiskPercentage.create(5);
      const risk2 = RiskPercentage.create(10);
      expect(risk1.equals(risk2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return formatted string", () => {
      const risk = RiskPercentage.create(5);
      expect(risk.toString()).toBe("5%");
    });

    test("should return formatted string for 0", () => {
      const risk = RiskPercentage.create(0);
      expect(risk.toString()).toBe("0%");
    });

    test("should return formatted string for 100", () => {
      const risk = RiskPercentage.create(100);
      expect(risk.toString()).toBe("100%");
    });
  });
});

