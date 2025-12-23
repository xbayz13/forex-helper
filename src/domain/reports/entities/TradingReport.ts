/**
 * TradingReport Entity
 * Represents a trading performance report
 */

import { PerformanceMetrics } from "./PerformanceMetrics";
import { Trade } from "../../trade-history/entities/Trade";

export class TradingReport {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _startDate: Date;
  private readonly _endDate: Date;
  private readonly _metrics: PerformanceMetrics;
  private readonly _trades: Trade[];
  private readonly _createdAt: Date;

  private constructor(
    id: string,
    userId: string,
    startDate: Date,
    endDate: Date,
    metrics: PerformanceMetrics,
    trades: Trade[]
  ) {
    if (endDate < startDate) {
      throw new Error("End date must be after start date");
    }

    this._id = id;
    this._userId = userId;
    this._startDate = startDate;
    this._endDate = endDate;
    this._metrics = metrics;
    this._trades = trades;
    this._createdAt = new Date();
  }

  /**
   * Create a TradingReport
   */
  static create(
    id: string,
    userId: string,
    startDate: Date,
    endDate: Date,
    metrics: PerformanceMetrics,
    trades: Trade[]
  ): TradingReport {
    return new TradingReport(id, userId, startDate, endDate, metrics, trades);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get metrics(): PerformanceMetrics {
    return this._metrics;
  }

  get trades(): Trade[] {
    return this._trades;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Equality comparison (by ID)
   */
  equals(other: TradingReport): boolean {
    return this._id === other._id;
  }
}

