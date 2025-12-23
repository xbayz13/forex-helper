/**
 * UserProfileRepository Interface
 * Repository interface for storing and retrieving user profiles
 */

import { UserProfile } from "../entities/UserProfile";
import { UserId } from "../value-objects/UserId";

export interface IUserProfileRepository {
  /**
   * Save a user profile (create or update)
   */
  save(profile: UserProfile): Promise<void>;

  /**
   * Find profile by user ID
   */
  findByUserId(userId: UserId): Promise<UserProfile | null>;

  /**
   * Delete a user profile
   */
  delete(userId: UserId): Promise<void>;
}

