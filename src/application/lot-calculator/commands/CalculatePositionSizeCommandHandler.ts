/**
 * CalculatePositionSizeCommandHandler
 * Handler for CalculatePositionSizeCommand
 */

import { CalculatePositionSizeCommand } from "./CalculatePositionSizeCommand";
import { PositionSizeCalculationDTO } from "../dtos/PositionSizeCalculationDTO";
import {
  AccountBalance,
  AccountCurrency,
  RiskPercentage,
  StopLoss,
  CurrencyPair,
} from "@/domain/lot-calculator";
import { PositionSizeCalculator } from "@/domain/lot-calculator/services/PositionSizeCalculator";

export class CalculatePositionSizeCommandHandler {
  constructor(private readonly positionSizeCalculator: PositionSizeCalculator) {}

  async handle(
    command: CalculatePositionSizeCommand,
    userId: string
  ): Promise<PositionSizeCalculationDTO> {
    // Create value objects from command
    const accountBalance = AccountBalance.create(
      command.accountBalance,
      command.accountCurrency
    );
    const accountCurrency = AccountCurrency.create(command.accountCurrency);
    const riskPercentage = RiskPercentage.create(command.riskPercentage);
    const stopLoss =
      command.stopLossUnit === "pips"
        ? StopLoss.createInPips(command.stopLoss)
        : StopLoss.createInPoints(command.stopLoss);
    const currencyPair = CurrencyPair.create(command.currencyPair);

    // Calculate position size using domain service
    const calculation = await this.positionSizeCalculator.calculate({
      accountBalance,
      riskPercentage,
      stopLoss,
      currencyPair,
      accountCurrency,
      currentPrice: command.currentPrice,
    });

    // Convert entity to DTO
    return this.toDTO(calculation);
  }

  private toDTO(
    calculation: import("@/domain/lot-calculator").PositionSizeCalculation
  ): PositionSizeCalculationDTO {
    return {
      id: calculation.id,
      lotSize: calculation.lotSize.value,
      positionSize: calculation.positionSize,
      riskAmount: calculation.riskAmount,
      accountBalance: calculation.accountBalance.amount,
      accountCurrency: calculation.accountCurrency.currency,
      riskPercentage: calculation.riskPercentage.value,
      currencyPair: calculation.currencyPair.pair,
      stopLoss: calculation.stopLoss.value,
      stopLossUnit: calculation.stopLoss.unit,
      pipValue: calculation.pipValue.value,
      pipValueCurrency: calculation.pipValue.currency,
      calculatedAt: calculation.calculatedAt.toISOString(),
    };
  }
}

