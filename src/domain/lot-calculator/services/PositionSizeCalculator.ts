/**
 * PositionSizeCalculator Domain Service
 * Main service for calculating position size based on risk management
 */

import {
  RiskPercentage,
  AccountBalance,
  StopLoss,
  CurrencyPair,
  AccountCurrency,
  LotSize,
  PipValue,
} from "../value-objects";
import { PositionSizeCalculation } from "../entities/PositionSizeCalculation";
import { PipValueCalculator } from "./PipValueCalculator";

export interface PositionSizeCalculationParams {
  accountBalance: AccountBalance;
  riskPercentage: RiskPercentage;
  stopLoss: StopLoss;
  currencyPair: CurrencyPair;
  accountCurrency: AccountCurrency;
  currentPrice?: number; // Required for USD/XXX pairs, optional for others
}

export class PositionSizeCalculator {
  private readonly pipValueCalculator: PipValueCalculator;

  constructor(pipValueCalculator: PipValueCalculator) {
    this.pipValueCalculator = pipValueCalculator;
  }

  /**
   * Calculate position size based on risk management parameters
   */
  async calculate(
    params: PositionSizeCalculationParams
  ): Promise<PositionSizeCalculation> {
    const {
      accountBalance,
      riskPercentage,
      stopLoss,
      currencyPair,
      accountCurrency,
      currentPrice,
    } = params;

    // 1. Calculate risk amount
    const riskAmount = riskPercentage.calculateRiskAmount(
      accountBalance.amount
    );

    // 2. Calculate pip value per lot
    const pipValue = await this.pipValueCalculator.calculate(
      currencyPair,
      accountCurrency,
      currentPrice
    );

    // 3. Calculate lot size
    // Formula: Lot Size = Risk Amount / (Stop Loss × Pip Value per Lot)
    const stopLossValue = stopLoss.value;
    const pipValuePerLot = pipValue.value;

    if (stopLossValue === 0 || pipValuePerLot === 0) {
      throw new Error(
        "Stop loss and pip value must be greater than 0"
      );
    }

    const lotSizeValue = riskAmount / (stopLossValue * pipValuePerLot);
    const lotSize = LotSize.create(lotSizeValue);

    // 4. Calculate position size (units)
    const positionSize = lotSize.toPositionSize(); // Standard lot = 100,000 units

    // 5. Create and return calculation result
    const id = this.generateCalculationId();
    return PositionSizeCalculation.create(
      id,
      lotSize,
      positionSize,
      riskAmount,
      accountBalance,
      riskPercentage,
      currencyPair,
      accountCurrency,
      stopLoss,
      pipValue
    );
  }

  /**
   * Generate unique calculation ID
   */
  private generateCalculationId(): string {
    return `calc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

