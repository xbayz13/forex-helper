/**
 * GetPipValueQuery
 * Query for getting pip value for a currency pair
 */
export interface GetPipValueQuery {
  currencyPair: string;
  accountCurrency: string;
  currentPrice?: number; // Required for USD/XXX pairs
}

