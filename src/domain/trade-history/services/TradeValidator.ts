/**
 * TradeValidator Domain Service
 * Validates trade data according to business rules
 */

import { Trade } from "../entities/Trade";
import { Price } from "../value-objects/Price";
import { LotSize } from "../../lot-calculator/value-objects/LotSize";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class TradeValidator {
  /**
   * Validate trade creation parameters
   */
  validateTradeCreation(
    entryPrice: Price,
    stopLoss: Price | null,
    takeProfit: Price | null,
    lotSize: LotSize,
    direction: "BUY" | "SELL"
  ): ValidationResult {
    const errors: string[] = [];

    // Validate lot size
    if (lotSize.value <= 0) {
      errors.push("Lot size must be greater than 0");
    }

    // Validate stop loss
    if (stopLoss) {
      if (direction === "BUY" && stopLoss.value >= entryPrice.value) {
        errors.push("Stop loss for BUY trade must be below entry price");
      }
      if (direction === "SELL" && stopLoss.value <= entryPrice.value) {
        errors.push("Stop loss for SELL trade must be above entry price");
      }
    }

    // Validate take profit
    if (takeProfit) {
      if (direction === "BUY" && takeProfit.value <= entryPrice.value) {
        errors.push("Take profit for BUY trade must be above entry price");
      }
      if (direction === "SELL" && takeProfit.value >= entryPrice.value) {
        errors.push("Take profit for SELL trade must be below entry price");
      }
    }

    // Validate stop loss and take profit relationship
    if (stopLoss && takeProfit) {
      if (direction === "BUY") {
        if (takeProfit.value <= stopLoss.value) {
          errors.push("Take profit must be above stop loss for BUY trade");
        }
      } else {
        if (takeProfit.value >= stopLoss.value) {
          errors.push("Take profit must be below stop loss for SELL trade");
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate trade closing
   */
  validateTradeClosing(trade: Trade, exitPrice: Price): ValidationResult {
    const errors: string[] = [];

    if (!trade.isOpen()) {
      errors.push("Cannot close a trade that is not open");
    }

    if (exitPrice.value <= 0) {
      errors.push("Exit price must be greater than 0");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate risk amount
   */
  validateRiskAmount(riskAmount: number, accountBalance: number): ValidationResult {
    const errors: string[] = [];

    if (riskAmount <= 0) {
      errors.push("Risk amount must be greater than 0");
    }

    if (riskAmount > accountBalance) {
      errors.push("Risk amount cannot exceed account balance");
    }

    // Warn if risk is more than 5% of balance (business rule)
    const riskPercentage = (riskAmount / accountBalance) * 100;
    if (riskPercentage > 5) {
      errors.push(
        `Risk amount (${riskPercentage.toFixed(2)}%) exceeds recommended maximum of 5%`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

