/**
 * DeleteTradeCommandHandler
 * Handler for DeleteTradeCommand
 */

import { DeleteTradeCommand } from "./DeleteTradeCommand";
import { TradeId } from "@/domain";
import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";

export class DeleteTradeCommandHandler {
  constructor(private readonly tradeRepository: ITradeRepository) {}

  async handle(command: DeleteTradeCommand): Promise<void> {
    // Find trade
    const tradeId = TradeId.create(command.tradeId);
    const trade = await this.tradeRepository.findById(tradeId);

    if (!trade) {
      throw new Error(`Trade not found: ${command.tradeId}`);
    }

    // Verify ownership
    if (trade.userId !== command.userId) {
      throw new Error("Unauthorized: Trade does not belong to user");
    }

    // Delete trade
    await this.tradeRepository.delete(tradeId);
  }
}

