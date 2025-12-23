/**
 * JwtService
 * Service for JWT token generation and verification
 */

import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export interface TokenPayload {
  userId: string;
  email: string;
}

export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(secret?: string, expiresIn: string = "7d") {
    this.secret = secret || env.JWT_SECRET || "your-secret-key-change-in-production";
    this.expiresIn = expiresIn;
  }

  /**
   * Generate JWT token
   */
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expired");
      }
      throw new Error("Token verification failed");
    }
  }

  /**
   * Decode token without verification (for inspection only)
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}

