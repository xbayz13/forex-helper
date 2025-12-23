/**
 * GenerateReportCommandHandler
 * Handler for GenerateReportCommand
 */

import { GenerateReportCommand } from "./GenerateReportCommand";
import { ReportDTO } from "../dtos/ReportDTO";
import { ReportGenerator } from "@/domain/reports/services/ReportGenerator";
import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";
import { ITradingReportRepository } from "@/domain/reports/repositories/ITradingReportRepository";

export class GenerateReportCommandHandler {
  constructor(
    private readonly reportGenerator: ReportGenerator,
    private readonly tradeRepository: ITradeRepository,
    private readonly reportRepository: ITradingReportRepository
  ) {}

  async handle(command: GenerateReportCommand): Promise<ReportDTO> {
    const startDate = new Date(command.startDate);
    const endDate = new Date(command.endDate);

    // Get trades for the date range
    const trades = await this.tradeRepository.findByUserIdAndDateRange(
      command.userId,
      startDate,
      endDate
    );

    // Generate report using domain service
    const report = this.reportGenerator.generate({
      userId: command.userId,
      startDate,
      endDate,
      trades,
    });

    // Save report
    await this.reportRepository.save(report);

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

