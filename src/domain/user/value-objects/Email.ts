/**
 * Email Value Object
 * Represents an email address (immutable)
 */
export class Email {
  private readonly _value: string;

  private static readonly EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    
    if (!normalized || normalized.length === 0) {
      throw new Error("Email cannot be empty");
    }

    if (!Email.EMAIL_REGEX.test(normalized)) {
      throw new Error(`Invalid email format: ${value}`);
    }

    if (normalized.length > 255) {
      throw new Error("Email address is too long (max 255 characters)");
    }

    this._value = normalized;
  }

  /**
   * Create an Email
   */
  static create(value: string): Email {
    return new Email(value);
  }

  /**
   * Get the email value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Get the domain part of the email
   */
  getDomain(): string {
    return this._value.split("@")[1] || "";
  }

  /**
   * Get the local part of the email (before @)
   */
  getLocalPart(): string {
    return this._value.split("@")[0] || "";
  }

  /**
   * Equality comparison
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}

