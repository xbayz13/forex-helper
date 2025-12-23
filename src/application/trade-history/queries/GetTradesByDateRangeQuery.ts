/**
 * GetTradesByDateRangeQuery
 * Query for getting trades within a date range
 */
export interface GetTradesByDateRangeQuery {
  userId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
}

