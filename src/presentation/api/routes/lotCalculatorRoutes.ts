/**
 * Lot Calculator Routes
 * Routes for lot calculator endpoints
 */

import { LotCalculatorController } from "../controllers/LotCalculatorController";
import { createAuthMiddleware } from "../middleware/authMiddleware";
import { JwtService } from "@/infrastructure/authentication/JwtService";

export function createLotCalculatorRoutes(
  controller: LotCalculatorController,
  jwtService: JwtService
) {
  const authMiddleware = createAuthMiddleware(jwtService);

  return {
    "/api/lot-calculator/calculate": {
      POST: async (req: Request) => {
        const authenticatedReq = await authMiddleware(req);
        return controller.calculate(authenticatedReq);
      },
    },
    "/api/lot-calculator/pairs": {
      GET: controller.getPairs,
    },
    "/api/lot-calculator/pip-value": {
      GET: controller.getPipValue,
    },
  };
}

