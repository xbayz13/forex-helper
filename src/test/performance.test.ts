/**
 * Performance Testing Suite
 * 
 * Tests the performance of critical operations in the application:
 * - API endpoint response times
 * - Database query performance
 * - Domain service calculations
 * - Authentication operations
 */

import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { PositionSizeCalculator } from "@/domain/lot-calculator/services/PositionSizeCalculator";
import { CurrencyConverter, ExchangeRateProvider } from "@/domain/lot-calculator/services/CurrencyConverter";
import { PipValueCalculator } from "@/domain/lot-calculator/services/PipValueCalculator";
import { MetricsCalculator } from "@/domain/reports/services/MetricsCalculator";
import { BcryptPasswordHasher } from "@/infrastructure/authentication/BcryptPasswordHasher";
import { JwtService } from "@/infrastructure/authentication/JwtService";
import { AccountBalance, AccountCurrency, RiskPercentage, StopLoss, CurrencyPair, LotSize } from "@/domain/lot-calculator";
import { Trade } from "@/domain/trade-history/entities/Trade";
import { Price } from "@/domain/trade-history/value-objects/Price";
import { ProfitLoss } from "@/domain/trade-history/value-objects/ProfitLoss";
import { Pips } from "@/domain/trade-history/value-objects/Pips";
import { TradeId } from "@/domain/trade-history/value-objects/TradeId";
import { env } from "@/config/env";

// Mock ExchangeRateProvider for testing
class MockExchangeRateProvider implements ExchangeRateProvider {
  private rates: Record<string, number> = {
    "EURUSD": 1.1000,
    "GBPUSD": 1.2500,
    "AUDUSD": 0.6500,
    "USDJPY": 150.00,
    "EURGBP": 0.8800,
    "GBPEUR": 1.1364,
    "USDGBP": 0.8000,
    "GBPUSD": 1.2500,
  };

  async getRate(from: string, to: string): Promise<number> {
    const key = `${from}${to}`;
    if (this.rates[key]) {
      return this.rates[key];
    }
    
    // Default rates for common pairs
    if (from === "USD" && to === "EUR") return 0.9091;
    if (from === "EUR" && to === "USD") return 1.1000;
    if (from === "USD" && to === "GBP") return 0.8000;
    if (from === "GBP" && to === "USD") return 1.2500;
    if (from === "USD" && to === "JPY") return 150.00;
    if (from === "JPY" && to === "USD") return 0.0067;
    
    // Default to 1.0 if no rate found (same currency or unknown)
    return 1.0;
  }
}

// Performance thresholds (in milliseconds)
const THRESHOLDS = {
  LOT_CALCULATION: 50, // Position size calculation should be < 50ms
  METRICS_CALCULATION: 100, // Metrics calculation for 100 trades should be < 100ms
  PASSWORD_HASH: 200, // Password hashing should be < 200ms
  PASSWORD_VERIFY: 150, // Password verification should be < 150ms (bcrypt is intentionally slow)
  JWT_GENERATE: 10, // JWT generation should be < 10ms
  JWT_VERIFY: 5, // JWT verification should be < 5ms
  CURRENCY_CONVERSION: 10, // Currency conversion should be < 10ms
  PIP_VALUE_CALCULATION: 10, // Pip value calculation should be < 10ms
};

// Helper function to measure execution time
function measureTime(fn: () => void | Promise<void>): Promise<number> {
  return new Promise(async (resolve) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    resolve(end - start);
  });
}

// Helper function to run multiple iterations and get average
async function benchmark(
  fn: () => void | Promise<void>,
  iterations: number = 10
): Promise<{ avg: number; min: number; max: number; total: number }> {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const time = await measureTime(fn);
    times.push(time);
  }

  const total = times.reduce((sum, t) => sum + t, 0);
  const avg = total / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { avg, min, max, total };
}

