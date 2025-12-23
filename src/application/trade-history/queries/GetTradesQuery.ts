/**
 * GetTradesQuery
 * Query for getting trades with filters and pagination
 */
export interface GetTradesQuery {
  userId: string;
  status?: "OPEN" | "WIN" | "LOSS" | "BREAK_EVEN";
  pair?: string;
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  page?: number;
  pageSize?: number;
}

