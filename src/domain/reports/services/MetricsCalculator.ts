/**
 * MetricsCalculator Domain Service
 * Calculates trading performance metrics
 */

import { Trade } from "../../trade-history/entities/Trade";
import { PerformanceMetrics } from "../entities/PerformanceMetrics";
import { WinRate, ProfitFactor, Drawdown } from "../value-objects";
import { ProfitLoss } from "../../trade-history/value-objects/ProfitLoss";

export class MetricsCalculator {
  /**
   * Calculate performance metrics from trades
   */
  calculate(trades: Trade[]): PerformanceMetrics {
    if (trades.length === 0) {
      throw new Error("Cannot calculate metrics from empty trade list");
    }

    const closedTrades = trades.filter((t) => t.isClosed());
    
    if (closedTrades.length === 0) {
      throw new Error("Cannot calculate metrics: no closed trades");
    }

    // Basic counts
    const totalTrades = closedTrades.length;
    const winningTrades = closedTrades.filter((t) => t.isWin()).length;
    const losingTrades = closedTrades.filter((t) => t.isLoss()).length;

    // Win rate
    const winRate = WinRate.create((winningTrades / totalTrades) * 100);

    // Total profit/loss
    const totalProfitLoss = this.calculateTotalProfitLoss(closedTrades);

    // Average win
    const averageWin = this.calculateAverageWin(closedTrades);

    // Average loss
    const averageLoss = this.calculateAverageLoss(closedTrades);

    // Profit factor
    const profitFactor = this.calculateProfitFactor(closedTrades);

    // Expectancy
    const expectancy = this.calculateExpectancy(winRate, averageWin, averageLoss);

    // Maximum drawdown
    const maximumDrawdown = this.calculateMaximumDrawdown(closedTrades);

    // Average risk/reward ratio
    const averageRiskRewardRatio = this.calculateAverageRiskRewardRatio(closedTrades);

    // Best and worst trades
    const bestTrade = this.findBestTrade(closedTrades);
    const worstTrade = this.findWorstTrade(closedTrades);

    // Streaks
    const longestWinningStreak = this.calculateLongestWinningStreak(closedTrades);
    const longestLosingStreak = this.calculateLongestLosingStreak(closedTrades);

    return PerformanceMetrics.create(
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalProfitLoss,
      averageWin,
      averageLoss,
      profitFactor,
      expectancy,
      maximumDrawdown,
      averageRiskRewardRatio,
      bestTrade,
      worstTrade,
      longestWinningStreak,
      longestLosingStreak
    );
  }

  private calculateTotalProfitLoss(trades: Trade[]): ProfitLoss {
    let totalAmount = 0;
    const currency = trades[0]?.profitLoss?.currency || "USD";

    for (const trade of trades) {
      if (trade.profitLoss && trade.profitLoss.currency === currency) {
        totalAmount += trade.profitLoss.amount;
      }
    }

    if (totalAmount >= 0) {
      return ProfitLoss.profit(totalAmount, currency);
    } else {
      return ProfitLoss.loss(totalAmount, currency);
    }
  }

  private calculateAverageWin(trades: Trade[]): number {
    const winningTrades = trades.filter((t) => t.isWin() && t.profitLoss);
    if (winningTrades.length === 0) return 0;

    const total = winningTrades.reduce(
      (sum, t) => sum + (t.profitLoss?.getAbsoluteValue() || 0),
      0
    );
    return total / winningTrades.length;
  }

  private calculateAverageLoss(trades: Trade[]): number {
    const losingTrades = trades.filter((t) => t.isLoss() && t.profitLoss);
    if (losingTrades.length === 0) return 0;

    const total = losingTrades.reduce(
      (sum, t) => sum + (t.profitLoss?.getAbsoluteValue() || 0),
      0
    );
    return total / losingTrades.length;
  }

  private calculateProfitFactor(trades: Trade[]): ProfitFactor {
    let totalProfit = 0;
    let totalLoss = 0;

    for (const trade of trades) {
      if (trade.profitLoss) {
        if (trade.profitLoss.isProfit()) {
          totalProfit += trade.profitLoss.getAbsoluteValue();
        } else {
          totalLoss += trade.profitLoss.getAbsoluteValue();
        }
      }
    }

    if (totalLoss === 0) {
      return ProfitFactor.create(totalProfit > 0 ? Infinity : 0);
    }

    return ProfitFactor.create(totalProfit / totalLoss);
  }

  private calculateExpectancy(
    winRate: WinRate,
    averageWin: number,
    averageLoss: number
  ): number {
    const winRateDecimal = winRate.decimal;
    return winRateDecimal * averageWin - (1 - winRateDecimal) * averageLoss;
  }

  private calculateMaximumDrawdown(trades: Trade[]): Drawdown {
    // Simplified implementation - would need equity curve in real scenario
    // For now, calculate based on peak to trough in profit/loss
    let peak = 0;
    let maxDrawdown = 0;
    let maxDrawdownAmount = 0;
    let runningTotal = 0;
    const currency = trades[0]?.profitLoss?.currency || "USD";

    for (const trade of trades) {
      if (trade.profitLoss) {
        runningTotal += trade.profitLoss.amount;
        if (runningTotal > peak) {
          peak = runningTotal;
        }
        const drawdown = ((peak - runningTotal) / peak) * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
          maxDrawdownAmount = peak - runningTotal;
        }
      }
    }

    return Drawdown.create(
      maxDrawdown > 0 ? maxDrawdown : 0,
      maxDrawdownAmount > 0 ? maxDrawdownAmount : 0,
      currency
    );
  }

  private calculateAverageRiskRewardRatio(trades: Trade[]): number | null {
    const tradesWithRR = trades.filter(
      (t) => t.riskRewardRatio !== null && t.riskRewardRatio !== undefined
    );

    if (tradesWithRR.length === 0) {
      return null;
    }

    const sum = tradesWithRR.reduce(
      (acc, t) => acc + (t.riskRewardRatio || 0),
      0
    );
    return sum / tradesWithRR.length;
  }

  private findBestTrade(trades: Trade[]): ProfitLoss | null {
    let best: ProfitLoss | null = null;

    for (const trade of trades) {
      if (trade.profitLoss && trade.profitLoss.isProfit()) {
        if (!best || trade.profitLoss.amount > best.amount) {
          best = trade.profitLoss;
        }
      }
    }

    return best;
  }

  private findWorstTrade(trades: Trade[]): ProfitLoss | null {
    let worst: ProfitLoss | null = null;

    for (const trade of trades) {
      if (trade.profitLoss && trade.profitLoss.isLoss()) {
        if (!worst || trade.profitLoss.amount < worst.amount) {
          worst = trade.profitLoss;
        }
      }
    }

    return worst;
  }

  private calculateLongestWinningStreak(trades: Trade[]): number {
    let longest = 0;
    let current = 0;

    for (const trade of trades) {
      if (trade.isWin()) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }

    return longest;
  }

  private calculateLongestLosingStreak(trades: Trade[]): number {
    let longest = 0;
    let current = 0;

    for (const trade of trades) {
      if (trade.isLoss()) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }

    return longest;
  }
}

