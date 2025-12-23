/**
 * LotCalculatorController
 * Handles lot calculator endpoints
 */

import {
  CalculatePositionSizeCommandHandler,
} from "@/application/lot-calculator/commands";
import {
  GetCurrencyPairsQueryHandler,
  GetPipValueQueryHandler,
} from "@/application/lot-calculator/queries";
import { asyncHandler, AppError } from "../middleware";

export class LotCalculatorController {
  constructor(
    private readonly calculateHandler: CalculatePositionSizeCommandHandler,
    private readonly getPairsHandler: GetCurrencyPairsQueryHandler,
    private readonly getPipValueHandler: GetPipValueQueryHandler
  ) {}

  calculate = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const body = await req.json();

    // Basic validation
    if (!body.accountBalance || Number(body.accountBalance) < 0) {
      throw new AppError(400, "Invalid account balance", "VALIDATION_ERROR");
    }
    if (!body.accountCurrency || typeof body.accountCurrency !== "string") {
      throw new AppError(400, "Account currency is required", "VALIDATION_ERROR");
    }
    const riskPercentage = Number(body.riskPercentage);
    if (isNaN(riskPercentage) || riskPercentage < 0 || riskPercentage > 100) {
      throw new AppError(400, "Risk percentage must be between 0 and 100", "VALIDATION_ERROR");
    }
    if (!body.stopLoss || Number(body.stopLoss) < 0) {
      throw new AppError(400, "Invalid stop loss", "VALIDATION_ERROR");
    }
    if (body.stopLossUnit !== "pips" && body.stopLossUnit !== "points") {
      throw new AppError(400, "Stop loss unit must be 'pips' or 'points'", "VALIDATION_ERROR");
    }
    if (!body.currencyPair || typeof body.currencyPair !== "string") {
      throw new AppError(400, "Currency pair is required", "VALIDATION_ERROR");
    }

    const result = await this.calculateHandler.handle(
      {
        accountBalance: body.accountBalance,
        accountCurrency: body.accountCurrency,
        riskPercentage: body.riskPercentage,
        stopLoss: body.stopLoss,
        stopLossUnit: body.stopLossUnit,
        currencyPair: body.currencyPair,
        currentPrice: body.currentPrice,
      },
      user.userId
    );

    return Response.json(result);
  });

  getPairs = asyncHandler(async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    
    const pairs = await this.getPairsHandler.handle({
      type: type as "major" | "cross" | "metal" | undefined,
    });

    return Response.json({ pairs });
  });

  getPipValue = asyncHandler(async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const currencyPair = url.searchParams.get("currencyPair");
    const accountCurrency = url.searchParams.get("accountCurrency");
    const currentPrice = url.searchParams.get("currentPrice");

    if (!currencyPair || !accountCurrency) {
      throw new AppError(400, "currencyPair and accountCurrency are required", "VALIDATION_ERROR");
    }

    const result = await this.getPipValueHandler.handle({
      currencyPair,
      accountCurrency,
      currentPrice: currentPrice ? parseFloat(currentPrice) : undefined,
    });

    return Response.json(result);
  });
}

