/**
 * RiskPercentage Value Object
 * Represents the risk percentage for a trading position (immutable)
 */
export class RiskPercentage {
  private readonly _value: number;

  private constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error("Risk percentage must be between 0 and 100");
    }
    this._value = value;
  }

  /**
   * Create a RiskPercentage from a number (0-100)
   */
  static create(value: number): RiskPercentage {
    return new RiskPercentage(value);
  }

  /**
   * Get the numeric value (0-100)
   */
  get value(): number {
    return this._value;
  }

  /**
   * Get the decimal representation (0-1)
   */
  get decimal(): number {
    return this._value / 100;
  }

  /**
   * Calculate risk amount from account balance
   */
  calculateRiskAmount(accountBalance: number): number {
    return accountBalance * this.decimal;
  }

  /**
   * Equality comparison
   */
  equals(other: RiskPercentage): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this._value}%`;
  }
}

