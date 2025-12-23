/**
 * Unit tests for UserId Value Object
 */

import { describe, test, expect } from "bun:test";
import { UserId } from "./UserId";

describe("UserId", () => {
  describe("create", () => {
    test("should create a valid user ID", () => {
      const userId = UserId.create("user_123");
      expect(userId.value).toBe("user_123");
    });

    test("should trim whitespace", () => {
      const userId = UserId.create("  user_123  ");
      expect(userId.value).toBe("user_123");
    });

    test("should throw error for empty string", () => {
      expect(() => UserId.create("")).toThrow("User ID cannot be empty");
    });

    test("should throw error for whitespace-only string", () => {
      expect(() => UserId.create("   ")).toThrow("User ID cannot be empty");
    });
  });

  describe("generate", () => {
    test("should generate a unique user ID", () => {
      const userId1 = UserId.generate();
      const userId2 = UserId.generate();
      
      expect(userId1.value).toBeTruthy();
      expect(userId2.value).toBeTruthy();
      expect(userId1.value).not.toBe(userId2.value);
      expect(userId1.value).toMatch(/^user_\d+_[a-z0-9]+$/);
    });
  });

  describe("value", () => {
    test("should return the ID value", () => {
      const userId = UserId.create("user_123");
      expect(userId.value).toBe("user_123");
    });
  });

  describe("equals", () => {
    test("should return true for equal IDs", () => {
      const userId1 = UserId.create("user_123");
      const userId2 = UserId.create("user_123");
      expect(userId1.equals(userId2)).toBe(true);
    });

    test("should return false for different IDs", () => {
      const userId1 = UserId.create("user_123");
      const userId2 = UserId.create("user_456");
      expect(userId1.equals(userId2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return the ID string", () => {
      const userId = UserId.create("user_123");
      expect(userId.toString()).toBe("user_123");
    });
  });
});

