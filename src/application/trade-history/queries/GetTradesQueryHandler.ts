/**
 * GetTradesQueryHandler
 * Handler for GetTradesQuery
 */

import { GetTradesQuery } from "./GetTradesQuery";
import { TradeListDTO, TradeDTO } from "../dtos";
import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";
import { CurrencyPair } from "@/domain";

export class GetTradesQueryHandler {
  constructor(private readonly tradeRepository: ITradeRepository) {}

  async handle(query: GetTradesQuery): Promise<TradeListDTO> {
    let trades = await this.tradeRepository.findByUserId(query.userId);

    // Filter by status
    if (query.status) {
      trades = trades.filter((t) => t.status === query.status);
    }

    // Filter by pair
    if (query.pair) {
      const pair = CurrencyPair.create(query.pair);
      trades = trades.filter((t) => t.pair.equals(pair));
    }

    // Filter by date range
    if (query.startDate || query.endDate) {
      const startDate = query.startDate ? new Date(query.startDate) : undefined;
      const endDate = query.endDate ? new Date(query.endDate) : undefined;

      trades = trades.filter((t) => {
        const entryTime = t.entryTime;
        if (startDate && entryTime < startDate) return false;
        if (endDate && entryTime > endDate) return false;
        return true;
      });
    }

    // Sort by entry time (newest first)
    trades.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const total = trades.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTrades = trades.slice(startIndex, endIndex);

    return {
      trades: paginatedTrades.map((t) => this.toDTO(t)),
      total,
      page,
      pageSize,
      totalPages,
    };
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

