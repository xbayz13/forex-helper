/**
 * UpdateUserProfileCommand
 * Command for updating user profile
 */
export interface UpdateUserProfileCommand {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  avatar?: string | null;
}

