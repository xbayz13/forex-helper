/**
 * GetTradesByDateRangeQueryHandler
 * Handler for GetTradesByDateRangeQuery
 */

import { GetTradesByDateRangeQuery } from "./GetTradesByDateRangeQuery";
import { TradeDTO } from "../dtos/TradeDTO";
import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";

export class GetTradesByDateRangeQueryHandler {
  constructor(private readonly tradeRepository: ITradeRepository) {}

  async handle(query: GetTradesByDateRangeQuery): Promise<TradeDTO[]> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    const trades = await this.tradeRepository.findByUserIdAndDateRange(
      query.userId,
      startDate,
      endDate
    );

    // Sort by entry time (newest first)
    trades.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());

    return trades.map((t) => this.toDTO(t));
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

