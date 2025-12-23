/**
 * ReportDTO
 * Data Transfer Object for trading report
 */
import { MetricsDTO } from "./MetricsDTO";

export interface ReportDTO {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  metrics: MetricsDTO;
  totalTradesInReport: number;
  createdAt: string;
}

