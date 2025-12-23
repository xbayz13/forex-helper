/**
 * GetReportQueryHandler
 * Handler for GetReportQuery
 */

import { GetReportQuery } from "./GetReportQuery";
import { ReportDTO } from "../dtos/ReportDTO";
import { ITradingReportRepository } from "@/domain/reports/repositories/ITradingReportRepository";

export class GetReportQueryHandler {
  constructor(private readonly reportRepository: ITradingReportRepository) {}

  async handle(query: GetReportQuery): Promise<ReportDTO | null> {
    const report = await this.reportRepository.findById(query.reportId);

    if (!report) {
      return null;
    }

    // Verify ownership
    if (report.userId !== query.userId) {
      throw new Error("Unauthorized: Report does not belong to user");
    }

    // Convert to DTO
    return this.toDTO(report);
  }

  private toDTO(
    report: import("@/domain/reports/entities/TradingReport").TradingReport
  ): ReportDTO {
    const metrics = report.metrics;

    return {
      id: report.id,
      userId: report.userId,
      startDate: report.startDate.toISOString(),
      endDate: report.endDate.toISOString(),
      metrics: {
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
      },
      totalTradesInReport: report.trades.length,
      createdAt: report.createdAt.toISOString(),
    };
  }
}

