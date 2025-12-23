/**
 * User Entity
 * Represents a user account with identity
 */

import { UserId, Email, Password } from "../value-objects";

export class User {
  private readonly _id: UserId;
  private readonly _email: Email;
  private _password: Password;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: UserId,
    email: Email,
    password: Password,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Create a new User
   */
  static create(id: UserId, email: Email, password: Password): User {
    const now = new Date();
    return new User(id, email, password, now, now);
  }

  /**
   * Reconstruct User from persistence (for repositories)
   */
  static reconstitute(
    id: UserId,
    email: Email,
    password: Password,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(id, email, password, createdAt, updatedAt);
  }

  /**
   * Change user password
   */
  changePassword(newPassword: Password): void {
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  // Getters
  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get password(): Password {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Equality comparison (by ID)
   */
  equals(other: User): boolean {
    return this._id.equals(other._id);
  }
}

