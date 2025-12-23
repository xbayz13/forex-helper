/**
 * PipValue Value Object
 * Represents the value of one pip per lot in account currency (immutable)
 */
export class PipValue {
  private readonly _value: number;
  private readonly _currency: string;

  private constructor(value: number, currency: string) {
    if (value <= 0) {
      throw new Error("Pip value must be greater than 0");
    }
    if (!currency || currency.length !== 3) {
      throw new Error("Currency must be a 3-letter code");
    }
    this._value = value;
    this._currency = currency.toUpperCase();
  }

  /**
   * Create a PipValue
   */
  static create(value: number, currency: string): PipValue {
    return new PipValue(value, currency);
  }

  /**
   * Get the pip value per lot
   */
  get value(): number {
    return this._value;
  }

  /**
   * Get the currency
   */
  get currency(): string {
    return this._currency;
  }

  /**
   * Calculate total pip value for given lot size
   */
  forLotSize(lotSize: number): number {
    return this._value * lotSize;
  }

  /**
   * Equality comparison
   */
  equals(other: PipValue): boolean {
    return (
      Math.abs(this._value - other._value) < 0.01 &&
      this._currency === other._currency
    );
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this._currency} ${this._value.toFixed(2)} per lot`;
  }
}

