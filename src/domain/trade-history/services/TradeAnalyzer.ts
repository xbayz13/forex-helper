/**
 * TradeAnalyzer Domain Service
 * Analyzes trades and calculates profit/loss, pips, etc.
 */

import { Trade } from "../entities/Trade";
import { ProfitLoss, Pips } from "../value-objects";
import { PipValueCalculator } from "../../lot-calculator/services/PipValueCalculator";
import { AccountCurrency } from "../../lot-calculator/value-objects/AccountCurrency";

export class TradeAnalyzer {
  private readonly pipValueCalculator: PipValueCalculator;
  private readonly accountCurrency: AccountCurrency;

  constructor(
    pipValueCalculator: PipValueCalculator,
    accountCurrency: AccountCurrency
  ) {
    this.pipValueCalculator = pipValueCalculator;
    this.accountCurrency = accountCurrency;
  }

  /**
   * Analyze a closed trade and calculate profit/loss
   */
  async analyzeTrade(trade: Trade): Promise<void> {
    if (!trade.isClosed() || !trade.exitPrice) {
      throw new Error("Cannot analyze an open trade");
    }

    // Calculate pip value for the pair
    const pipValue = await this.pipValueCalculator.calculate(
      trade.pair,
      this.accountCurrency,
      trade.entryPrice.value // Use entry price as current price for calculation
    );

    // Calculate profit/loss based on pips and lot size
    if (trade.pips) {
      const pipDifference = trade.pips.value;
      const pipValueForLotSize = pipValue.forLotSize(trade.lotSize.value);
      const profitLossAmount = (pipDifference / 10) * pipValueForLotSize; // Divide by 10 for standard pip calculation

      const profitLoss = profitLossAmount >= 0
        ? ProfitLoss.profit(profitLossAmount, this.accountCurrency.currency)
        : ProfitLoss.loss(profitLossAmount, this.accountCurrency.currency);

      trade.setProfitLoss(profitLoss);
    } else if (trade.points) {
      // For XAU/USD: 1 point = $1 per lot
      const pointDifference = trade.points.value;
      const profitLossAmount = pointDifference * trade.lotSize.value;

      const profitLoss = profitLossAmount >= 0
        ? ProfitLoss.profit(profitLossAmount, "USD")
        : ProfitLoss.loss(profitLossAmount, "USD");

      trade.setProfitLoss(profitLoss);
    }
  }

  /**
   * Calculate total profit/loss from multiple trades
   */
  calculateTotalProfitLoss(trades: Trade[]): ProfitLoss | null {
    if (trades.length === 0) {
      return null;
    }

    let totalAmount = 0;
    const currency = this.accountCurrency.currency;

    for (const trade of trades) {
      if (trade.profitLoss && trade.profitLoss.currency === currency) {
        totalAmount += trade.profitLoss.amount;
      }
    }

    if (totalAmount >= 0) {
      return ProfitLoss.profit(totalAmount, currency);
    } else {
      return ProfitLoss.loss(totalAmount, currency);
    }
  }

  /**
   * Calculate win rate from trades
   */
  calculateWinRate(trades: Trade[]): number {
    if (trades.length === 0) {
      return 0;
    }

    const closedTrades = trades.filter((t) => t.isClosed());
    if (closedTrades.length === 0) {
      return 0;
    }

    const winningTrades = closedTrades.filter((t) => t.isWin());
    return (winningTrades.length / closedTrades.length) * 100;
  }

  /**
   * Calculate average win amount
   */
  calculateAverageWin(trades: Trade[]): number {
    const winningTrades = trades.filter((t) => t.isWin() && t.profitLoss);
    if (winningTrades.length === 0) {
      return 0;
    }

    const totalWin = winningTrades.reduce((sum, trade) => {
      return sum + (trade.profitLoss?.getAbsoluteValue() || 0);
    }, 0);

    return totalWin / winningTrades.length;
  }

  /**
   * Calculate average loss amount
   */
  calculateAverageLoss(trades: Trade[]): number {
    const losingTrades = trades.filter((t) => t.isLoss() && t.profitLoss);
    if (losingTrades.length === 0) {
      return 0;
    }

    const totalLoss = losingTrades.reduce((sum, trade) => {
      return sum + (trade.profitLoss?.getAbsoluteValue() || 0);
    }, 0);

    return totalLoss / losingTrades.length;
  }
}

