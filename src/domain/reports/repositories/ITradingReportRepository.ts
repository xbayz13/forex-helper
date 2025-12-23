/**
 * TradingReportRepository Interface
 * Repository interface for storing and retrieving trading reports
 */

import { TradingReport } from "../entities/TradingReport";

export interface ITradingReportRepository {
  /**
   * Save a trading report
   */
  save(report: TradingReport): Promise<void>;

  /**
   * Find report by ID
   */
  findById(id: string): Promise<TradingReport | null>;

  /**
   * Find reports by user ID
   */
  findByUserId(userId: string): Promise<TradingReport[]>;

  /**
   * Delete a report
   */
  delete(id: string): Promise<void>;
}

