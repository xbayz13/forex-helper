/**
 * Unit tests for RegisterUserCommandHandler
 */

import { describe, test, expect, beforeEach, mock } from "bun:test";
import { RegisterUserCommandHandler } from "./RegisterUserCommandHandler";
import { RegisterUserCommand } from "./RegisterUserCommand";
import { IUserRepository } from "@/domain/user/repositories/IUserRepository";
import { AuthenticationService } from "@/domain/user/services/AuthenticationService";
import { User } from "@/domain/user/entities/User";
import { UserId } from "@/domain/user/value-objects/UserId";
import { Email } from "@/domain/user/value-objects/Email";
import { Password } from "@/domain/user/value-objects/Password";

describe("RegisterUserCommandHandler", () => {
  let handler: RegisterUserCommandHandler;
  let mockUserRepository: IUserRepository;
  let mockAuthenticationService: AuthenticationService;

  beforeEach(() => {
    mockUserRepository = {
      save: mock(async () => {}),
      findById: mock(),
      findByEmail: mock(async () => null),
      existsByEmail: mock(),
      delete: mock(),
    };

    mockAuthenticationService = {
      hashPassword: mock(async (plainText: string) => {
        return Password.fromHash(`$2b$10$${plainText}hashed`);
      }),
      verifyPassword: mock(),
      authenticate: mock(),
    } as any;

    handler = new RegisterUserCommandHandler(
      mockUserRepository,
      mockAuthenticationService
    );
  });

  test("should register a new user", async () => {
    const command: RegisterUserCommand = {
      email: "test@example.com",
      password: "ValidPass123",
    };

    const result = await handler.handle(command);

    expect(result.id).toBeTruthy();
    expect(result.email).toBe("test@example.com");
    expect(mockUserRepository.findByEmail).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockAuthenticationService.hashPassword).toHaveBeenCalledWith("ValidPass123");
  });

  test("should throw error if email already exists", async () => {
    const existingUser = User.create(
      UserId.create("user_123"),
      Email.create("existing@example.com"),
      Password.fromHash("$2b$10$hash")
    );

    (mockUserRepository.findByEmail as any).mockResolvedValueOnce(existingUser);

    const command: RegisterUserCommand = {
      email: "existing@example.com",
      password: "ValidPass123",
    };

    await expect(handler.handle(command)).rejects.toThrow("Email already registered");
  });

  test("should throw error for invalid password", async () => {
    const command: RegisterUserCommand = {
      email: "test@example.com",
      password: "short", // Too short
    };

    await expect(handler.handle(command)).rejects.toThrow();
  });
});

