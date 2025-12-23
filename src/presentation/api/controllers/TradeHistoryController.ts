/**
 * TradeHistoryController
 * Handles trade history endpoints
 */

import {
  CreateTradeCommandHandler,
  UpdateTradeCommandHandler,
  DeleteTradeCommandHandler,
} from "@/application/trade-history/commands";
import {
  GetTradesQueryHandler,
  GetTradeByIdQueryHandler,
  GetTradesByDateRangeQueryHandler,
} from "@/application/trade-history/queries";
import { asyncHandler, AppError } from "../middleware";

export class TradeHistoryController {
  constructor(
    private readonly createHandler: CreateTradeCommandHandler,
    private readonly updateHandler: UpdateTradeCommandHandler,
    private readonly deleteHandler: DeleteTradeCommandHandler,
    private readonly getTradesHandler: GetTradesQueryHandler,
    private readonly getTradeByIdHandler: GetTradeByIdQueryHandler,
    private readonly getTradesByDateRangeHandler: GetTradesByDateRangeQueryHandler
  ) {}

  create = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const body = await req.json();

    // Basic validation
    if (!body.pair || typeof body.pair !== "string") {
      throw new AppError(400, "Pair is required", "VALIDATION_ERROR");
    }
    if (body.direction !== "BUY" && body.direction !== "SELL") {
      throw new AppError(400, "Direction must be 'BUY' or 'SELL'", "VALIDATION_ERROR");
    }
    if (!body.entryPrice || Number(body.entryPrice) < 0) {
      throw new AppError(400, "Invalid entry price", "VALIDATION_ERROR");
    }
    if (!body.lotSize || Number(body.lotSize) < 0) {
      throw new AppError(400, "Invalid lot size", "VALIDATION_ERROR");
    }
    if (!body.riskAmount || Number(body.riskAmount) < 0) {
      throw new AppError(400, "Invalid risk amount", "VALIDATION_ERROR");
    }

    const trade = await this.createHandler.handle({
      ...body,
      userId: user.userId,
    });

    return Response.json(trade, { status: 201 });
  });

  getAll = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const pair = url.searchParams.get("pair");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const page = url.searchParams.get("page");
    const pageSize = url.searchParams.get("pageSize");

    const result = await this.getTradesHandler.handle({
      userId: user.userId,
      status: status as "OPEN" | "WIN" | "LOSS" | "BREAK_EVEN" | undefined,
      pair: pair || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    });

    return Response.json(result);
  });

  getById = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const tradeId = (req as any).params?.id;
    
    if (!tradeId) {
      throw new AppError(400, "Trade ID is required", "VALIDATION_ERROR");
    }

    const trade = await this.getTradeByIdHandler.handle({
      tradeId,
      userId: user.userId,
    });

    if (!trade) {
      throw new AppError(404, "Trade not found", "NOT_FOUND");
    }

    return Response.json(trade);
  });

  update = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const tradeId = (req as any).params?.id;
    
    if (!tradeId) {
      throw new AppError(400, "Trade ID is required", "VALIDATION_ERROR");
    }

    const body = await req.json();

    const trade = await this.updateHandler.handle({
      tradeId,
      userId: user.userId,
      exitPrice: body.exitPrice,
      exitTime: body.exitTime,
      notes: body.notes,
    });

    return Response.json(trade);
  });

  delete = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const tradeId = (req as any).params?.id;
    
    if (!tradeId) {
      throw new AppError(400, "Trade ID is required", "VALIDATION_ERROR");
    }

    await this.deleteHandler.handle({
      tradeId,
      userId: user.userId,
    });

    return Response.json({ message: "Trade deleted successfully" }, { status: 204 });
  });
}

