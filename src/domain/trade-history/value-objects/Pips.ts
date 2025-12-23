/**
 * Pips Value Object
 * Represents pips or points difference (immutable)
 */
export class Pips {
  private readonly _value: number;
  private readonly _unit: "pips" | "points";

  private constructor(value: number, unit: "pips" | "points") {
    if (!isFinite(value)) {
      throw new Error("Pips value must be a finite number");
    }
    this._value = value;
    this._unit = unit;
  }

  /**
   * Create Pips in pips
   */
  static createInPips(value: number): Pips {
    return new Pips(value, "pips");
  }

  /**
   * Create Pips in points
   */
  static createInPoints(value: number): Pips {
    return new Pips(value, "points");
  }

  /**
   * Get the pips/points value
   */
  get value(): number {
    return this._value;
  }

  /**
   * Get the unit
   */
  get unit(): "pips" | "points" {
    return this._unit;
  }

  /**
   * Check if in pips
   */
  isInPips(): boolean {
    return this._unit === "pips";
  }

  /**
   * Check if in points
   */
  isInPoints(): boolean {
    return this._unit === "points";
  }

  /**
   * Get absolute value
   */
  getAbsoluteValue(): number {
    return Math.abs(this._value);
  }

  /**
   * Equality comparison
   */
  equals(other: Pips): boolean {
    return (
      Math.abs(this._value - other._value) < 0.01 &&
      this._unit === other._unit
    );
  }

  /**
   * String representation
   */
  toString(): string {
    const sign = this._value >= 0 ? "+" : "";
    return `${sign}${this._value.toFixed(2)} ${this._unit}`;
  }
}

