/**
 * GetCurrencyPairsQueryHandler
 * Handler for GetCurrencyPairsQuery
 */

import { GetCurrencyPairsQuery } from "./GetCurrencyPairsQuery";
import { CurrencyPairDTO } from "../dtos/CurrencyPairDTO";
import { CurrencyPair } from "@/domain/lot-calculator";

export class GetCurrencyPairsQueryHandler {
  // Define available currency pairs
  private readonly availablePairs: CurrencyPair[] = [
    // Major pairs
    CurrencyPair.create("EURUSD"),
    CurrencyPair.create("GBPUSD"),
    CurrencyPair.create("AUDUSD"),
    CurrencyPair.create("NZDUSD"),
    CurrencyPair.create("USDJPY"),
    CurrencyPair.create("USDCHF"),
    CurrencyPair.create("USDCAD"),
    // Cross pairs
    CurrencyPair.create("EURJPY"),
    CurrencyPair.create("EURGBP"),
    CurrencyPair.create("EURCHF"),
    CurrencyPair.create("GBPJPY"),
    CurrencyPair.create("GBPCHF"),
    CurrencyPair.create("AUDJPY"),
    CurrencyPair.create("AUDCHF"),
    CurrencyPair.create("CADJPY"),
    CurrencyPair.create("CHFJPY"),
    CurrencyPair.create("NZDJPY"),
    // Metal
    CurrencyPair.create("XAUUSD"),
  ];

  async handle(query: GetCurrencyPairsQuery): Promise<CurrencyPairDTO[]> {
    let pairs = this.availablePairs;

    // Filter by type if specified
    if (query.type) {
      pairs = pairs.filter((pair) => pair.type === query.type);
    }

    // Convert to DTOs
    return pairs.map((pair) => this.toDTO(pair));
  }

  private toDTO(pair: CurrencyPair): CurrencyPairDTO {
    return {
      pair: pair.pair,
      displayName: pair.toDisplayString(),
      baseCurrency: pair.baseCurrency,
      quoteCurrency: pair.quoteCurrency,
      type: pair.type,
    };
  }
}

