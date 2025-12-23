/**
 * Unit tests for Email Value Object
 */

import { describe, test, expect } from "bun:test";
import { Email } from "./Email";

describe("Email", () => {
  describe("create", () => {
    test("should create a valid email", () => {
      const email = Email.create("test@example.com");
      expect(email.value).toBe("test@example.com");
    });

    test("should create email with valid format", () => {
      const email = Email.create("user.name@domain.co.uk");
      expect(email.value).toBe("user.name@domain.co.uk");
    });

    test("should throw error for invalid email (no @)", () => {
      expect(() => Email.create("invalid-email")).toThrow(
        "Invalid email format"
      );
    });

    test("should throw error for invalid email (no domain)", () => {
      expect(() => Email.create("test@")).toThrow("Invalid email format");
    });

    test("should throw error for invalid email (no local part)", () => {
      expect(() => Email.create("@example.com")).toThrow("Invalid email format");
    });

    test("should throw error for invalid email (multiple @)", () => {
      expect(() => Email.create("test@@example.com")).toThrow(
        "Invalid email format"
      );
    });

    test("should throw error for empty string", () => {
      expect(() => Email.create("")).toThrow("Email cannot be empty");
    });

    test("should handle email with plus sign", () => {
      const email = Email.create("test+tag@example.com");
      expect(email.value).toBe("test+tag@example.com");
    });

    test("should handle email with numbers", () => {
      const email = Email.create("user123@example123.com");
      expect(email.value).toBe("user123@example123.com");
    });
  });

  describe("value", () => {
    test("should return the email value", () => {
      const email = Email.create("test@example.com");
      expect(email.value).toBe("test@example.com");
    });
  });

  describe("equals", () => {
    test("should return true for equal emails", () => {
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("test@example.com");
      expect(email1.equals(email2)).toBe(true);
    });

    test("should return false for different emails", () => {
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("other@example.com");
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return the email string", () => {
      const email = Email.create("test@example.com");
      expect(email.toString()).toBe("test@example.com");
    });
  });
});

