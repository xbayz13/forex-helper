/**
 * Unit tests for BcryptPasswordHasher
 */

import { describe, test, expect } from "bun:test";
import { BcryptPasswordHasher } from "./BcryptPasswordHasher";

describe("BcryptPasswordHasher", () => {
  const hasher = new BcryptPasswordHasher();

  test("should hash password", async () => {
    const password = "TestPassword123";
    const hash = await hasher.hash(password);

    expect(hash).toBeTruthy();
    expect(typeof hash).toBe("string");
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  test("should verify correct password", async () => {
    const password = "TestPassword123";
    const hash = await hasher.hash(password);

    const isValid = await hasher.verify(password, hash);
    expect(isValid).toBe(true);
  });

  test("should reject incorrect password", async () => {
    const password = "TestPassword123";
    const hash = await hasher.hash(password);

    const isValid = await hasher.verify("WrongPassword", hash);
    expect(isValid).toBe(false);
  });

  test("should produce different hashes for same password", async () => {
    const password = "TestPassword123";
    const hash1 = await hasher.hash(password);
    const hash2 = await hasher.hash(password);

    // Bcrypt includes salt, so same password should produce different hashes
    expect(hash1).not.toBe(hash2);

    // But both should verify correctly
    expect(await hasher.verify(password, hash1)).toBe(true);
    expect(await hasher.verify(password, hash2)).toBe(true);
  });
});

