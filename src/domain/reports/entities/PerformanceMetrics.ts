/**
 * PerformanceMetrics Entity
 * Represents trading performance metrics
 */

import { WinRate, ProfitFactor, Drawdown } from "../value-objects";
import { ProfitLoss } from "../../trade-history/value-objects/ProfitLoss";

export class PerformanceMetrics {
  private readonly _totalTrades: number;
  private readonly _winningTrades: number;
  private readonly _losingTrades: number;
  private readonly _winRate: WinRate;
  private readonly _totalProfitLoss: ProfitLoss;
  private readonly _averageWin: number;
  private readonly _averageLoss: number;
  private readonly _profitFactor: ProfitFactor;
  private readonly _expectancy: number;
  private readonly _maximumDrawdown: Drawdown;
  private readonly _averageRiskRewardRatio: number | null;
  private readonly _bestTrade: ProfitLoss | null;
  private readonly _worstTrade: ProfitLoss | null;
  private readonly _longestWinningStreak: number;
  private readonly _longestLosingStreak: number;
  private readonly _calculatedAt: Date;

  private constructor(
    totalTrades: number,
    winningTrades: number,
    losingTrades: number,
    winRate: WinRate,
    totalProfitLoss: ProfitLoss,
    averageWin: number,
    averageLoss: number,
    profitFactor: ProfitFactor,
    expectancy: number,
    maximumDrawdown: Drawdown,
    averageRiskRewardRatio: number | null,
    bestTrade: ProfitLoss | null,
    worstTrade: ProfitLoss | null,
    longestWinningStreak: number,
    longestLosingStreak: number
  ) {
    this._totalTrades = totalTrades;
    this._winningTrades = winningTrades;
    this._losingTrades = losingTrades;
    this._winRate = winRate;
    this._totalProfitLoss = totalProfitLoss;
    this._averageWin = averageWin;
    this._averageLoss = averageLoss;
    this._profitFactor = profitFactor;
    this._expectancy = expectancy;
    this._maximumDrawdown = maximumDrawdown;
    this._averageRiskRewardRatio = averageRiskRewardRatio;
    this._bestTrade = bestTrade;
    this._worstTrade = worstTrade;
    this._longestWinningStreak = longestWinningStreak;
    this._longestLosingStreak = longestLosingStreak;
    this._calculatedAt = new Date();
  }

  /**
   * Create PerformanceMetrics
   */
  static create(
    totalTrades: number,
    winningTrades: number,
    losingTrades: number,
    winRate: WinRate,
    totalProfitLoss: ProfitLoss,
    averageWin: number,
    averageLoss: number,
    profitFactor: ProfitFactor,
    expectancy: number,
    maximumDrawdown: Drawdown,
    averageRiskRewardRatio: number | null = null,
    bestTrade: ProfitLoss | null = null,
    worstTrade: ProfitLoss | null = null,
    longestWinningStreak: number = 0,
    longestLosingStreak: number = 0
  ): PerformanceMetrics {
    return new PerformanceMetrics(
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

  // Getters
  get totalTrades(): number {
    return this._totalTrades;
  }

  get winningTrades(): number {
    return this._winningTrades;
  }

  get losingTrades(): number {
    return this._losingTrades;
  }

  get winRate(): WinRate {
    return this._winRate;
  }

  get totalProfitLoss(): ProfitLoss {
    return this._totalProfitLoss;
  }

  get averageWin(): number {
    return this._averageWin;
  }

  get averageLoss(): number {
    return this._averageLoss;
  }

  get profitFactor(): ProfitFactor {
    return this._profitFactor;
  }

  get expectancy(): number {
    return this._expectancy;
  }

  get maximumDrawdown(): Drawdown {
    return this._maximumDrawdown;
  }

  get averageRiskRewardRatio(): number | null {
    return this._averageRiskRewardRatio;
  }

  get bestTrade(): ProfitLoss | null {
    return this._bestTrade;
  }

  get worstTrade(): ProfitLoss | null {
    return this._worstTrade;
  }

  get longestWinningStreak(): number {
    return this._longestWinningStreak;
  }

  get longestLosingStreak(): number {
    return this._longestLosingStreak;
  }

  get calculatedAt(): Date {
    return this._calculatedAt;
  }
}

