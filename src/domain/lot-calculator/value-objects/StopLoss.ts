/**
 * StopLoss Value Object
 * Represents stop loss in pips (forex) or points (XAU/USD) (immutable)
 */
export class StopLoss {
  private readonly _value: number;
  private readonly _unit: "pips" | "points";

  private constructor(value: number, unit: "pips" | "points") {
    if (value <= 0) {
      throw new Error("Stop loss must be greater than 0");
    }
    this._value = value;
    this._unit = unit;
  }

  /**
   * Create a StopLoss in pips
   */
  static createInPips(value: number): StopLoss {
    return new StopLoss(value, "pips");
  }

  /**
   * Create a StopLoss in points
   */
  static createInPoints(value: number): StopLoss {
    return new StopLoss(value, "points");
  }

  /**
   * Get the stop loss value
   */
  get value(): number {
    return this._value;
  }

  /**
   * Get the unit (pips or points)
   */
  get unit(): "pips" | "points" {
    return this._unit;
  }

  /**
   * Check if stop loss is in pips
   */
  isInPips(): boolean {
    return this._unit === "pips";
  }

  /**
   * Check if stop loss is in points
   */
  isInPoints(): boolean {
    return this._unit === "points";
  }

  /**
   * Equality comparison
   */
  equals(other: StopLoss): boolean {
    return this._value === other._value && this._unit === other._unit;
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this._value} ${this._unit}`;
  }
}

