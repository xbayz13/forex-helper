/**
 * Unit tests for Password Value Object
 */

import { describe, test, expect } from "bun:test";
import { Password } from "./Password";

describe("Password", () => {
  describe("fromHash", () => {
    test("should create password from hash", () => {
      const hash = "$2b$10$abcdefghijklmnopqrstuv";
      const password = Password.fromHash(hash);
      expect(password.hash).toBe(hash);
    });

    test("should throw error for empty hash", () => {
      expect(() => Password.fromHash("")).toThrow(
        "Password hash cannot be empty"
      );
    });

    test("should throw error for whitespace-only hash", () => {
      expect(() => Password.fromHash("   ")).toThrow(
        "Password hash cannot be empty"
      );
    });
  });

  describe("fromPlainText", () => {
    test("should create password from valid plain text", () => {
      const result = Password.fromPlainText("ValidPass123");
      expect(result.plainText).toBe("ValidPass123");
    });

    test("should throw error for password too short", () => {
      expect(() => Password.fromPlainText("Short1")).toThrow(
        "Password must be at least 8 characters long"
      );
    });

    test("should throw error for password without lowercase", () => {
      expect(() => Password.fromPlainText("NOLOWERCASE123")).toThrow(
        "Password must contain at least one lowercase letter"
      );
    });

    test("should throw error for password without uppercase", () => {
      expect(() => Password.fromPlainText("nouppercase123")).toThrow(
        "Password must contain at least one uppercase letter"
      );
    });

    test("should throw error for password without number", () => {
      expect(() => Password.fromPlainText("NoNumbers")).toThrow(
        "Password must contain at least one number"
      );
    });

    test("should throw error for password too long", () => {
      const longPassword = "A".repeat(129) + "1a";
      expect(() => Password.fromPlainText(longPassword)).toThrow(
        "Password must be less than 128 characters"
      );
    });
  });

  describe("validatePassword", () => {
    test("should return valid for correct password", () => {
      const result = Password.validatePassword("ValidPass123");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should return errors for invalid passwords", () => {
      const result1 = Password.validatePassword("short");
      expect(result1.isValid).toBe(false);
      expect(result1.errors.length).toBeGreaterThan(0);

      const result2 = Password.validatePassword("NOLOWERCASE123");
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain("Password must contain at least one lowercase letter");
    });
  });

  describe("hash", () => {
    test("should return the hash", () => {
      const hash = "$2b$10$abcdefghijklmnopqrstuv";
      const password = Password.fromHash(hash);
      expect(password.hash).toBe(hash);
    });
  });

  describe("equals", () => {
    test("should return true for equal hashes", () => {
      const hash = "$2b$10$abcdefghijklmnopqrstuv";
      const password1 = Password.fromHash(hash);
      const password2 = Password.fromHash(hash);
      expect(password1.equals(password2)).toBe(true);
    });

    test("should return false for different hashes", () => {
      const password1 = Password.fromHash("$2b$10$abcdefghijklmnopqrstuv");
      const password2 = Password.fromHash("$2b$10$xyzabcdefghijklmnopqr");
      expect(password1.equals(password2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return masked string", () => {
      const password = Password.fromHash("$2b$10$abcdefghijklmnopqrstuv");
      expect(password.toString()).toBe("[Password Hash]");
    });
  });
});

