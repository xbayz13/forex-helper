/**
 * GetCurrencyPairsQuery
 * Query for getting available currency pairs
 */
export interface GetCurrencyPairsQuery {
  type?: "major" | "cross" | "metal"; // Optional filter by type
}

