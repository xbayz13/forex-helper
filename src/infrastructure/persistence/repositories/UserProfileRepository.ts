/**
 * UserProfileRepository Implementation
 * Prisma implementation of IUserProfileRepository
 */

import { IUserProfileRepository } from "@/domain/user/repositories/IUserProfileRepository";
import { UserProfile } from "@/domain/user/entities/UserProfile";
import { UserId } from "@/domain/user/value-objects/UserId";
import { prisma } from "../database/prisma";

export class UserProfileRepository implements IUserProfileRepository {
  async save(profile: UserProfile): Promise<void> {
    await prisma.userProfile.upsert({
      where: { userId: profile.userId.value },
      create: {
        userId: profile.userId.value,
        firstName: profile.firstName,
        lastName: profile.lastName,
        displayName: profile.displayName,
        avatar: profile.avatar,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
      update: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        displayName: profile.displayName,
        avatar: profile.avatar,
        updatedAt: profile.updatedAt,
      },
    });
  }

  async findByUserId(userId: UserId): Promise<UserProfile | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: userId.value },
    });

    if (!profile) {
      return null;
    }

    return this.toEntity(profile);
  }

  async delete(userId: UserId): Promise<void> {
    await prisma.userProfile.delete({
      where: { userId: userId.value },
    });
  }

  private toEntity(profile: {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserProfile {
    const userId = UserId.create(profile.userId);

    return UserProfile.reconstitute(
      userId,
      profile.firstName,
      profile.lastName,
      profile.displayName,
      profile.avatar,
      profile.createdAt,
      profile.updatedAt
    );
  }
}
