import { describe, it, expect } from "vitest";
import { Email } from "../../../../src/domain/value-objects";

describe("Email", () => {
  it("creates a valid email", () => {
    const email = Email.create("test@example.com");
    expect(email.value).toBe("test@example.com");
  });

  it("normalizes to lowercase", () => {
    const email = Email.create("TEST@Example.COM");
    expect(email.value).toBe("test@example.com");
  });

  it("trims whitespace", () => {
    const email = Email.create("  test@example.com  ");
    expect(email.value).toBe("test@example.com");
  });

  it("throws on empty string", () => {
    expect(() => Email.create("")).toThrow("Email cannot be empty");
  });

  it("throws on invalid format", () => {
    expect(() => Email.create("not-an-email")).toThrow("Invalid email format");
    expect(() => Email.create("@domain.com")).toThrow("Invalid email format");
    expect(() => Email.create("user@")).toThrow("Invalid email format");
  });

  it("compares equality", () => {
    const a = Email.create("test@example.com");
    const b = Email.create("test@example.com");
    expect(a.equals(b)).toBe(true);
  });

  it("detects inequality", () => {
    const a = Email.create("a@example.com");
    const b = Email.create("b@example.com");
    expect(a.equals(b)).toBe(false);
  });

  it("converts to string", () => {
    const email = Email.create("test@example.com");
    expect(email.toString()).toBe("test@example.com");
  });
});
