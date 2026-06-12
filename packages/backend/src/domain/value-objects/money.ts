export class Money {
  private constructor(private readonly _amount: number) {}

  static create(amount: number): Money {
    if (!Number.isFinite(amount)) {
      throw new Error("Amount must be a finite number");
    }
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
    return new Money(Math.round(amount * 100) / 100);
  }

  static zero(): Money {
    return new Money(0);
  }

  get amount(): number {
    return this._amount;
  }

  add(other: Money): Money {
    return new Money(Math.round((this._amount + other._amount) * 100) / 100);
  }

  subtract(other: Money): Money {
    const result = Math.round((this._amount - other._amount) * 100) / 100;
    if (result < 0) {
      throw new Error("Result cannot be negative");
    }
    return new Money(result);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount;
  }

  toString(): string {
    return this._amount.toFixed(2);
  }
}
