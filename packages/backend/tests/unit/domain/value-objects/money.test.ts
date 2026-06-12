import { describe, it, expect } from "vitest";
import { Money } from "../../../../src/domain/value-objects";

describe("Money", () => {
  it("creates a valid amount", () => {
    const money = Money.create(100);
    expect(money.amount).toBe(100);
  });

  it("creates zero money", () => {
    const money = Money.zero();
    expect(money.amount).toBe(0);
  });

  it("throws on negative amount", () => {
    expect(() => Money.create(-10)).toThrow("Amount cannot be negative");
  });

  it("throws on non-finite amount", () => {
    expect(() => Money.create(NaN)).toThrow("Amount must be a finite number");
    expect(() => Money.create(Infinity)).toThrow("Amount must be a finite number");
  });

  it("rounds to two decimals", () => {
    expect(Money.create(10.456).amount).toBe(10.46);
    expect(Money.create(10.454).amount).toBe(10.45);
    expect(Money.create(10.1).amount).toBe(10.1);
  });

  it("adds two amounts", () => {
    const a = Money.create(100.5);
    const b = Money.create(200.75);
    const result = a.add(b);
    expect(result.amount).toBe(301.25);
  });

  it("subtracts two amounts", () => {
    const a = Money.create(300);
    const b = Money.create(100);
    const result = a.subtract(b);
    expect(result.amount).toBe(200);
  });

  it("throws on negative subtraction result", () => {
    const a = Money.create(100);
    const b = Money.create(200);
    expect(() => a.subtract(b)).toThrow("Result cannot be negative");
  });

  it("converts to string with two decimals", () => {
    expect(Money.create(150.5).toString()).toBe("150.50");
    expect(Money.create(0).toString()).toBe("0.00");
    expect(Money.create(100).toString()).toBe("100.00");
  });

  it("compares equality", () => {
    expect(Money.create(100).equals(Money.create(100))).toBe(true);
    expect(Money.create(100).equals(Money.create(200))).toBe(false);
  });
});
