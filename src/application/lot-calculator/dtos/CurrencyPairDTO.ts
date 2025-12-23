/**
 * CurrencyPairDTO
 * Data Transfer Object for currency pair
 */
export interface CurrencyPairDTO {
  pair: string;
  displayName: string;
  baseCurrency: string;
  quoteCurrency: string;
  type: "major" | "cross" | "metal";
}

