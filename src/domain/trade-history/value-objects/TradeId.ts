/**
 * TradeId Value Object
 * Unique identifier for a trade (immutable)
 */
export class TradeId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Trade ID cannot be empty");
    }
    this._value = value.trim();
  }

  /**
   * Create a TradeId from string
   */
  static create(value: string): TradeId {
    return new TradeId(value);
  }

  /**
   * Generate a new TradeId
   */
  static generate(): TradeId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return new TradeId(`trade_${timestamp}_${random}`);
  }

  /**
   * Get the ID value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Equality comparison
   */
  equals(other: TradeId): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}

