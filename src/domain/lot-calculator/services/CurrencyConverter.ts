/**
 * CurrencyConverter Domain Service
 * Handles currency conversion for lot calculations
 */

export interface ExchangeRateProvider {
  getRate(from: string, to: string): Promise<number>;
}

export class CurrencyConverter {
  private readonly exchangeRateProvider: ExchangeRateProvider;

  constructor(exchangeRateProvider: ExchangeRateProvider) {
    this.exchangeRateProvider = exchangeRateProvider;
  }

  /**
   * Convert amount from one currency to another
   */
  async convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rate = await this.exchangeRateProvider.getRate(fromCurrency, toCurrency);
    return amount * rate;
  }

  /**
   * Get exchange rate between two currencies
   */
  async getRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1;
    }
    return await this.exchangeRateProvider.getRate(fromCurrency, toCurrency);
  }
}

