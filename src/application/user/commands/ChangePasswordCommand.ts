/**
 * ChangePasswordCommand
 * Command for changing user password
 */
export interface ChangePasswordCommand {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

