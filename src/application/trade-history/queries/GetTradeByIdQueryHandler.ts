/**
 * GetTradeByIdQueryHandler
 * Handler for GetTradeByIdQuery
 */

import { GetTradeByIdQuery } from "./GetTradeByIdQuery";
import { TradeDTO } from "../dtos/TradeDTO";
import { TradeId } from "@/domain";
import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";

export class GetTradeByIdQueryHandler {
  constructor(private readonly tradeRepository: ITradeRepository) {}

  async handle(query: GetTradeByIdQuery): Promise<TradeDTO | null> {
    const tradeId = TradeId.create(query.tradeId);
    const trade = await this.tradeRepository.findById(tradeId);

    if (!trade) {
      return null;
    }

    // Verify ownership
    if (trade.userId !== query.userId) {
      throw new Error("Unauthorized: Trade does not belong to user");
    }

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

