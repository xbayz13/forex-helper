/**
 * API App
 * Main API application setup with all routes
 */

import { AuthController } from "./controllers/AuthController";
import { LotCalculatorController } from "./controllers/LotCalculatorController";
import { TradeHistoryController } from "./controllers/TradeHistoryController";
import { ReportsController } from "./controllers/ReportsController";
import { createAuthRoutes } from "./routes/authRoutes";
import { createLotCalculatorRoutes } from "./routes/lotCalculatorRoutes";
import { createTradeHistoryRoutes } from "./routes/tradeHistoryRoutes";
import { createReportsRoutes } from "./routes/reportsRoutes";
import { createDocsRoutes } from "./routes/docsRoutes";
import { JwtService } from "@/infrastructure/authentication/JwtService";

export interface AppDependencies {
  authController: AuthController;
  lotCalculatorController: LotCalculatorController;
  tradeHistoryController: TradeHistoryController;
  reportsController: ReportsController;
  jwtService: JwtService;
}

export function createApiRoutes(dependencies: AppDependencies) {
  const {
    authController,
    lotCalculatorController,
    tradeHistoryController,
    reportsController,
    jwtService,
  } = dependencies;

  // Merge all routes
  const routes = {
    ...createAuthRoutes(authController, jwtService),
    ...createLotCalculatorRoutes(lotCalculatorController, jwtService),
    ...createTradeHistoryRoutes(tradeHistoryController, jwtService),
    ...createReportsRoutes(reportsController, jwtService),
    ...createDocsRoutes(),
  };

  return routes;
}

