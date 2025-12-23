/**
 * CurrencyPair Value Object
 * Represents a currency pair for trading (immutable)
 */

export type MajorPair =
  | "EURUSD"
  | "GBPUSD"
  | "AUDUSD"
  | "NZDUSD"
  | "USDJPY"
  | "USDCHF"
  | "USDCAD";

export type CrossPair =
  | "EURJPY"
  | "EURGBP"
  | "EURCHF"
  | "GBPJPY"
  | "GBPCHF"
  | "AUDJPY"
  | "AUDCHF"
  | "CADJPY"
  | "CHFJPY"
  | "NZDJPY";

export type MetalPair = "XAUUSD";

export type CurrencyPairType = MajorPair | CrossPair | MetalPair;

export class CurrencyPair {
  private readonly _pair: string;
  private readonly _baseCurrency: string;
  private readonly _quoteCurrency: string;
  private readonly _type: "major" | "cross" | "metal";

  private constructor(pair: string) {
    const normalized = pair.toUpperCase().replace("/", "");

    // Validate XAU/USD
    if (normalized === "XAUUSD") {
      this._pair = normalized;
      this._baseCurrency = "XAU";
      this._quoteCurrency = "USD";
      this._type = "metal";
      return;
    }

    // Validate format (6 characters for standard pairs)
    if (normalized.length !== 6) {
      throw new Error(
        `Invalid currency pair format: ${pair}. Expected format: XXXYYY (e.g., EURUSD)`
      );
    }

    this._pair = normalized;
    this._baseCurrency = normalized.substring(0, 3);
    this._quoteCurrency = normalized.substring(3, 6);

    // Determine type
    const majorPairs: MajorPair[] = [
      "EURUSD",
      "GBPUSD",
      "AUDUSD",
      "NZDUSD",
      "USDJPY",
      "USDCHF",
      "USDCAD",
    ];
    const crossPairs: CrossPair[] = [
      "EURJPY",
      "EURGBP",
      "EURCHF",
      "GBPJPY",
      "GBPCHF",
      "AUDJPY",
      "AUDCHF",
      "CADJPY",
      "CHFJPY",
      "NZDJPY",
    ];

    if (majorPairs.includes(normalized as MajorPair)) {
      this._type = "major";
    } else if (crossPairs.includes(normalized as CrossPair)) {
      this._type = "cross";
    } else {
      // Assume it's a valid pair but not in predefined list
      this._type = "cross";
    }
  }

  /**
   * Create a CurrencyPair from string
   */
  static create(pair: string): CurrencyPair {
    return new CurrencyPair(pair);
  }

  /**
   * Get the pair string (e.g., "EURUSD")
   */
  get pair(): string {
    return this._pair;
  }

  /**
   * Get base currency (e.g., "EUR")
   */
  get baseCurrency(): string {
    return this._baseCurrency;
  }

  /**
   * Get quote currency (e.g., "USD")
   */
  get quoteCurrency(): string {
    return this._quoteCurrency;
  }

  /**
   * Get pair type
   */
  get type(): "major" | "cross" | "metal" {
    return this._type;
  }

  /**
   * Check if pair is XXX/USD format (base/USD)
   */
  isBaseUsd(): boolean {
    return this._quoteCurrency === "USD" && this._baseCurrency !== "USD";
  }

  /**
   * Check if pair is USD/XXX format (USD/quote)
   */
  isUsdQuote(): boolean {
    return this._baseCurrency === "USD" && this._quoteCurrency !== "USD";
  }

  /**
   * Check if pair is a cross pair (neither base nor quote is USD)
   */
  isCrossPair(): boolean {
    return (
      this._baseCurrency !== "USD" &&
      this._quoteCurrency !== "USD" &&
      this._type !== "metal"
    );
  }

  /**
   * Check if pair is XAU/USD (Gold)
   */
  isMetal(): boolean {
    return this._type === "metal";
  }

  /**
   * Get formatted display string (e.g., "EUR/USD")
   */
  toDisplayString(): string {
    return `${this._baseCurrency}/${this._quoteCurrency}`;
  }

  /**
   * Equality comparison
   */
  equals(other: CurrencyPair): boolean {
    return this._pair === other._pair;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._pair;
  }
}

