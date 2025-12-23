/**
 * CreateTradeCommand
 * Command for creating a new trade
 */
export interface CreateTradeCommand {
  userId: string;
  pair: string;
  direction: "BUY" | "SELL";
  entryPrice: number;
  lotSize: number;
  riskAmount: number;
  entryTime?: string; // ISO string, defaults to now
  stopLoss?: number;
  takeProfit?: number;
  notes?: string;
}

