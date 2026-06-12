import { describe, it, expect } from "vitest";
import { ok, fail, DomainError, NotFoundError } from "../../../../src/domain/errors";

describe("Result", () => {
  it("creates a success result", () => {
    const result = ok(42);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(42);
    }
  });

  it("creates a failure result", () => {
    const error = new NotFoundError("User", "123");
    const result = fail(error);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(error);
    }
  });

  it("narrows types correctly with success true", () => {
    const result = ok("hello");
    if (result.success) {
      const value: string = result.value;
      expect(value).toBe("hello");
    }
  });

  it("narrows types correctly with success false", () => {
    const result = fail(new DomainError("Something went wrong"));
    if (!result.success) {
      const error: DomainError = result.error;
      expect(error.message).toBe("Something went wrong");
    }
  });

  it("works with domain errors", () => {
    const error = new NotFoundError("User", "123");
    expect(error.name).toBe("NotFoundError");
    expect(error.message).toContain("User");
    expect(error.message).toContain("123");
  });
});
