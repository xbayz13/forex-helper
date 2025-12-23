/**
 * ChangePasswordCommandHandler
 * Handler for ChangePasswordCommand
 */

import { ChangePasswordCommand } from "./ChangePasswordCommand";
import { UserId, Email, Password } from "@/domain";
import { IUserRepository } from "@/domain/user/repositories/IUserRepository";
import { AuthenticationService } from "@/domain/user/services/AuthenticationService";

export class ChangePasswordCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authenticationService: AuthenticationService
  ) {}

  async handle(command: ChangePasswordCommand): Promise<void> {
    const userId = UserId.create(command.userId);

    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isValid = await this.authenticationService.verifyCredentials(user, {
      email: user.email,
      password: command.currentPassword,
    });

    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    // Validate new password
    Password.fromPlainText(command.newPassword);

    // Hash new password
    const newHashedPassword = await this.authenticationService.hashPassword(
      command.newPassword
    );

    // Update password
    user.changePassword(newHashedPassword);

    // Save user
    await this.userRepository.save(user);
  }
}

