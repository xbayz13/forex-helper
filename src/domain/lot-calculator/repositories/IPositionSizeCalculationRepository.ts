/**
 * PositionSizeCalculationRepository Interface
 * Repository interface for storing and retrieving position size calculations
 */

import { PositionSizeCalculation } from "../entities/PositionSizeCalculation";

export interface IPositionSizeCalculationRepository {
  /**
   * Save a position size calculation
   */
  save(calculation: PositionSizeCalculation): Promise<void>;

  /**
   * Find calculation by ID
   */
  findById(id: string): Promise<PositionSizeCalculation | null>;

  /**
   * Find calculations by user ID
   */
  findByUserId(userId: string): Promise<PositionSizeCalculation[]>;

  /**
   * Delete a calculation
   */
  delete(id: string): Promise<void>;
}

