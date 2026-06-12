import { describe, it, expect } from "vitest";
import { User } from "../../../../src/domain/entities";
import { Email } from "../../../../src/domain/value-objects";

describe("User", () => {
  it("creates a user with valid data", () => {
    const email = Email.create("test@example.com");
    const user = User.create("John Doe", email, "hashed-password");

    expect(user.name).toBe("John Doe");
    expect(user.email.value).toBe("test@example.com");
    expect(user.passwordHash).toBe("hashed-password");
    expect(user.id.value).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it("trims name on create", () => {
    const email = Email.create("test@example.com");
    const user = User.create("  John Doe  ", email, "hash");
    expect(user.name).toBe("John Doe");
  });

  it("reconstructs from props", () => {
    const email = Email.create("test@example.com");
    const original = User.create("John Doe", email, "hash");
    const restored = User.from({
      id: original.id,
      name: original.name,
      email: original.email,
      passwordHash: original.passwordHash,
      createdAt: original.createdAt,
      updatedAt: original.updatedAt,
    });

    expect(restored.equals(original)).toBe(true);
  });

  it("updates profile name", () => {
    const email = Email.create("test@example.com");
    const user = User.create("John", email, "hash");
    user.updateProfile("Jane");
    expect(user.name).toBe("Jane");
  });

  it("compares equality by id", () => {
    const email = Email.create("a@example.com");
    const a = User.create("A", email, "hash");
    const b = User.create("B", Email.create("b@example.com"), "hash");
    expect(a.equals(a)).toBe(true);
    expect(a.equals(b)).toBe(false);
  });
});
