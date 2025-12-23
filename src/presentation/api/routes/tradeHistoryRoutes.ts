/**
 * Trade History Routes
 * Routes for trade history endpoints
 */

import { TradeHistoryController } from "../controllers/TradeHistoryController";
import { createAuthMiddleware } from "../middleware/authMiddleware";
import { JwtService } from "@/infrastructure/authentication/JwtService";

export function createTradeHistoryRoutes(
  controller: TradeHistoryController,
  jwtService: JwtService
) {
  const authMiddleware = createAuthMiddleware(jwtService);

  // Helper to extract route params from URL
  const extractParams = (url: string, pattern: string): Record<string, string> => {
    const urlParts = url.split("?")[0].split("/");
    const patternParts = pattern.split("/");
    const params: Record<string, string> = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i]?.startsWith(":")) {
        const key = patternParts[i]!.substring(1);
        params[key] = urlParts[i] || "";
      }
    }
    
    return params;
  };

  const withAuthAndParams = (handler: (req: Request) => Promise<Response>, pattern: string) => {
    return async (req: Request) => {
      const authenticatedReq = await authMiddleware(req);
      const params = extractParams(req.url, pattern);
      (authenticatedReq as any).params = params;
      return handler(authenticatedReq);
    };
  };

  return {
    "/api/trades": {
      GET: async (req: Request) => {
        const authenticatedReq = await authMiddleware(req);
        return controller.getAll(authenticatedReq);
      },
      POST: async (req: Request) => {
        const authenticatedReq = await authMiddleware(req);
        return controller.create(authenticatedReq);
      },
    },
    "/api/trades/:id": {
      GET: withAuthAndParams((req) => controller.getById(req), "/api/trades/:id"),
      PUT: withAuthAndParams((req) => controller.update(req), "/api/trades/:id"),
      DELETE: withAuthAndParams((req) => controller.delete(req), "/api/trades/:id"),
    },
  };
}

