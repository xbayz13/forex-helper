/**
 * GetPerformanceMetricsQueryHandler
 * Handler for GetPerformanceMetricsQuery
 */

import { GetPerformanceMetricsQuery } from "./GetPerformanceMetricsQuery";
import { MetricsDTO } from "../dtos/MetricsDTO";
import { MetricsCalculator } from "@/domain/reports/services/MetricsCalculator";
import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";

export class GetPerformanceMetricsQueryHandler {
  constructor(
    private readonly metricsCalculator: MetricsCalculator,
    private readonly tradeRepository: ITradeRepository
  ) {}

  async handle(query: GetPerformanceMetricsQuery): Promise<MetricsDTO> {
    // Get trades
    let trades = await this.tradeRepository.findByUserId(query.userId);

    // Filter by date range if provided
    if (query.startDate || query.endDate) {
      const startDate = query.startDate ? new Date(query.startDate) : undefined;
      const endDate = query.endDate ? new Date(query.endDate) : undefined;

      trades = trades.filter((t) => {
        const entryTime = t.entryTime;
        if (startDate && entryTime < startDate) return false;
        if (endDate && entryTime > endDate) return false;
        return true;
      });
    }

    // Calculate metrics using domain service
    const metrics = this.metricsCalculator.calculate(trades);

    // Convert to DTO
    return this.toDTO(metrics);
  }

  private toDTO(
    metrics: import("@/domain/reports/entities/PerformanceMetrics").PerformanceMetrics
  ): MetricsDTO {
    return {
      totalTrades: metrics.totalTrades,
      winningTrades: metrics.winningTrades,
      losingTrades: metrics.losingTrades,
      winRate: metrics.winRate.value,
      totalProfitLoss: metrics.totalProfitLoss.amount,
      profitLossCurrency: metrics.totalProfitLoss.currency,
      averageWin: metrics.averageWin,
      averageLoss: metrics.averageLoss,
      profitFactor: metrics.profitFactor.value,
      expectancy: metrics.expectancy,
      maximumDrawdown: metrics.maximumDrawdown.amount,
      maximumDrawdownPercentage: metrics.maximumDrawdown.percentage,
      maximumDrawdownCurrency: metrics.maximumDrawdown.currency,
      averageRiskRewardRatio: metrics.averageRiskRewardRatio,
      bestTrade: metrics.bestTrade?.amount ?? null,
      bestTradeCurrency: metrics.bestTrade?.currency ?? null,
      worstTrade: metrics.worstTrade?.amount ?? null,
      worstTradeCurrency: metrics.worstTrade?.currency ?? null,
      longestWinningStreak: metrics.longestWinningStreak,
      longestLosingStreak: metrics.longestLosingStreak,
    };
  }
}

