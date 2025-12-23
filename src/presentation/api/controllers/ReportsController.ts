/**
 * ReportsController
 * Handles reports and analytics endpoints
 */

import {
  GenerateReportCommandHandler,
} from "@/application/reports/commands";
import {
  GetPerformanceMetricsQueryHandler,
  GetReportQueryHandler,
} from "@/application/reports/queries";
import { asyncHandler, AppError } from "../middleware";

export class ReportsController {
  constructor(
    private readonly generateReportHandler: GenerateReportCommandHandler,
    private readonly getMetricsHandler: GetPerformanceMetricsQueryHandler,
    private readonly getReportHandler: GetReportQueryHandler
  ) {}

  getMetrics = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const metrics = await this.getMetricsHandler.handle({
      userId: user.userId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    return Response.json({ metrics });
  });

  generateReport = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const body = await req.json();

    // Basic validation
    if (!body.startDate || typeof body.startDate !== "string" || isNaN(Date.parse(body.startDate))) {
      throw new AppError(400, "Invalid start date format", "VALIDATION_ERROR");
    }
    if (!body.endDate || typeof body.endDate !== "string" || isNaN(Date.parse(body.endDate))) {
      throw new AppError(400, "Invalid end date format", "VALIDATION_ERROR");
    }

    const report = await this.generateReportHandler.handle({
      userId: user.userId,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    return Response.json(report, { status: 201 });
  });

  getReport = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const reportId = (req as any).params?.id;
    
    if (!reportId) {
      throw new AppError(400, "Report ID is required", "VALIDATION_ERROR");
    }

    const report = await this.getReportHandler.handle({
      reportId,
      userId: user.userId,
    });

    if (!report) {
      throw new AppError(404, "Report not found", "NOT_FOUND");
    }

    return Response.json(report);
  });
}

