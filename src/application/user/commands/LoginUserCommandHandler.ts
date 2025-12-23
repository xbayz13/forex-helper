/**
 * LoginUserCommandHandler
 * Handler for LoginUserCommand
 */

import { LoginUserCommand } from "./LoginUserCommand";
import { UserDTO } from "../dtos/UserDTO";
import { Email } from "@/domain";
import { IUserRepository } from "@/domain/user/repositories/IUserRepository";
import { AuthenticationService } from "@/domain/user/services/AuthenticationService";

export class LoginUserCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authenticationService: AuthenticationService
  ) {}

  async handle(command: LoginUserCommand): Promise<UserDTO> {
    // Create email value object
    const email = Email.create(command.email);

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify credentials
    const isValid = await this.authenticationService.verifyCredentials(user, {
      email,
      password: command.password,
    });

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Convert to DTO
    return this.toDTO(user);
  }

  private toDTO(user: import("@/domain/user/entities/User").User): UserDTO {
    return {
      id: user.id.value,
      email: user.email.value,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

