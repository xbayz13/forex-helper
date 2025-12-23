/**
 * UserProfileDTO
 * Data Transfer Object for user profile
 */
export interface UserProfileDTO {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatar: string | null;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

