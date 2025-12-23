/**
 * Price Value Object
 * Represents a price value (immutable)
 */
export class Price {
  private readonly _value: number;

  private constructor(value: number) {
    if (value < 0) {
      throw new Error("Price cannot be negative");
    }
    if (!isFinite(value)) {
      throw new Error("Price must be a finite number");
    }
    this._value = value;
  }

  /**
   * Create a Price
   */
  static create(value: number): Price {
    return new Price(value);
  }

  /**
   * Get the price value
   */
  get value(): number {
    return this._value;
  }

  /**
   * Calculate percentage change from another price
   */
  percentageChangeFrom(other: Price): number {
    if (other._value === 0) {
      throw new Error("Cannot calculate percentage change from zero price");
    }
    return ((this._value - other._value) / other._value) * 100;
  }

  /**
   * Calculate absolute difference from another price
   */
  differenceFrom(other: Price): number {
    return Math.abs(this._value - other._value);
  }

  /**
   * Equality comparison (with tolerance for floating point)
   */
  equals(other: Price, tolerance: number = 0.0001): boolean {
    return Math.abs(this._value - other._value) < tolerance;
  }

  /**
   * String representation
   */
  toString(decimalPlaces: number = 5): string {
    return this._value.toFixed(decimalPlaces);
  }
}

