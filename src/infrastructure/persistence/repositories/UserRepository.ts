/**
 * UserRepository Implementation
 * Prisma implementation of IUserRepository
 */

import { IUserRepository } from "@/domain/user/repositories/IUserRepository";
import { User } from "@/domain/user/entities/User";
import { UserId, Email, Password } from "@/domain/user/value-objects";
import { prisma } from "../database/prisma";

export class UserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      where: { id: user.id.value },
      create: {
        id: user.id.value,
        email: user.email.value,
        passwordHash: user.password.hash,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      update: {
        email: user.email.value,
        passwordHash: user.password.hash,
        updatedAt: user.updatedAt,
      },
    });
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: id.value },
    });

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.value },
    });

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email: email.value },
    });

    return count > 0;
  }

  async delete(id: UserId): Promise<void> {
    await prisma.user.delete({
      where: { id: id.value },
    });
  }

  private toEntity(user: {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    const userId = UserId.create(user.id);
    const email = Email.create(user.email);
    const password = Password.fromHash(user.passwordHash);

    return User.reconstitute(
      userId,
      email,
      password,
      user.createdAt,
      user.updatedAt
    );
  }
}
