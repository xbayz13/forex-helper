/**
 * GetPerformanceMetricsQuery
 * Query for getting performance metrics
 */
export interface GetPerformanceMetricsQuery {
  userId: string;
  startDate?: string; // ISO string, optional
  endDate?: string; // ISO string, optional
}

