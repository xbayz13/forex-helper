/**
 * CalculatePositionSizeCommand
 * Command for calculating position size
 */
export interface CalculatePositionSizeCommand {
  accountBalance: number;
  accountCurrency: string;
  riskPercentage: number;
  stopLoss: number;
  stopLossUnit: "pips" | "points";
  currencyPair: string;
  currentPrice?: number; // Required for USD/XXX pairs, optional for others
}

