/**
 * Drawdown Value Object
 * Represents drawdown value (immutable)
 */
export class Drawdown {
  private readonly _value: number; // Percentage or absolute amount
  private readonly _amount: number; // Absolute amount in currency
  private readonly _currency: string;

  private constructor(value: number, amount: number, currency: string) {
    if (value < 0 || value > 100) {
      throw new Error("Drawdown percentage must be between 0 and 100");
    }
    if (amount < 0) {
      throw new Error("Drawdown amount cannot be negative");
    }
    if (!currency || currency.length !== 3) {
      throw new Error("Currency must be a 3-letter code");
    }
    this._value = value;
    this._amount = amount;
    this._currency = currency.toUpperCase();
  }

  /**
   * Create a Drawdown
   */
  static create(value: number, amount: number, currency: string): Drawdown {
    return new Drawdown(value, amount, currency);
  }

  /**
   * Get drawdown percentage (0-100)
   */
  get percentage(): number {
    return this._value;
  }

  /**
   * Get drawdown amount in currency
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Get currency
   */
  get currency(): string {
    return this._currency;
  }

  /**
   * Check if drawdown is significant (> 20%)
   */
  isSignificant(): boolean {
    return this._value > 20;
  }

  /**
   * Equality comparison
   */
  equals(other: Drawdown, tolerance: number = 0.01): boolean {
    return (
      Math.abs(this._value - other._value) < tolerance &&
      Math.abs(this._amount - other._amount) < 0.01 &&
      this._currency === other._currency
    );
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this._value.toFixed(2)}% (${this._currency} ${this._amount.toFixed(2)})`;
  }
}

