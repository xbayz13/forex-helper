/**
 * TradeRepository Interface
 * Repository interface for storing and retrieving trades
 */

import { Trade } from "../entities/Trade";
import { TradeId } from "../value-objects/TradeId";

export interface ITradeRepository {
  /**
   * Save a trade (create or update)
   */
  save(trade: Trade): Promise<void>;

  /**
   * Find trade by ID
   */
  findById(id: TradeId): Promise<Trade | null>;

  /**
   * Find trades by user ID
   */
  findByUserId(userId: string): Promise<Trade[]>;

  /**
   * Find trades by user ID and status
   */
  findByUserIdAndStatus(userId: string, status: Trade["status"]): Promise<Trade[]>;

  /**
   * Find trades by user ID and date range
   */
  findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Trade[]>;

  /**
   * Delete a trade
   */
  delete(id: TradeId): Promise<void>;

  /**
   * Count trades by user ID
   */
  countByUserId(userId: string): Promise<number>;
}

