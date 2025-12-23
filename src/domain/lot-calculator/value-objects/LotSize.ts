/**
 * LotSize Value Object
 * Represents lot size for a trading position (immutable)
 */
export class LotSize {
  private readonly _value: number;

  private constructor(value: number) {
    if (value < 0) {
      throw new Error("Lot size cannot be negative");
    }
    this._value = value;
  }

  /**
   * Create a LotSize
   */
  static create(value: number): LotSize {
    return new LotSize(value);
  }

  /**
   * Get the lot size value
   */
  get value(): number {
    return this._value;
  }

  /**
   * Calculate position size (units) for standard lot (100,000 units)
   */
  toPositionSize(): number {
    return this._value * 100000;
  }

  /**
   * Calculate position size with custom contract size
   */
  toPositionSizeWithContractSize(contractSize: number): number {
    return this._value * contractSize;
  }

  /**
   * Get lot type (standard, mini, micro)
   */
  getLotType(): "standard" | "mini" | "micro" | "mixed" {
    if (this._value >= 1) return "standard";
    if (this._value >= 0.1) return "mini";
    if (this._value >= 0.01) return "micro";
    return "mixed";
  }

  /**
   * Equality comparison
   */
  equals(other: LotSize): boolean {
    return Math.abs(this._value - other._value) < 0.0001; // Float comparison tolerance
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this._value.toFixed(2)} lot${this._value !== 1 ? "s" : ""}`;
  }
}

