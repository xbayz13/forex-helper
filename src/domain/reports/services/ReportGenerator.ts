/**
 * ReportGenerator Domain Service
 * Generates trading reports
 */

import { TradingReport } from "../entities/TradingReport";
import { PerformanceMetrics } from "../entities/PerformanceMetrics";
import { Trade } from "../../trade-history/entities/Trade";
import { MetricsCalculator } from "./MetricsCalculator";

export interface ReportGenerationParams {
  userId: string;
  startDate: Date;
  endDate: Date;
  trades: Trade[];
}

export class ReportGenerator {
  private readonly metricsCalculator: MetricsCalculator;

  constructor(metricsCalculator: MetricsCalculator) {
    this.metricsCalculator = metricsCalculator;
  }

  /**
   * Generate a trading report for a date range
   */
  generate(params: ReportGenerationParams): TradingReport {
    const { userId, startDate, endDate, trades } = params;

    // Filter trades by date range
    const filteredTrades = trades.filter((trade) => {
      const entryTime = trade.entryTime;
      return entryTime >= startDate && entryTime <= endDate;
    });

    // Calculate metrics
    const metrics = this.metricsCalculator.calculate(filteredTrades);

    // Generate report ID
    const reportId = this.generateReportId(userId, startDate, endDate);

    // Create and return report
    return TradingReport.create(
      reportId,
      userId,
      startDate,
      endDate,
      metrics,
      filteredTrades
    );
  }

  /**
   * Generate report ID
   */
  private generateReportId(
    userId: string,
    startDate: Date,
    endDate: Date
  ): string {
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];
    return `report_${userId}_${start}_${end}_${Date.now()}`;
  }
}

