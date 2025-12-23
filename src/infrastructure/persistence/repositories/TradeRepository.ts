/**
 * TradeRepository Implementation
 * Prisma implementation of ITradeRepository
 */

import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";
import { Trade, TradeStatus } from "@/domain/trade-history/entities/Trade";
import { TradeId, Price, ProfitLoss, Pips } from "@/domain/trade-history/value-objects";
import { CurrencyPair } from "@/domain/lot-calculator/value-objects/CurrencyPair";
import { LotSize } from "@/domain/lot-calculator/value-objects/LotSize";
import { prisma } from "../database/prisma";
import type { Trade as PrismaTrade } from "@prisma/client";

export class TradeRepository implements ITradeRepository {
  async save(trade: Trade): Promise<void> {
    await prisma.trade.upsert({
      where: { id: trade.id.value },
      create: {
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
        profitLoss: trade.profitLoss?.amount ?? null,
        riskAmount: trade.riskAmount,
        riskRewardRatio: trade.riskRewardRatio ?? null,
        status: trade.status,
        entryTime: trade.entryTime,
        exitTime: trade.exitTime,
        notes: trade.notes,
        createdAt: trade.createdAt,
        updatedAt: trade.updatedAt,
      },
      update: {
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
        profitLoss: trade.profitLoss?.amount ?? null,
        riskAmount: trade.riskAmount,
        riskRewardRatio: trade.riskRewardRatio ?? null,
        status: trade.status,
        entryTime: trade.entryTime,
        exitTime: trade.exitTime,
        notes: trade.notes,
        updatedAt: trade.updatedAt,
      },
    });
  }

  async findById(id: TradeId): Promise<Trade | null> {
    const trade = await prisma.trade.findUnique({
      where: { id: id.value },
    });

    if (!trade) {
      return null;
    }

    return this.toEntity(trade);
  }

  async findByUserId(userId: string): Promise<Trade[]> {
    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { entryTime: "desc" },
    });

    return trades.map((trade) => this.toEntity(trade));
  }

  async findByUserIdAndStatus(
    userId: string,
    status: TradeStatus
  ): Promise<Trade[]> {
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        status,
      },
      orderBy: { entryTime: "desc" },
    });

    return trades.map((trade) => this.toEntity(trade));
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Trade[]> {
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        entryTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { entryTime: "desc" },
    });

    return trades.map((trade) => this.toEntity(trade));
  }

  async delete(id: TradeId): Promise<void> {
    await prisma.trade.delete({
      where: { id: id.value },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return await prisma.trade.count({
      where: { userId },
    });
  }

  private toEntity(trade: PrismaTrade): Trade {
    const id = TradeId.create(trade.id);
    const pair = CurrencyPair.create(trade.pair);
    const entryPrice = Price.create(parseFloat(trade.entryPrice.toString()));
    const exitPrice = trade.exitPrice ? Price.create(parseFloat(trade.exitPrice.toString())) : null;
    const lotSize = LotSize.create(parseFloat(trade.lotSize.toString()));
    const stopLoss = trade.stopLoss ? Price.create(parseFloat(trade.stopLoss.toString())) : null;
    const takeProfit = trade.takeProfit ? Price.create(parseFloat(trade.takeProfit.toString())) : null;
    const pips = trade.pips !== null && trade.pips !== undefined
      ? Pips.createInPips(parseFloat(trade.pips.toString()))
      : null;
    const points = trade.points !== null && trade.points !== undefined
      ? Pips.createInPoints(parseFloat(trade.points.toString()))
      : null;
    const profitLoss = trade.profitLoss !== null && trade.profitLoss !== undefined
      ? ProfitLoss.create(parseFloat(trade.profitLoss.toString()), "USD") // Currency should be stored in DB or derived
      : null;
    const riskRewardRatio = trade.riskRewardRatio
      ? parseFloat(trade.riskRewardRatio.toString())
      : null;

    return Trade.reconstitute(
      id,
      trade.userId,
      pair,
      trade.direction,
      entryPrice,
      exitPrice,
      lotSize,
      stopLoss,
      takeProfit,
      pips,
      points,
      profitLoss,
      parseFloat(trade.riskAmount.toString()),
      riskRewardRatio,
      trade.status,
      trade.entryTime,
      trade.exitTime,
      trade.notes,
      trade.createdAt,
      trade.updatedAt
    );
  }
}
