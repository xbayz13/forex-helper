/**
 * Unit tests for PositionSizeCalculator Domain Service
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { PositionSizeCalculator } from "./PositionSizeCalculator";
import { PipValueCalculator } from "./PipValueCalculator";
import { RiskPercentage } from "../value-objects/RiskPercentage";
import { AccountBalance } from "../value-objects/AccountBalance";
import { StopLoss } from "../value-objects/StopLoss";
import { LotSize } from "../value-objects/LotSize";
import { CurrencyPair } from "../value-objects/CurrencyPair";
import { AccountCurrency } from "../value-objects/AccountCurrency";

describe("PositionSizeCalculator", () => {
  let calculator: PositionSizeCalculator;
  let pipValueCalculator: PipValueCalculator;

  beforeEach(() => {
    pipValueCalculator = new PipValueCalculator();
    calculator = new PositionSizeCalculator(pipValueCalculator);
  });

  describe("calculate", () => {
    test("should calculate lot size for XXX/USD pair with USD account", async () => {
      const riskPercentage = RiskPercentage.create(2);
      const accountBalance = AccountBalance.create(10000, "USD");
      const stopLoss = StopLoss.createInPips(50);
      const currencyPair = CurrencyPair.create("EURUSD");
      const accountCurrency = AccountCurrency.create("USD");

      const result = await calculator.calculate({
        riskPercentage,
        accountBalance,
        stopLoss,
        currencyPair,
        accountCurrency,
      });

      expect(result.lotSize.value).toBeCloseTo(0.4, 2);
      expect(result.riskAmount).toBe(200);
    });

    test("should calculate lot size for USD/XXX pair with USD account", async () => {
      const riskPercentage = RiskPercentage.create(1);
      const accountBalance = AccountBalance.create(10000, "USD");
      const stopLoss = StopLoss.createInPips(100);
      const currencyPair = CurrencyPair.create("USDJPY");
      const accountCurrency = AccountCurrency.create("USD");

      // For USD/XXX, we need current price. Using 150 as example
      const result = await calculator.calculate({
        riskPercentage,
        accountBalance,
        stopLoss,
        currencyPair,
        accountCurrency,
        currentPrice: 150,
      });

      // Pip value = $10 / 150 = $0.0667 per pip per lot
      // Risk amount = $100
      // Lot size = $100 / (100 pips * $0.0667) = 1.5 lots approximately
      expect(result.lotSize.value).toBeGreaterThan(0);
      expect(result.riskAmount).toBe(100);
    });

    test("should calculate lot size for XAU/USD (points)", async () => {
      const riskPercentage = RiskPercentage.create(2);
      const accountBalance = AccountBalance.create(10000, "USD");
      const stopLoss = StopLoss.createInPoints(500); // 500 points = $5
      const currencyPair = CurrencyPair.create("XAUUSD");
      const accountCurrency = AccountCurrency.create("USD");

      const result = await calculator.calculate({
        riskPercentage,
        accountBalance,
        stopLoss,
        currencyPair,
        accountCurrency,
      });

      // For XAU/USD: pip value = $1 per point per lot
      // Risk amount = $200
      // Lot size = $200 / (500 points * $1) = 0.4 lots
      expect(result.lotSize.value).toBeCloseTo(0.4, 2);
      expect(result.riskAmount).toBe(200);
    });

    test("should handle zero risk percentage", async () => {
      const riskPercentage = RiskPercentage.create(0);
      const accountBalance = AccountBalance.create(10000, "USD");
      const stopLoss = StopLoss.createInPips(50);
      const currencyPair = CurrencyPair.create("EURUSD");
      const accountCurrency = AccountCurrency.create("USD");

      const result = await calculator.calculate({
        riskPercentage,
        accountBalance,
        stopLoss,
        currencyPair,
        accountCurrency,
      });

      expect(result.lotSize.value).toBe(0);
      expect(result.riskAmount).toBe(0);
    });

    test("should handle small lot sizes correctly", async () => {
      const riskPercentage = RiskPercentage.create(0.5);
      const accountBalance = AccountBalance.create(1000, "USD");
      const stopLoss = StopLoss.createInPips(100);
      const currencyPair = CurrencyPair.create("EURUSD");
      const accountCurrency = AccountCurrency.create("USD");

      const result = await calculator.calculate({
        riskPercentage,
        accountBalance,
        stopLoss,
        currencyPair,
        accountCurrency,
      });

      // Risk amount = $5
      // Lot size = $5 / (100 pips * $10) = 0.005 lots
      expect(result.lotSize.value).toBeGreaterThan(0);
      expect(result.lotSize.value).toBeLessThan(0.01);
      expect(result.riskAmount).toBe(5);
    });
  });

  describe("edge cases", () => {
    test("should handle large stop loss values", async () => {
      const riskPercentage = RiskPercentage.create(5);
      const accountBalance = AccountBalance.create(10000, "USD");
      const stopLoss = StopLoss.createInPips(500);
      const currencyPair = CurrencyPair.create("EURUSD");
      const accountCurrency = AccountCurrency.create("USD");

      const result = await calculator.calculate({
        riskPercentage,
        accountBalance,
        stopLoss,
        currencyPair,
        accountCurrency,
      });

      expect(result.lotSize.value).toBeCloseTo(0.1, 2);
      expect(result.riskAmount).toBe(500);
    });

    test("should handle small stop loss values", async () => {
      const riskPercentage = RiskPercentage.create(1);
      const accountBalance = AccountBalance.create(10000, "USD");
      const stopLoss = StopLoss.createInPips(10);
      const currencyPair = CurrencyPair.create("EURUSD");
      const accountCurrency = AccountCurrency.create("USD");

      const result = await calculator.calculate({
        riskPercentage,
        accountBalance,
        stopLoss,
        currencyPair,
        accountCurrency,
      });

      expect(result.lotSize.value).toBeCloseTo(1.0, 1);
      expect(result.riskAmount).toBe(100);
    });
  });
});

