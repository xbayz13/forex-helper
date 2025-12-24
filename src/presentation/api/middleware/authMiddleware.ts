/**
 * Authentication Middleware
 * Validates JWT token and extracts user information
 */

import { JwtService } from "@/infrastructure/authentication/JwtService";
import { AppError } from "./errorHandler";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function createAuthMiddleware(jwtService: JwtService) {
  return async (request: Request): Promise<AuthenticatedRequest> => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "Unauthorized: Missing or invalid authorization header", "UNAUTHORIZED");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    try {
      const payload = jwtService.verifyToken(token);
      
      // Attach user info to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = {
        userId: payload.userId,
        email: payload.email,
      };

      return authenticatedRequest;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(401, `Unauthorized: ${error.message}`, "UNAUTHORIZED");
      }
      throw new AppError(401, "Unauthorized: Invalid token", "UNAUTHORIZED");
    }
  };
}

