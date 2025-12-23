/**
 * GetPipValueQueryHandler
 * Handler for GetPipValueQuery
 */

import { GetPipValueQuery } from "./GetPipValueQuery";
import { CurrencyPair, AccountCurrency } from "@/domain/lot-calculator";
import { PipValueCalculator } from "@/domain/lot-calculator/services/PipValueCalculator";

export interface PipValueResult {
  pipValue: number;
  currency: string;
  unit: "pips" | "points";
}

export class GetPipValueQueryHandler {
  constructor(private readonly pipValueCalculator: PipValueCalculator) {}

  async handle(query: GetPipValueQuery): Promise<PipValueResult> {
    const currencyPair = CurrencyPair.create(query.currencyPair);
    const accountCurrency = AccountCurrency.create(query.accountCurrency);

    const pipValue = await this.pipValueCalculator.calculate(
      currencyPair,
      accountCurrency,
      query.currentPrice
    );

    return {
      pipValue: pipValue.value,
      currency: pipValue.currency,
      unit: currencyPair.isMetal() ? "points" : "pips",
    };
  }
}

