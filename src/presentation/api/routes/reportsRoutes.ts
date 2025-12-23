/**
 * Reports Routes
 * Routes for reports endpoints
 */

import { ReportsController } from "../controllers/ReportsController";
import { createAuthMiddleware } from "../middleware/authMiddleware";
import { JwtService } from "@/infrastructure/authentication/JwtService";

export function createReportsRoutes(
  controller: ReportsController,
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

  const withAuth = async (req: Request, handler: (req: Request) => Promise<Response>) => {
    const authenticatedReq = await authMiddleware(req);
    return handler(authenticatedReq);
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
    "/api/reports/metrics": {
      GET: (req: Request) => withAuth(req, (r) => controller.getMetrics(r)),
    },
    "/api/reports/generate": {
      POST: (req: Request) => withAuth(req, (r) => controller.generateReport(r)),
    },
    "/api/reports/:id": {
      GET: withAuthAndParams((req) => controller.getReport(req), "/api/reports/:id"),
    },
  };
}

