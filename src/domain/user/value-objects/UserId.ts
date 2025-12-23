/**
 * UserId Value Object
 * Unique identifier for a user (immutable)
 */
export class UserId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("User ID cannot be empty");
    }
    this._value = value.trim();
  }

  /**
   * Create a UserId from string
   */
  static create(value: string): UserId {
    return new UserId(value);
  }

  /**
   * Generate a new UserId
   */
  static generate(): UserId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return new UserId(`user_${timestamp}_${random}`);
  }

  /**
   * Get the ID value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Equality comparison
   */
  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}

