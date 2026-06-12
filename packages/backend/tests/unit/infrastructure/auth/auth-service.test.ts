import { describe, it, expect, beforeAll } from "vitest";
import { AuthService } from "../../../../src/infrastructure/auth";

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(() => {
    authService = new AuthService();
  });

  it("hashes and compares passwords correctly", async () => {
    const password = "mySecurePassword123!";
    const hash = await authService.hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);

    const valid = await authService.comparePassword(password, hash);
    expect(valid).toBe(true);

    const invalid = await authService.comparePassword("wrong-password", hash);
    expect(invalid).toBe(false);
  });

  it("signs and verifies JWT tokens", () => {
    const payload = { userId: "123", email: "test@example.com" };
    const token = authService.signToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = authService.verifyToken(token);
    expect(decoded.userId).toBe("123");
    expect(decoded.email).toBe("test@example.com");
  });

  it("throws on invalid token", () => {
    expect(() => authService.verifyToken("invalid-token")).toThrow();
  });
});
