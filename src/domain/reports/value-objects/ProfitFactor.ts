/**
 * ProfitFactor Value Object
 * Represents profit factor value (immutable)
 */
export class ProfitFactor {
  private readonly _value: number;

  private constructor(value: number) {
    if (value < 0) {
      throw new Error("Profit factor cannot be negative");
    }
    if (!isFinite(value)) {
      throw new Error("Profit factor must be a finite number");
    }
    this._value = value;
  }

  /**
   * Create a ProfitFactor
   */
  static create(value: number): ProfitFactor {
    return new ProfitFactor(value);
  }

  /**
   * Get the profit factor value
   */
  get value(): number {
    return this._value;
  }

  /**
   * Check if profit factor is profitable (> 1.0)
   */
  isProfitable(): boolean {
    return this._value > 1.0;
  }

  /**
   * Get rating based on profit factor
   */
  getRating(): "excellent" | "good" | "fair" | "poor" {
    if (this._value >= 2.0) return "excellent";
    if (this._value >= 1.5) return "good";
    if (this._value >= 1.0) return "fair";
    return "poor";
  }

  /**
   * Equality comparison
   */
  equals(other: ProfitFactor, tolerance: number = 0.01): boolean {
    return Math.abs(this._value - other._value) < tolerance;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value.toFixed(2);
  }
}

