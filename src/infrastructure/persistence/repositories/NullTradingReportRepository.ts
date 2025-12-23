/**
 * NullTradingReportRepository
 * Stub implementation that doesn't persist reports (reports generated on-the-fly)
 */

import { ITradingReportRepository } from "@/domain/reports/repositories/ITradingReportRepository";
import { TradingReport } from "@/domain/reports/entities/TradingReport";

export class NullTradingReportRepository implements ITradingReportRepository {
  private reports = new Map<string, TradingReport>();

  async save(report: TradingReport): Promise<void> {
    // Store in memory only (not persisted)
    this.reports.set(report.id, report);
  }

  async findById(id: string): Promise<TradingReport | null> {
    return this.reports.get(id) || null;
  }

  async findByUserId(userId: string): Promise<TradingReport[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.userId === userId
    );
  }

  async delete(id: string): Promise<void> {
    this.reports.delete(id);
  }
}

