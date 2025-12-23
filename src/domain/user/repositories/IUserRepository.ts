/**
 * UserRepository Interface
 * Repository interface for storing and retrieving users
 */

import { User } from "../entities/User";
import { UserId } from "../value-objects/UserId";
import { Email } from "../value-objects/Email";

export interface IUserRepository {
  /**
   * Save a user (create or update)
   */
  save(user: User): Promise<void>;

  /**
   * Find user by ID
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Check if email exists
   */
  existsByEmail(email: Email): Promise<boolean>;

  /**
   * Delete a user
   */
  delete(id: UserId): Promise<void>;
}

