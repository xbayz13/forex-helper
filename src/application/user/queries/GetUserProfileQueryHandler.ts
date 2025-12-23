/**
 * GetUserProfileQueryHandler
 * Handler for GetUserProfileQuery
 */

import { GetUserProfileQuery } from "./GetUserProfileQuery";
import { UserProfileDTO } from "../dtos/UserProfileDTO";
import { UserId } from "@/domain";
import { IUserProfileRepository } from "@/domain/user/repositories/IUserProfileRepository";
import { UserProfile } from "@/domain/user/entities/UserProfile";

export class GetUserProfileQueryHandler {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository
  ) {}

  async handle(query: GetUserProfileQuery): Promise<UserProfileDTO | null> {
    const userId = UserId.create(query.userId);

    const profile = await this.userProfileRepository.findByUserId(userId);

    if (!profile) {
      return null;
    }

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

