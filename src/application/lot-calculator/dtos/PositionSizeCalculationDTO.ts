/**
 * PositionSizeCalculationDTO
 * Data Transfer Object for position size calculation result
 */
export interface PositionSizeCalculationDTO {
  id: string;
  lotSize: number;
  positionSize: number;
  riskAmount: number;
  accountBalance: number;
  accountCurrency: string;
  riskPercentage: number;
  currencyPair: string;
  stopLoss: number;
  stopLossUnit: "pips" | "points";
  pipValue: number;
  pipValueCurrency: string;
  calculatedAt: string;
}

