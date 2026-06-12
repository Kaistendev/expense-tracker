import { describe, it, expect, vi } from "vitest";
import { LoginUseCase } from "../../../../../src/application/use-cases";
import { User } from "../../../../../src/domain/entities";
import { EntityId, Email } from "../../../../../src/domain/value-objects";
import { NotFoundError, UnauthorizedError } from "../../../../../src/domain/errors";

function setup() {
  const mockUserRepo = { findById: vi.fn(), findByEmail: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const mockAuth = { hashPassword: vi.fn(), comparePassword: vi.fn(), signToken: vi.fn(), verifyToken: vi.fn() };
  const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
  const useCase = new LoginUseCase(mockUserRepo, mockAuth, mockLogger);
  return { useCase, mockUserRepo, mockAuth, mockLogger };
}

describe("LoginUseCase", () => {
  it("logs in with valid credentials", async () => {
    const { useCase, mockUserRepo, mockAuth, mockLogger } = setup();

    const user = User.create("John", Email.create("john@example.com"), "hashed-pass");
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockAuth.comparePassword.mockResolvedValue(true);
    mockAuth.signToken.mockReturnValue("token-123");

    const result = await useCase.execute({ email: "john@example.com", password: "123456" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.user.name).toBe("John");
      expect(result.value.token).toBe("token-123");
    }
    expect(mockLogger.info).toHaveBeenCalledOnce();
  });

  it("fails when user not found", async () => {
    const { useCase, mockUserRepo } = setup();
    mockUserRepo.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute({ email: "nobody@example.com", password: "123456" });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it("fails with wrong password", async () => {
    const { useCase, mockUserRepo, mockAuth } = setup();
    const user = User.create("John", Email.create("john@example.com"), "hashed-pass");
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockAuth.comparePassword.mockResolvedValue(false);

    const result = await useCase.execute({ email: "john@example.com", password: "wrong" });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(UnauthorizedError);
  });
});
