/**
 * UserProfile Entity
 * Represents user profile information
 */

import { UserId } from "../value-objects/UserId";

export class UserProfile {
  private readonly _userId: UserId;
  private _firstName: string | null;
  private _lastName: string | null;
  private _displayName: string | null;
  private _avatar: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    userId: UserId,
    firstName: string | null,
    lastName: string | null,
    displayName: string | null,
    avatar: string | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._userId = userId;
    this._firstName = firstName;
    this._lastName = lastName;
    this._displayName = displayName;
    this._avatar = avatar;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Create a new UserProfile
   */
  static create(userId: UserId): UserProfile {
    const now = new Date();
    return new UserProfile(userId, null, null, null, null, now, now);
  }

  /**
   * Reconstruct UserProfile from persistence
   */
  static reconstitute(
    userId: UserId,
    firstName: string | null,
    lastName: string | null,
    displayName: string | null,
    avatar: string | null,
    createdAt: Date,
    updatedAt: Date
  ): UserProfile {
    return new UserProfile(
      userId,
      firstName,
      lastName,
      displayName,
      avatar,
      createdAt,
      updatedAt
    );
  }

  /**
   * Update profile information
   */
  update(
    firstName: string | null = null,
    lastName: string | null = null,
    displayName: string | null = null,
    avatar: string | null = null
  ): void {
    this._firstName = firstName ?? this._firstName;
    this._lastName = lastName ?? this._lastName;
    this._displayName = displayName ?? this._displayName;
    this._avatar = avatar ?? this._avatar;
    this._updatedAt = new Date();
  }

  /**
   * Get full name
   */
  getFullName(): string {
    if (this._firstName && this._lastName) {
      return `${this._firstName} ${this._lastName}`;
    }
    return this._displayName || "";
  }

  // Getters
  get userId(): UserId {
    return this._userId;
  }

  get firstName(): string | null {
    return this._firstName;
  }

  get lastName(): string | null {
    return this._lastName;
  }

  get displayName(): string | null {
    return this._displayName;
  }

  get avatar(): string | null {
    return this._avatar;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Equality comparison (by userId)
   */
  equals(other: UserProfile): boolean {
    return this._userId.equals(other._userId);
  }
}

