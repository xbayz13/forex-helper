/**
 * Trade Entity
 * Represents a trading transaction with identity
 */

import { TradeId, Price, ProfitLoss, Pips } from "../value-objects";
import { CurrencyPair } from "../../lot-calculator/value-objects/CurrencyPair";
import { LotSize } from "../../lot-calculator/value-objects/LotSize";

export type TradeDirection = "BUY" | "SELL";
export type TradeStatus = "OPEN" | "WIN" | "LOSS" | "BREAK_EVEN";

export class Trade {
  private readonly _id: TradeId;
  private readonly _userId: string;
  private readonly _pair: CurrencyPair;
  private readonly _direction: TradeDirection;
  private readonly _entryPrice: Price;
  private _exitPrice: Price | null;
  private readonly _lotSize: LotSize;
  private readonly _stopLoss: Price | null;
  private readonly _takeProfit: Price | null;
  private _pips: Pips | null;
  private _points: Pips | null;
  private _profitLoss: ProfitLoss | null;
  private readonly _riskAmount: number;
  private _riskRewardRatio: number | null;
  private _status: TradeStatus;
  private readonly _entryTime: Date;
  private _exitTime: Date | null;
  private _notes: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: TradeId,
    userId: string,
    pair: CurrencyPair,
    direction: TradeDirection,
    entryPrice: Price,
    lotSize: LotSize,
    riskAmount: number,
    entryTime: Date,
    stopLoss: Price | null = null,
    takeProfit: Price | null = null,
    notes: string | null = null
  ) {
    this._id = id;
    this._userId = userId;
    this._pair = pair;
    this._direction = direction;
    this._entryPrice = entryPrice;
    this._exitPrice = null;
    this._lotSize = lotSize;
    this._stopLoss = stopLoss;
    this._takeProfit = takeProfit;
    this._pips = null;
    this._points = null;
    this._profitLoss = null;
    this._riskAmount = riskAmount;
    this._riskRewardRatio = null;
    this._status = "OPEN";
    this._entryTime = entryTime;
    this._exitTime = null;
    this._notes = notes;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Create a new open trade
   */
  static create(
    id: TradeId,
    userId: string,
    pair: CurrencyPair,
    direction: TradeDirection,
    entryPrice: Price,
    lotSize: LotSize,
    riskAmount: number,
    entryTime: Date = new Date(),
    stopLoss: Price | null = null,
    takeProfit: Price | null = null,
    notes: string | null = null
  ): Trade {
    return new Trade(
      id,
      userId,
      pair,
      direction,
      entryPrice,
      lotSize,
      riskAmount,
      entryTime,
      stopLoss,
      takeProfit,
      notes
    );
  }

  /**
   * Close the trade with exit price
   */
  close(exitPrice: Price, exitTime: Date = new Date()): void {
    if (this._status !== "OPEN") {
      throw new Error("Cannot close a trade that is not open");
    }

    this._exitPrice = exitPrice;
    this._exitTime = exitTime;

    // Calculate pips/points
    this.calculatePips();

    // Calculate risk/reward ratio if stop loss and take profit exist
    if (this._stopLoss && this._takeProfit) {
      this.calculateRiskRewardRatio();
    }

    this._updatedAt = new Date();
  }

  /**
   * Set calculated profit/loss (called by TradeAnalyzer service)
   */
  setProfitLoss(profitLoss: ProfitLoss): void {
    this._profitLoss = profitLoss;
    this.updateStatus();
    this._updatedAt = new Date();
  }

  /**
   * Set calculated pips (called by TradeAnalyzer service)
   */
  setPips(pips: Pips): void {
    this._pips = pips;
    this._updatedAt = new Date();
  }

  /**
   * Set calculated points (called by TradeAnalyzer service)
   */
  setPoints(points: Pips): void {
    this._points = points;
    this._updatedAt = new Date();
  }

  /**
   * Calculate pips/points from entry and exit prices
   */
  private calculatePips(): void {
    if (!this._exitPrice) {
      return;
    }

    // Calculate price difference
    const priceDiff = this._exitPrice.differenceFrom(this._entryPrice);
    const isProfitPrice = this._direction === "BUY" 
      ? this._exitPrice.value > this._entryPrice.value
      : this._exitPrice.value < this._entryPrice.value;

    // For XAU/USD, use points; for others, use pips
    if (this._pair.isMetal()) {
      // XAU/USD: 1 point = $0.01, typically use 100x for display
      this._points = Pips.createInPoints(priceDiff * 100);
    } else {
      // For forex, calculate pips (typically 4-5 decimal places)
      // Standard: 1 pip = 0.0001 for most pairs, 0.01 for JPY pairs
      const pipMultiplier = this._pair.quoteCurrency === "JPY" ? 100 : 10000;
      const pipsValue = priceDiff * pipMultiplier * (isProfitPrice ? 1 : -1);
      this._pips = Pips.createInPips(pipsValue);
    }
  }

  /**
   * Calculate risk/reward ratio
   */
  private calculateRiskRewardRatio(): void {
    if (!this._stopLoss || !this._takeProfit) {
      return;
    }

    const risk = Math.abs(this._entryPrice.differenceFrom(this._stopLoss));
    const reward = Math.abs(this._entryPrice.differenceFrom(this._takeProfit));
    
    if (risk > 0) {
      this._riskRewardRatio = reward / risk;
    }
  }

  /**
   * Update status based on profit/loss
   */
  private updateStatus(): void {
    if (!this._profitLoss) {
      return;
    }

    if (this._profitLoss.isBreakEven()) {
      this._status = "BREAK_EVEN";
    } else if (this._profitLoss.isProfit()) {
      this._status = "WIN";
    } else {
      this._status = "LOSS";
    }
  }

  /**
   * Update notes
   */
  updateNotes(notes: string | null): void {
    this._notes = notes;
    this._updatedAt = new Date();
  }

  // Getters
  get id(): TradeId {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get pair(): CurrencyPair {
    return this._pair;
  }

  get direction(): TradeDirection {
    return this._direction;
  }

  get entryPrice(): Price {
    return this._entryPrice;
  }

  get exitPrice(): Price | null {
    return this._exitPrice;
  }

  get lotSize(): LotSize {
    return this._lotSize;
  }

  get stopLoss(): Price | null {
    return this._stopLoss;
  }

  get takeProfit(): Price | null {
    return this._takeProfit;
  }

  get pips(): Pips | null {
    return this._pips;
  }

  get points(): Pips | null {
    return this._points;
  }

  get profitLoss(): ProfitLoss | null {
    return this._profitLoss;
  }

  get riskAmount(): number {
    return this._riskAmount;
  }

  get riskRewardRatio(): number | null {
    return this._riskRewardRatio;
  }

  get status(): TradeStatus {
    return this._status;
  }

  get entryTime(): Date {
    return this._entryTime;
  }

  get exitTime(): Date | null {
    return this._exitTime;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Check if trade is open
   */
  isOpen(): boolean {
    return this._status === "OPEN";
  }

  /**
   * Check if trade is closed
   */
  isClosed(): boolean {
    return this._status !== "OPEN";
  }

  /**
   * Check if trade is a win
   */
  isWin(): boolean {
    return this._status === "WIN";
  }

  /**
   * Check if trade is a loss
   */
  isLoss(): boolean {
    return this._status === "LOSS";
  }

  /**
   * Equality comparison (by ID)
   */
  equals(other: Trade): boolean {
    return this._id.equals(other._id);
  }
}
