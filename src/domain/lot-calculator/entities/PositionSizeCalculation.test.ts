/**
 * Unit tests for PositionSizeCalculation Entity
 */

import { describe, test, expect } from "bun:test";
import { PositionSizeCalculation } from "./PositionSizeCalculation";
import { LotSize } from "../value-objects/LotSize";
import { AccountBalance } from "../value-objects/AccountBalance";
import { RiskPercentage } from "../value-objects/RiskPercentage";
import { CurrencyPair } from "../value-objects/CurrencyPair";
import { AccountCurrency } from "../value-objects/AccountCurrency";
import { StopLoss } from "../value-objects/StopLoss";
import { PipValue } from "../value-objects/PipValue";

describe("PositionSizeCalculation", () => {
  const lotSize = LotSize.create(0.5);
  const accountBalance = AccountBalance.create(10000, "USD");
  const riskPercentage = RiskPercentage.create(2);
  const currencyPair = CurrencyPair.create("EURUSD");
  const accountCurrency = AccountCurrency.create("USD");
  const stopLoss = StopLoss.createInPips(50);
  const pipValue = PipValue.create(10, "USD");

  test("should create a position size calculation", () => {
    const calculation = PositionSizeCalculation.create(
      "calc_123",
      lotSize,
      50000,
      200,
      accountBalance,
      riskPercentage,
      currencyPair,
      accountCurrency,
      stopLoss,
      pipValue
    );

    expect(calculation.id).toBe("calc_123");
    expect(calculation.lotSize).toBe(lotSize);
    expect(calculation.positionSize).toBe(50000);
    expect(calculation.riskAmount).toBe(200);
    expect(calculation.accountBalance).toBe(accountBalance);
    expect(calculation.riskPercentage).toBe(riskPercentage);
    expect(calculation.currencyPair).toBe(currencyPair);
    expect(calculation.accountCurrency).toBe(accountCurrency);
    expect(calculation.stopLoss).toBe(stopLoss);
    expect(calculation.pipValue).toBe(pipValue);
    expect(calculation.calculatedAt).toBeInstanceOf(Date);
  });

  test("should have getters for all properties", () => {
    const calculation = PositionSizeCalculation.create(
      "calc_123",
      lotSize,
      50000,
      200,
      accountBalance,
      riskPercentage,
      currencyPair,
      accountCurrency,
      stopLoss,
      pipValue
    );

    expect(calculation.id).toBeTruthy();
    expect(calculation.lotSize).toBeTruthy();
    expect(calculation.positionSize).toBeTruthy();
    expect(calculation.riskAmount).toBeTruthy();
    expect(calculation.accountBalance).toBeTruthy();
    expect(calculation.riskPercentage).toBeTruthy();
    expect(calculation.currencyPair).toBeTruthy();
    expect(calculation.accountCurrency).toBeTruthy();
    expect(calculation.stopLoss).toBeTruthy();
    expect(calculation.pipValue).toBeTruthy();
    expect(calculation.calculatedAt).toBeInstanceOf(Date);
  });

  test("should create calculation with correct timestamp", () => {
    const before = new Date();
    const calculation = PositionSizeCalculation.create(
      "calc_123",
      lotSize,
      50000,
      200,
      accountBalance,
      riskPercentage,
      currencyPair,
      accountCurrency,
      stopLoss,
      pipValue
    );
    const after = new Date();

    expect(calculation.calculatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(calculation.calculatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

