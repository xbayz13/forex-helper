/**
 * AccountBalance Value Object
 * Represents the account balance in a specific currency (immutable)
 */
export class AccountBalance {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency: string) {
    if (amount < 0) {
      throw new Error("Account balance cannot be negative");
    }
    if (!currency || currency.length !== 3) {
      throw new Error("Currency must be a 3-letter code (e.g., USD, EUR)");
    }
    this._amount = amount;
    this._currency = currency.toUpperCase();
  }

  /**
   * Create an AccountBalance
   */
  static create(amount: number, currency: string): AccountBalance {
    return new AccountBalance(amount, currency);
  }

  /**
   * Get the amount
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Get the currency code
   */
  get currency(): string {
    return this._currency;
  }

  /**
   * Equality comparison
   */
  equals(other: AccountBalance): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}

