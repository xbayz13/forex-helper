/**
 * Unit tests for MetricsCalculator Domain Service
 */

import { describe, test, expect } from "bun:test";
import { MetricsCalculator } from "./MetricsCalculator";
import { Trade } from "../../trade-history/entities/Trade";
import { TradeId } from "../../trade-history/value-objects/TradeId";
import { CurrencyPair } from "../../lot-calculator/value-objects/CurrencyPair";
import { Price } from "../../trade-history/value-objects/Price";
import { LotSize } from "../../lot-calculator/value-objects/LotSize";
import { ProfitLoss } from "../../trade-history/value-objects/ProfitLoss";

describe("MetricsCalculator", () => {
  const calculator = new MetricsCalculator();

  test("should throw error for empty trades", () => {
    expect(() => calculator.calculate([])).toThrow(
      "Cannot calculate metrics from empty trade list"
    );
  });

  test("should calculate metrics for winning trades", () => {
    const trades = createMockTrades([
      { profit: 100 },
      { profit: 200 },
      { profit: 150 },
    ]);

    const metrics = calculator.calculate(trades);

    expect(metrics.totalTrades).toBe(3);
    expect(metrics.winningTrades).toBe(3);
    expect(metrics.losingTrades).toBe(0);
    expect(metrics.winRate.value).toBe(100);
  });

  test("should calculate metrics for losing trades", () => {
    const trades = createMockTrades([
      { loss: 50 },
      { loss: 100 },
      { loss: 75 },
    ]);

    const metrics = calculator.calculate(trades);

    expect(metrics.totalTrades).toBe(3);
    expect(metrics.winningTrades).toBe(0);
    expect(metrics.losingTrades).toBe(3);
    expect(metrics.winRate.value).toBe(0);
  });

  test("should calculate metrics for mixed trades", () => {
    const trades = createMockTrades([
      { profit: 100 },
      { loss: 50 },
      { profit: 200 },
      { loss: 75 },
    ]);

    const metrics = calculator.calculate(trades);

    expect(metrics.totalTrades).toBe(4);
    expect(metrics.winningTrades).toBe(2);
    expect(metrics.losingTrades).toBe(2);
    expect(metrics.winRate.value).toBe(50);
  });

  function createMockTrades(profitLossData: Array<{ profit?: number; loss?: number }>): Trade[] {
    return profitLossData.map((data, index) => {
      const trade = Trade.create(
        TradeId.create(`trade_${index}`),
        "user_123",
        CurrencyPair.create("EURUSD"),
        "BUY",
        Price.create(1.1000),
        LotSize.create(0.1),
        100,
        new Date()
      );

      if (data.profit !== undefined) {
        trade.close(Price.create(1.1050), new Date());
        trade.setProfitLoss(ProfitLoss.profit(data.profit, "USD"));
      } else if (data.loss !== undefined) {
        trade.close(Price.create(1.0950), new Date());
        trade.setProfitLoss(ProfitLoss.loss(-data.loss, "USD"));
      }

      return trade;
    });
  }
});

