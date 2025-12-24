/**
 * Lot Calculator Routes
 * Routes for lot calculator endpoints
 * Note: All lot calculator routes are public (no authentication required)
 */

import { LotCalculatorController } from "../controllers/LotCalculatorController";
import { JwtService } from "@/infrastructure/authentication/JwtService";

export function createLotCalculatorRoutes(
  controller: LotCalculatorController,
  _jwtService: JwtService // Kept for API compatibility but not used (all routes are public)
) {
  return {
    "/api/lot-calculator/calculate": {
      POST: controller.calculate,
    },
    "/api/lot-calculator/pairs": {
      GET: controller.getPairs,
    },
    "/api/lot-calculator/pip-value": {
      GET: controller.getPipValue,
    },
  };
}

