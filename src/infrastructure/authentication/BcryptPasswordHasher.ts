/**
 * BcryptPasswordHasher Implementation
 * Implements PasswordHasher using bcrypt
 */

import { PasswordHasher } from "@/domain/user/services/PasswordHasher";
import bcrypt from "bcryptjs";

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.saltRounds);
  }

  async verify(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}

