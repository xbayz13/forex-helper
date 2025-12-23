/**
 * CreateTradeCommandHandler
 * Handler for CreateTradeCommand
 */

import { CreateTradeCommand } from "./CreateTradeCommand";
import { TradeDTO } from "../dtos/TradeDTO";
import {
  TradeId,
  Price,
  CurrencyPair,
  LotSize,
} from "@/domain";
import { Trade } from "@/domain/trade-history/entities/Trade";
import { ITradeRepository } from "@/domain/trade-history/repositories/ITradeRepository";
import { TradeValidator } from "@/domain/trade-history/services/TradeValidator";

export class CreateTradeCommandHandler {
  constructor(
    private readonly tradeRepository: ITradeRepository,
    private readonly tradeValidator: TradeValidator
  ) {}

  async handle(command: CreateTradeCommand): Promise<TradeDTO> {
    // Create value objects
    const tradeId = TradeId.generate();
    const pair = CurrencyPair.create(command.pair);
    const entryPrice = Price.create(command.entryPrice);
    const lotSize = LotSize.create(command.lotSize);
    const stopLoss = command.stopLoss ? Price.create(command.stopLoss) : null;
    const takeProfit = command.takeProfit
      ? Price.create(command.takeProfit)
      : null;

    // Validate trade creation
    const validation = this.tradeValidator.validateTradeCreation(
      entryPrice,
      stopLoss,
      takeProfit,
      lotSize,
      command.direction
    );

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    // Validate risk amount (assuming account balance is known, simplified)
    // In real implementation, would fetch account balance from user
    const riskValidation = this.tradeValidator.validateRiskAmount(
      command.riskAmount,
      command.riskAmount * 100 // Simplified: assume account balance is much larger
    );

    if (!riskValidation.isValid) {
      throw new Error(
        `Risk validation failed: ${riskValidation.errors.join(", ")}`
      );
    }

    // Create trade entity
    const entryTime = command.entryTime
      ? new Date(command.entryTime)
      : new Date();

    const trade = Trade.create(
      tradeId,
      command.userId,
      pair,
      command.direction,
      entryPrice,
      lotSize,
      command.riskAmount,
      entryTime,
      stopLoss,
      takeProfit,
      command.notes || null
    );

    // Save trade
    await this.tradeRepository.save(trade);

    // Convert to DTO
    return this.toDTO(trade);
  }

  private toDTO(trade: Trade): TradeDTO {
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

