/**
 * PipValueCalculator Domain Service
 * Calculates pip value per lot for different currency pairs
 */

import { CurrencyPair, AccountCurrency, PipValue } from "../value-objects";

export interface ExchangeRateProvider {
  getRate(from: string, to: string): Promise<number>;
}

export class PipValueCalculator {
  private readonly exchangeRateProvider?: ExchangeRateProvider;

  constructor(exchangeRateProvider?: ExchangeRateProvider) {
    this.exchangeRateProvider = exchangeRateProvider;
  }

  /**
   * Calculate pip value per lot
   * @param currencyPair The currency pair
   * @param accountCurrency The account currency
   * @param currentPrice Optional current price (required for USD/XXX pairs)
   * @returns PipValue per lot in account currency
   */
  async calculate(
    currencyPair: CurrencyPair,
    accountCurrency: AccountCurrency,
    currentPrice?: number
  ): Promise<PipValue> {
    // XAU/USD: $1 per point per lot
    if (currencyPair.isMetal()) {
      return PipValue.create(1, "USD");
    }

    const accountCurrencyStr = accountCurrency.currency;

    // XXX/USD with Account Currency = USD: $10 per lot
    if (currencyPair.isBaseUsd() && accountCurrencyStr === "USD") {
      return PipValue.create(10, "USD");
    }

    // USD/XXX with Account Currency = USD: $10 / Current Price per lot
    if (currencyPair.isUsdQuote() && accountCurrencyStr === "USD") {
      if (!currentPrice || currentPrice <= 0) {
        throw new Error(
          `Current price is required for USD/${currencyPair.quoteCurrency} pairs`
        );
      }
      const pipValue = 10 / currentPrice;
      return PipValue.create(pipValue, "USD");
    }

    // Cross pairs or different account currency: need conversion
    if (currencyPair.isCrossPair() || accountCurrencyStr !== currencyPair.quoteCurrency) {
      return await this.calculateWithConversion(
        currencyPair,
        accountCurrency,
        currentPrice
      );
    }

    // Default: assume quote currency matches account currency
    // For XXX/USD with account in USD (already handled above)
    // For other cases, use standard $10
    return PipValue.create(10, accountCurrencyStr);
  }

  /**
   * Calculate pip value with currency conversion
   */
  private async calculateWithConversion(
    currencyPair: CurrencyPair,
    accountCurrency: AccountCurrency,
    currentPrice?: number
  ): Promise<PipValue> {
    if (!this.exchangeRateProvider) {
      throw new Error(
        "Exchange rate provider is required for cross pairs or different account currency"
      );
    }

    const quoteCurrency = currencyPair.quoteCurrency;
    const accountCurrencyStr = accountCurrency.currency;

    // Base pip value in quote currency
    let basePipValue: number;

    if (currencyPair.isBaseUsd()) {
      // XXX/USD: $10 per lot in USD
      basePipValue = 10;
    } else if (currencyPair.isUsdQuote()) {
      // USD/XXX: need current price
      if (!currentPrice || currentPrice <= 0) {
        throw new Error(
          `Current price is required for USD/${quoteCurrency} pairs`
        );
      }
      basePipValue = 10 / currentPrice;
    } else {
      // Cross pair: $10 per lot in USD, convert quote currency
      basePipValue = 10;
      // If quote currency is not USD, we need to convert
      if (quoteCurrency !== "USD") {
        const rate = await this.exchangeRateProvider.getRate("USD", quoteCurrency);
        basePipValue = basePipValue * rate;
      }
    }

    // Convert to account currency if different
    if (quoteCurrency !== accountCurrencyStr) {
      const rate = await this.exchangeRateProvider.getRate(
        quoteCurrency,
        accountCurrencyStr
      );
      basePipValue = basePipValue * rate;
    }

    return PipValue.create(basePipValue, accountCurrencyStr);
  }
}