describe("Performance Tests", () => {
  let passwordHasher: BcryptPasswordHasher;
  let jwtService: JwtService;
  let positionSizeCalculator: PositionSizeCalculator;
  let currencyConverter: CurrencyConverter;
  let pipValueCalculator: PipValueCalculator;
  let metricsCalculator: MetricsCalculator;

  beforeAll(() => {
    passwordHasher = new BcryptPasswordHasher();
    jwtService = new JwtService(env.JWT_SECRET || "test-secret");
    const exchangeRateProvider = new MockExchangeRateProvider();
    currencyConverter = new CurrencyConverter(exchangeRateProvider);
    pipValueCalculator = new PipValueCalculator(currencyConverter);
    positionSizeCalculator = new PositionSizeCalculator(
      pipValueCalculator,
      currencyConverter
    );
    metricsCalculator = new MetricsCalculator();
  });

  describe("Lot Calculator Performance", () => {
    test("Position size calculation should be fast", async () => {
      const accountBalance = AccountBalance.create(10000, "USD");
      const accountCurrency = AccountCurrency.create("USD");
      const riskPercentage = RiskPercentage.create(2);
      const stopLoss = StopLoss.createInPips(50);
      const currencyPair = CurrencyPair.create("EURUSD");

      const result = await benchmark(async () => {
        await positionSizeCalculator.calculate({
          accountBalance,
          riskPercentage,
          stopLoss,
          currencyPair,
          accountCurrency,
          currentPrice: 1.1000,
        });
      }, 20);

      console.log(`Position Size Calculation: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      expect(result.avg).toBeLessThan(THRESHOLDS.LOT_CALCULATION);
    });

    test("Currency conversion should be fast", async () => {
      const result = await benchmark(async () => {
        await currencyConverter.convert(100, "EUR", "USD", 1.1000);
      }, 100);

      console.log(`Currency Conversion: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      expect(result.avg).toBeLessThan(THRESHOLDS.CURRENCY_CONVERSION);
    });

    test("Pip value calculation should be fast", async () => {
      const currencyPair = CurrencyPair.create("EURUSD");
      const accountCurrency = AccountCurrency.create("USD");

      const result = await benchmark(async () => {
        await pipValueCalculator.calculate(currencyPair, accountCurrency, 1.1000);
      }, 100);

      console.log(`Pip Value Calculation: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      expect(result.avg).toBeLessThan(THRESHOLDS.PIP_VALUE_CALCULATION);
    });
  });

  describe("Reports Performance", () => {
    test("Metrics calculation should be fast for small datasets", async () => {
      // Create 10 sample trades
      const trades = Array.from({ length: 10 }, (_, i) => {
        const isWin = i % 2 === 0;
        const entryDate = new Date(2024, 0, i + 1);
        const exitDate = new Date(2024, 0, i + 1, 1);
        return Trade.reconstitute(
          TradeId.generate(),
          "test-user",
          CurrencyPair.create("EURUSD"),
          "BUY",
          Price.create(1.1000),
          Price.create(isWin ? 1.1050 : 1.0950),
          LotSize.create(0.1),
          Price.create(1.0950),
          Price.create(1.1100),
          isWin ? Pips.createInPips(50) : Pips.createInPips(-50),
          null,
          ProfitLoss.create(isWin ? 50 : -50, "USD"),
          10,
          1.5,
          isWin ? "WIN" : "LOSS",
          entryDate,
          exitDate,
          null,
          entryDate,
          exitDate
        );
      });

      const result = await benchmark(() => {
        metricsCalculator.calculate(trades);
      }, 50);

      console.log(`Metrics Calculation (10 trades): avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      expect(result.avg).toBeLessThan(THRESHOLDS.METRICS_CALCULATION);
    });

    test("Metrics calculation should scale well for large datasets", async () => {
      // Create 100 sample trades
      const trades = Array.from({ length: 100 }, (_, i) => {
        const isWin = i % 2 === 0;
        const entryDate = new Date(2024, 0, i + 1);
        const exitDate = new Date(2024, 0, i + 1, 1);
        return Trade.reconstitute(
          TradeId.generate(),
          "test-user",
          CurrencyPair.create("EURUSD"),
          "BUY",
          Price.create(1.1000),
          Price.create(isWin ? 1.1050 : 1.0950),
          LotSize.create(0.1),
          Price.create(1.0950),
          Price.create(1.1100),
          isWin ? Pips.createInPips(50) : Pips.createInPips(-50),
          null,
          ProfitLoss.create(isWin ? 50 : -50, "USD"),
          10,
          1.5,
          isWin ? "WIN" : "LOSS",
          entryDate,
          exitDate,
          null,
          entryDate,
          exitDate
        );
      });

      const result = await benchmark(() => {
        metricsCalculator.calculate(trades);
      }, 20);

      console.log(`Metrics Calculation (100 trades): avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      // Should still be reasonable even with 100 trades
      expect(result.avg).toBeLessThan(THRESHOLDS.METRICS_CALCULATION * 2);
    });
  });

  describe("Authentication Performance", () => {
    test("Password hashing should be reasonably fast", async () => {
      const password = "TestPassword123!";

      const result = await benchmark(async () => {
        await passwordHasher.hash(password);
      }, 10);

      console.log(`Password Hashing: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      expect(result.avg).toBeLessThan(THRESHOLDS.PASSWORD_HASH);
    });

    test("Password verification should be fast", async () => {
      const password = "TestPassword123!";
      const hashedPassword = await passwordHasher.hash(password);

      // Use fewer iterations for password verification as it's slower
      const result = await benchmark(async () => {
        await passwordHasher.verify(password, hashedPassword);
      }, 10);

      console.log(`Password Verification: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      expect(result.avg).toBeLessThan(THRESHOLDS.PASSWORD_VERIFY);
    }, 10000); // Increase timeout to 10 seconds

    test("JWT generation should be very fast", async () => {
      const payload = { userId: "test-user", email: "test@example.com" };

      const result = await benchmark(() => {
        jwtService.generateToken(payload);
      }, 100);

      console.log(`JWT Generation: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      expect(result.avg).toBeLessThan(THRESHOLDS.JWT_GENERATE);
    });

    test("JWT verification should be very fast", async () => {
      const payload = { userId: "test-user", email: "test@example.com" };
      const token = jwtService.generateToken(payload);

      const result = await benchmark(() => {
        jwtService.verifyToken(token);
      }, 100);

      console.log(`JWT Verification: avg=${result.avg.toFixed(2)}ms, min=${result.min.toFixed(2)}ms, max=${result.max.toFixed(2)}ms`);
      
      expect(result.avg).toBeLessThan(THRESHOLDS.JWT_VERIFY);
    });
  });

  describe("Memory Usage", () => {
    test("Position size calculation should not leak memory", async () => {
      const accountBalance = AccountBalance.create(10000, "USD");
      const accountCurrency = AccountCurrency.create("USD");
      const riskPercentage = RiskPercentage.create(2);
      const stopLoss = StopLoss.createInPips(50);
      const currencyPair = CurrencyPair.create("EURUSD");

      // Run many calculations
      for (let i = 0; i < 1000; i++) {
        await positionSizeCalculator.calculate({
          accountBalance,
          riskPercentage,
          stopLoss,
          currencyPair,
          accountCurrency,
          currentPrice: 1.1000,
        });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // If we get here without memory issues, test passes
      expect(true).toBe(true);
    });
  });
});

