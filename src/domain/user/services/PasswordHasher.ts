/**
 * PasswordHasher Interface
 * Defines contract for password hashing (implemented in infrastructure layer)
 */
export interface PasswordHasher {
  /**
   * Hash a plain text password
   */
  hash(plainText: string): Promise<string>;

  /**
   * Verify a plain text password against a hash
   */
  verify(plainText: string, hash: string): Promise<boolean>;
}

