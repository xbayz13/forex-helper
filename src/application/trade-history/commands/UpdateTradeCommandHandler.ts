/**
 * UpdateTradeCommandHandler
 * Handler for UpdateTradeCommand
 */

import { UpdateTradeCommand } from "./UpdateTradeCommand";
import { TradeDTO } from "../dtos/TradeDTO";
import { TradeId, Price } from "@/domain";
import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";
import { TradeValidator } from "@/domain/trade-history/services/TradeValidator";
import { TradeAnalyzer } from "@/domain/trade-history/services/TradeAnalyzer";

export class UpdateTradeCommandHandler {
  constructor(
    private readonly tradeRepository: ITradeRepository,
    private readonly tradeValidator: TradeValidator,
    private readonly tradeAnalyzer: TradeAnalyzer
  ) {}

  async handle(command: UpdateTradeCommand): Promise<TradeDTO> {
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

    // Update exit price if provided (closing trade)
    if (command.exitPrice !== undefined) {
      const exitPrice = Price.create(command.exitPrice);
      const exitTime = command.exitTime
        ? new Date(command.exitTime)
        : new Date();

      // Validate trade closing
      const validation = this.tradeValidator.validateTradeClosing(
        trade,
        exitPrice
      );

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Close trade
      trade.close(exitPrice, exitTime);

      // Analyze trade to calculate profit/loss
      await this.tradeAnalyzer.analyzeTrade(trade);
    }

    // Update notes if provided
    if (command.notes !== undefined) {
      trade.updateNotes(command.notes);
    }

    // Save updated trade
    await this.tradeRepository.save(trade);

    // Convert to DTO
    return this.toDTO(trade);
  }

  private toDTO(trade: import("@/domain/trade-history/entities/Trade").Trade): TradeDTO {
    return {
      id: trade.id.value,
      userId: trade.userId,
      pair: trade.pair.pair,
      direction: trade.direction,
      entryPrice: trade.entryPrice.value,
      exitPrice: trade.exitPrice?.value ?? null,
      lotSize: trade.lotSize.value,
      stopLoss: trade.stopLoss?.value ?? null,
      takeProfit: trade.takeProfit?.value ?? null,
      pips: trade.pips?.value ?? null,
      points: trade.points?.value ?? null,
      pipsUnit: trade.pips
        ? trade.pips.unit
        : trade.points
          ? trade.points.unit
          : null,
      profitLoss: trade.profitLoss?.amount ?? null,
      profitLossCurrency: trade.profitLoss?.currency ?? null,
      riskAmount: trade.riskAmount,
      riskRewardRatio: trade.riskRewardRatio,
      status: trade.status,
      entryTime: trade.entryTime.toISOString(),
      exitTime: trade.exitTime?.toISOString() ?? null,
      notes: trade.notes,
      createdAt: trade.createdAt.toISOString(),
      updatedAt: trade.updatedAt.toISOString(),
    };
  }
}

