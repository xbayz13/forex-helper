/**
 * AccountCurrency Value Object
 * Represents the account currency (immutable)
 */

export type SupportedCurrency = "USD" | "EUR" | "JPY" | "GBP" | "AUD" | "CAD" | "CHF" | "NZD" | "IDR";

export class AccountCurrency {
  private readonly _currency: SupportedCurrency;

  private static readonly SUPPORTED_CURRENCIES: readonly SupportedCurrency[] = [
    "USD",
    "EUR",
    "JPY",
    "GBP",
    "AUD",
    "CAD",
    "CHF",
    "NZD",
    "IDR",
  ] as const;

  private constructor(currency: string) {
    const normalized = currency.toUpperCase() as SupportedCurrency;
    if (!AccountCurrency.SUPPORTED_CURRENCIES.includes(normalized)) {
      throw new Error(
        `Unsupported currency: ${currency}. Supported currencies: ${AccountCurrency.SUPPORTED_CURRENCIES.join(", ")}`
      );
    }
    this._currency = normalized;
  }

  /**
   * Create an AccountCurrency
   */
  static create(currency: string): AccountCurrency {
    return new AccountCurrency(currency);
  }

  /**
   * Get the currency code
   */
  get currency(): SupportedCurrency {
    return this._currency;
  }

  /**
   * Get all supported currencies
   */
  static getSupportedCurrencies(): readonly SupportedCurrency[] {
    return AccountCurrency.SUPPORTED_CURRENCIES;
  }

  /**
   * Check if currency is supported
   */
  static isSupported(currency: string): boolean {
    return AccountCurrency.SUPPORTED_CURRENCIES.includes(
      currency.toUpperCase() as SupportedCurrency
    );
  }

  /**
   * Equality comparison
   */
  equals(other: AccountCurrency): boolean {
    return this._currency === other._currency;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._currency;
  }
}

