/**
 * WinRate Value Object
 * Represents win rate percentage (immutable)
 */
export class WinRate {
  private readonly _value: number; // 0-100

  private constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error("Win rate must be between 0 and 100");
    }
    this._value = value;
  }

  /**
   * Create a WinRate from percentage (0-100)
   */
  static create(value: number): WinRate {
    return new WinRate(value);
  }

  /**
   * Get the win rate value (0-100)
   */
  get value(): number {
    return this._value;
  }

  /**
   * Get decimal representation (0-1)
   */
  get decimal(): number {
    return this._value / 100;
  }

  /**
   * Equality comparison
   */
  equals(other: WinRate): boolean {
    return Math.abs(this._value - other._value) < 0.01;
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this._value.toFixed(2)}%`;
  }
}

