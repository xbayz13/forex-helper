/**
 * Password Value Object
 * Represents a hashed password (immutable)
 * Note: This represents the hashed password, not the plain text
 */
export class Password {
  private readonly _hash: string;

  private constructor(hash: string) {
    if (!hash || hash.trim().length === 0) {
      throw new Error("Password hash cannot be empty");
    }
    this._hash = hash;
  }

  /**
   * Create a Password from hash (for existing passwords)
   */
  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  /**
   * Create a Password from plain text (will need to be hashed by infrastructure)
   * This is a factory method that returns the plain text for hashing
   */
  static fromPlainText(plainText: string): { plainText: string; validate: () => void } {
    // Validate password requirements
    const validation = Password.validatePassword(plainText);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    return {
      plainText,
      validate: () => {
        // Validation already done
      },
    };
  }

  /**
   * Validate password requirements
   */
  static validatePassword(plainText: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (plainText.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (plainText.length > 128) {
      errors.push("Password must be less than 128 characters");
    }

    if (!/[a-z]/.test(plainText)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(plainText)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(plainText)) {
      errors.push("Password must contain at least one number");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get the password hash
   */
  get hash(): string {
    return this._hash;
  }

  /**
   * Check if this password hash matches another
   */
  equals(other: Password): boolean {
    return this._hash === other._hash;
  }

  /**
   * String representation (never show the actual hash in logs)
   */
  toString(): string {
    return "[Password Hash]";
  }
}

