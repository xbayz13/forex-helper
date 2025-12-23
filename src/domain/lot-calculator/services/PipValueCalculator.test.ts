/**
 * Unit tests for PipValueCalculator Domain Service
 */

import { describe, test, expect } from "bun:test";
import { PipValueCalculator } from "./PipValueCalculator";
import { CurrencyPair } from "../value-objects/CurrencyPair";
import { AccountCurrency } from "../value-objects/AccountCurrency";

describe("PipValueCalculator", () => {
  const calculator = new PipValueCalculator();

  describe("calculate", () => {
    test("should calculate pip value for XXX/USD with USD account", async () => {
      const pair = CurrencyPair.create("EURUSD");
      const accountCurrency = AccountCurrency.create("USD");
      
      const pipValue = await calculator.calculate(pair, accountCurrency);
      
      expect(pipValue.value).toBe(10);
      expect(pipValue.currency).toBe("USD");
    });

    test("should calculate pip value for XAU/USD", async () => {
      const pair = CurrencyPair.create("XAUUSD");
      const accountCurrency = AccountCurrency.create("USD");
      
      const pipValue = await calculator.calculate(pair, accountCurrency);
      
      expect(pipValue.value).toBe(1);
      expect(pipValue.currency).toBe("USD");
    });

    test("should calculate pip value for USD/XXX with USD account", async () => {
      const pair = CurrencyPair.create("USDJPY");
      const accountCurrency = AccountCurrency.create("USD");
      
      const pipValue = await calculator.calculate(pair, accountCurrency, 150);
      
      expect(pipValue.value).toBeCloseTo(10 / 150, 5);
      expect(pipValue.currency).toBe("USD");
    });

    test("should throw error for USD/XXX without current price", async () => {
      const pair = CurrencyPair.create("USDJPY");
      const accountCurrency = AccountCurrency.create("USD");
      
      await expect(
        calculator.calculate(pair, accountCurrency)
      ).rejects.toThrow("Current price is required");
    });
  });
});

