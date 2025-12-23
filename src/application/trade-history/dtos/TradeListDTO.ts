/**
 * TradeListDTO
 * Data Transfer Object for trade list with pagination
 */
import { TradeDTO } from "./TradeDTO";

export interface TradeListDTO {
  trades: TradeDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

