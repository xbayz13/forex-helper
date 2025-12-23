/**
 * MetricsDTO
 * Data Transfer Object for performance metrics
 */
export interface MetricsDTO {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfitLoss: number;
  profitLossCurrency: string;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  expectancy: number;
  maximumDrawdown: number;
  maximumDrawdownPercentage: number;
  maximumDrawdownCurrency: string;
  averageRiskRewardRatio: number | null;
  bestTrade: number | null;
  bestTradeCurrency: string | null;
  worstTrade: number | null;
  worstTradeCurrency: string | null;
  longestWinningStreak: number;
  longestLosingStreak: number;
}

