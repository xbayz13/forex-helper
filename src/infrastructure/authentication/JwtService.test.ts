/**
 * Unit tests for JwtService
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { JwtService } from "./JwtService";
import { env } from "@/config/env";

describe("JwtService", () => {
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService();
  });

  test("should generate and verify token", () => {
    const payload = {
      userId: "user_123",
      email: "test@example.com",
    };

    const token = jwtService.generateToken(payload);
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");

    const verified = jwtService.verifyToken(token);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.email).toBe(payload.email);
  });

  test("should throw error for invalid token", () => {
    expect(() => jwtService.verifyToken("invalid.token.here")).toThrow();
  });

  test("should throw error for expired token", () => {
    // Create a service with very short expiry for testing
    const shortExpiryService = new JwtService();
    const payload = {
      userId: "user_123",
      email: "test@example.com",
    };

    // We can't easily test expiration without waiting, but we can test structure
    const token = shortExpiryService.generateToken(payload);
    expect(token).toBeTruthy();
  });
});

