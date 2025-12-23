/**
 * UpdateTradeCommand
 * Command for updating a trade
 */
export interface UpdateTradeCommand {
  tradeId: string;
  userId: string;
  exitPrice?: number;
  exitTime?: string; // ISO string
  notes?: string | null;
}

