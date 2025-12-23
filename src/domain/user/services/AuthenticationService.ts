/**
 * AuthenticationService Domain Service
 * Handles user authentication logic
 */

import { User } from "../entities/User";
import { Email, Password } from "../value-objects";
import { PasswordHasher } from "./PasswordHasher";

export interface Credentials {
  email: Email;
  password: string; // Plain text password
}

export class AuthenticationService {
  private readonly passwordHasher: PasswordHasher;

  constructor(passwordHasher: PasswordHasher) {
    this.passwordHasher = passwordHasher;
  }

  /**
   * Verify user credentials
   */
  async verifyCredentials(user: User, credentials: Credentials): Promise<boolean> {
    // Check email matches
    if (!user.email.equals(credentials.email)) {
      return false;
    }

    // Verify password
    const isValid = await this.passwordHasher.verify(
      credentials.password,
      user.password.hash
    );

    return isValid;
  }

  /**
   * Hash a plain text password
   */
  async hashPassword(plainTextPassword: string): Promise<Password> {
    const hash = await this.passwordHasher.hash(plainTextPassword);
    return Password.fromHash(hash);
  }
}

