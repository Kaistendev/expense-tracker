import { describe, it, expect, vi } from "vitest";
import { RegisterUserUseCase } from "../../../../../src/application/use-cases";
import { EntityId, Email } from "../../../../../src/domain/value-objects";
import { ConflictError } from "../../../../../src/domain/errors";

function setup() {
  const mockUserRepo = { findById: vi.fn(), findByEmail: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const mockAuth = { hashPassword: vi.fn(), comparePassword: vi.fn(), signToken: vi.fn(), verifyToken: vi.fn() };
  const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
  const useCase = new RegisterUserUseCase(mockUserRepo, mockAuth, mockLogger);
  return { useCase, mockUserRepo, mockAuth, mockLogger };
}

describe("RegisterUserUseCase", () => {
  it("registers a new user successfully", async () => {
    const { useCase, mockUserRepo, mockAuth, mockLogger } = setup();
    const dto = { name: "John", email: "john@example.com", password: "123456" };

    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockAuth.hashPassword.mockResolvedValue("hashed-pass");
    mockAuth.signToken.mockReturnValue("token-123");

    const result = await useCase.execute(dto);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.user.name).toBe("John");
      expect(result.value.token).toBe("token-123");
    }
    expect(mockUserRepo.create).toHaveBeenCalledOnce();
    expect(mockAuth.hashPassword).toHaveBeenCalledWith("123456");
    expect(mockLogger.info).toHaveBeenCalledOnce();
  });

  it("fails when email is already registered", async () => {
    const { useCase, mockUserRepo } = setup();
    const dto = { name: "John", email: "existing@example.com", password: "123456" };

    const existing = { id: EntityId.create(), email: Email.create(dto.email) };
    mockUserRepo.findByEmail.mockResolvedValue(existing);

    const result = await useCase.execute(dto);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ConflictError);
    }
  });
});
