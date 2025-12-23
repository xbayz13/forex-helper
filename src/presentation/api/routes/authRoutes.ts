/**
 * Auth Routes
 * Routes for authentication endpoints
 */

import { AuthController } from "../controllers/AuthController";
import { createAuthMiddleware } from "../middleware/authMiddleware";
import { JwtService } from "@/infrastructure/authentication/JwtService";

export function createAuthRoutes(authController: AuthController, jwtService: JwtService) {
  const authMiddleware = createAuthMiddleware(jwtService);

  return {
    "/api/auth/register": {
      POST: authController.register,
    },
    "/api/auth/login": {
      POST: authController.login,
    },
    "/api/auth/me": {
      GET: async (req: Request) => {
        const authenticatedReq = await authMiddleware(req);
        return authController.getMe(authenticatedReq);
      },
    },
    "/api/auth/profile": {
      PUT: async (req: Request) => {
        const authenticatedReq = await authMiddleware(req);
        return authController.updateProfile(authenticatedReq);
      },
    },
    "/api/auth/change-password": {
      POST: async (req: Request) => {
        const authenticatedReq = await authMiddleware(req);
        return authController.changePassword(authenticatedReq);
      },
    },
  };
}

