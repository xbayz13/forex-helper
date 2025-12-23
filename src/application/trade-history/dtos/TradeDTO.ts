/**
 * TradeDTO
 * Data Transfer Object for trade
 */
export interface TradeDTO {
  id: string;
  userId: string;
  pair: string;
  direction: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number | null;
  lotSize: number;
  stopLoss: number | null;
  takeProfit: number | null;
  pips: number | null;
  points: number | null;
  pipsUnit: "pips" | "points" | null;
  profitLoss: number | null;
  profitLossCurrency: string | null;
  riskAmount: number;
  riskRewardRatio: number | null;
  status: "OPEN" | "WIN" | "LOSS" | "BREAK_EVEN";
  entryTime: string;
  exitTime: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

