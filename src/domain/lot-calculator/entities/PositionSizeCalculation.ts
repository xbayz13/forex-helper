/**
 * PositionSizeCalculation Entity
 * Represents a position size calculation result with identity
 */

import {
  LotSize,
  AccountBalance,
  RiskPercentage,
  CurrencyPair,
  AccountCurrency,
  StopLoss,
  PipValue,
} from "../value-objects";

export class PositionSizeCalculation {
  private readonly _id: string;
  private readonly _lotSize: LotSize;
  private readonly _positionSize: number;
  private readonly _riskAmount: number;
  private readonly _accountBalance: AccountBalance;
  private readonly _riskPercentage: RiskPercentage;
  private readonly _currencyPair: CurrencyPair;
  private readonly _accountCurrency: AccountCurrency;
  private readonly _stopLoss: StopLoss;
  private readonly _pipValue: PipValue;
  private readonly _calculatedAt: Date;

  private constructor(
    id: string,
    lotSize: LotSize,
    positionSize: number,
    riskAmount: number,
    accountBalance: AccountBalance,
    riskPercentage: RiskPercentage,
    currencyPair: CurrencyPair,
    accountCurrency: AccountCurrency,
    stopLoss: StopLoss,
    pipValue: PipValue,
    calculatedAt: Date
  ) {
    this._id = id;
    this._lotSize = lotSize;
    this._positionSize = positionSize;
    this._riskAmount = riskAmount;
    this._accountBalance = accountBalance;
    this._riskPercentage = riskPercentage;
    this._currencyPair = currencyPair;
    this._accountCurrency = accountCurrency;
    this._stopLoss = stopLoss;
    this._pipValue = pipValue;
    this._calculatedAt = calculatedAt;
  }

  /**
   * Create a new PositionSizeCalculation
   */
  static create(
    id: string,
    lotSize: LotSize,
    positionSize: number,
    riskAmount: number,
    accountBalance: AccountBalance,
    riskPercentage: RiskPercentage,
    currencyPair: CurrencyPair,
    accountCurrency: AccountCurrency,
    stopLoss: StopLoss,
    pipValue: PipValue
  ): PositionSizeCalculation {
    return new PositionSizeCalculation(
      id,
      lotSize,
      positionSize,
      riskAmount,
      accountBalance,
      riskPercentage,
      currencyPair,
      accountCurrency,
      stopLoss,
      pipValue,
      new Date()
    );
  }

  /**
   * Get calculation ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get calculated lot size
   */
  get lotSize(): LotSize {
    return this._lotSize;
  }

  /**
   * Get position size in units
   */
  get positionSize(): number {
    return this._positionSize;
  }

  /**
   * Get risk amount in account currency
   */
  get riskAmount(): number {
    return this._riskAmount;
  }

  /**
   * Get account balance used in calculation
   */
  get accountBalance(): AccountBalance {
    return this._accountBalance;
  }

  /**
   * Get risk percentage used in calculation
   */
  get riskPercentage(): RiskPercentage {
    return this._riskPercentage;
  }

  /**
   * Get currency pair
   */
  get currencyPair(): CurrencyPair {
    return this._currencyPair;
  }

  /**
   * Get account currency
   */
  get accountCurrency(): AccountCurrency {
    return this._accountCurrency;
  }

  /**
   * Get stop loss
   */
  get stopLoss(): StopLoss {
    return this._stopLoss;
  }

  /**
   * Get pip value used in calculation
   */
  get pipValue(): PipValue {
    return this._pipValue;
  }

  /**
   * Get calculation timestamp
   */
  get calculatedAt(): Date {
    return this._calculatedAt;
  }

  /**
   * Equality comparison (by ID)
   */
  equals(other: PositionSizeCalculation): boolean {
    return this._id === other._id;
  }
}

