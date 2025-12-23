/**
 * UpdateUserProfileCommandHandler
 * Handler for UpdateUserProfileCommand
 */

import { UpdateUserProfileCommand } from "./UpdateUserProfileCommand";
import { UserProfileDTO } from "../dtos/UserProfileDTO";
import { UserId } from "@/domain";
import { IUserProfileRepository } from "@/domain/user/repositories/IUserProfileRepository";
import { UserProfile } from "@/domain/user/entities/UserProfile";

export class UpdateUserProfileCommandHandler {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository
  ) {}

  async handle(command: UpdateUserProfileCommand): Promise<UserProfileDTO> {
    const userId = UserId.create(command.userId);

    // Find or create profile
    let profile = await this.userProfileRepository.findByUserId(userId);

    if (!profile) {
      // Create new profile
      profile = UserProfile.create(userId);
    }

    // Update profile
    profile.update(
      command.firstName ?? undefined,
      command.lastName ?? undefined,
      command.displayName ?? undefined,
      command.avatar ?? undefined
    );

    // Save profile
    await this.userProfileRepository.save(profile);

    // Convert to DTO
    return this.toDTO(profile);
  }

  private toDTO(profile: UserProfile): UserProfileDTO {
    return {
      userId: profile.userId.value,
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      avatar: profile.avatar,
      fullName: profile.getFullName(),
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}

