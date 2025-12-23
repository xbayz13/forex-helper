/**
 * RegisterUserCommandHandler
 * Handler for RegisterUserCommand
 */

import { RegisterUserCommand } from "./RegisterUserCommand";
import { UserDTO } from "../dtos/UserDTO";
import { UserId, Email, Password } from "@/domain";
import { User } from "@/domain/user/entities/User";
import { IUserRepository } from "@/domain/user/repositories/IUserRepository";
import { AuthenticationService } from "@/domain/user/services/AuthenticationService";

export class RegisterUserCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authenticationService: AuthenticationService
  ) {}

  async handle(command: RegisterUserCommand): Promise<UserDTO> {
    // Create value objects
    const email = Email.create(command.email);

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Validate password (using Password.fromPlainText)
    Password.fromPlainText(command.password);

    // Hash password
    const hashedPassword = await this.authenticationService.hashPassword(
      command.password
    );

    // Create user
    const userId = UserId.generate();
    const user = User.create(userId, email, hashedPassword);

    // Save user
    await this.userRepository.save(user);

    // Convert to DTO
    return this.toDTO(user);
  }

  private toDTO(user: User): UserDTO {
    return {
      id: user.id.value,
      email: user.email.value,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

