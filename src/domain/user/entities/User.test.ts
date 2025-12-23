/**
 * Unit tests for User Entity
 */

import { describe, test, expect } from "bun:test";
import { User } from "./User";
import { UserId } from "../value-objects/UserId";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

describe("User", () => {
  const userId = UserId.create("user_123");
  const email = Email.create("test@example.com");
  const password = Password.fromHash("$2b$10$hashedpassword");

  test("should create a new user", () => {
    const user = User.create(userId, email, password);

    expect(user.id).toBe(userId);
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  test("should set createdAt and updatedAt to same time on creation", () => {
    const user = User.create(userId, email, password);

    expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime());
  });

  test("should reconstitute user from persistence", () => {
    const createdAt = new Date("2024-01-01");
    const updatedAt = new Date("2024-01-02");
    const user = User.reconstitute(userId, email, password, createdAt, updatedAt);

    expect(user.id).toBe(userId);
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
  });

  test("should change password", () => {
    const user = User.create(userId, email, password);
    const newPassword = Password.fromHash("$2b$10$newhashedpassword");
    const oldUpdatedAt = user.updatedAt;

    // Wait a bit to ensure timestamp difference
    Bun.sleepSync(10);

    user.changePassword(newPassword);

    expect(user.password).toBe(newPassword);
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  test("should compare users by ID", () => {
    const user1 = User.create(userId, email, password);
    const user2 = User.create(userId, email, password);
    const user3 = User.create(UserId.create("user_456"), email, password);

    expect(user1.equals(user2)).toBe(true);
    expect(user1.equals(user3)).toBe(false);
  });
});

