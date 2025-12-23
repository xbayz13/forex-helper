/**
 * ProfitLoss Value Object
 * Represents profit or loss amount (immutable)
 */
export class ProfitLoss {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency: string) {
    if (!isFinite(amount)) {
      throw new Error("Profit/Loss amount must be a finite number");
    }
    if (!currency || currency.length !== 3) {
      throw new Error("Currency must be a 3-letter code");
    }
    this._amount = amount;
    this._currency = currency.toUpperCase();
  }

  /**
   * Create a ProfitLoss (can be positive for profit, negative for loss)
   */
  static create(amount: number, currency: string): ProfitLoss {
    return new ProfitLoss(amount, currency);
  }

  /**
   * Create a profit
   */
  static profit(amount: number, currency: string): ProfitLoss {
    if (amount < 0) {
      throw new Error("Profit amount cannot be negative");
    }
    return new ProfitLoss(amount, currency);
  }

  /**
   * Create a loss
   */
  static loss(amount: number, currency: string): ProfitLoss {
    if (amount > 0) {
      throw new Error("Loss amount cannot be positive");
    }
    return new ProfitLoss(amount, currency);
  }

  /**
   * Get the amount (positive for profit, negative for loss)
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Get the currency
   */
  get currency(): string {
    return this._currency;
  }

  /**
   * Check if this is a profit
   */
  isProfit(): boolean {
    return this._amount > 0;
  }

  /**
   * Check if this is a loss
   */
  isLoss(): boolean {
    return this._amount < 0;
  }

  /**
   * Check if this is break even
   */
  isBreakEven(): boolean {
    return Math.abs(this._amount) < 0.01; // Tolerance for floating point
  }

  /**
   * Get absolute value of profit/loss
   */
  getAbsoluteValue(): number {
    return Math.abs(this._amount);
  }

  /**
   * Add another profit/loss (same currency required)
   */
  add(other: ProfitLoss): ProfitLoss {
    if (this._currency !== other._currency) {
      throw new Error("Cannot add profit/loss with different currencies");
    }
    return new ProfitLoss(this._amount + other._amount, this._currency);
  }

  /**
   * Equality comparison
   */
  equals(other: ProfitLoss, tolerance: number = 0.01): boolean {
    return (
      Math.abs(this._amount - other._amount) < tolerance &&
      this._currency === other._currency
    );
  }

  /**
   * String representation
   */
  toString(): string {
    const sign = this._amount >= 0 ? "+" : "";
    return `${sign}${this._currency} ${this._amount.toFixed(2)}`;
  }
}

