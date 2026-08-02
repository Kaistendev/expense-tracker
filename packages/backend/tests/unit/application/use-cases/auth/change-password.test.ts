import { describe, it, expect, vi } from "vitest";
import { ChangePasswordUseCase } from "../../../../../src/application/use-cases";
import { EntityId } from "../../../../../src/domain/value-objects";
import { NotFoundError, UnauthorizedError } from "../../../../../src/domain/errors";

function setup() {
  const mockUserRepo = { findById: vi.fn(), findByEmail: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const mockAuth = { hashPassword: vi.fn(), comparePassword: vi.fn(), signToken: vi.fn(), verifyToken: vi.fn() };
  const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
  const useCase = new ChangePasswordUseCase(mockUserRepo, mockAuth, mockLogger);
  return { useCase, mockUserRepo, mockAuth, mockLogger };
}

function makeUser() {
  return {
    id: EntityId.create(),
    passwordHash: "old-hash",
    updatePassword: vi.fn(function (hash: string) {
      this.passwordHash = hash;
    }),
  };
}

const dto = { currentPassword: "old-pass", newPassword: "new-pass", confirmPassword: "new-pass" };

describe("ChangePasswordUseCase", () => {
  it("changes the password successfully", async () => {
    const { useCase, mockUserRepo, mockAuth, mockLogger } = setup();
    const user = makeUser();
    mockUserRepo.findById.mockResolvedValue(user);
    mockAuth.comparePassword.mockResolvedValue(true);
    mockAuth.hashPassword.mockResolvedValue("new-hash");

    const result = await useCase.execute(user.id, dto);

    expect(result.success).toBe(true);
    expect(mockAuth.comparePassword).toHaveBeenCalledWith("old-pass", "old-hash");
    expect(user.updatePassword).toHaveBeenCalledWith("new-hash");
    expect(mockUserRepo.update).toHaveBeenCalledWith(user);
    expect(mockLogger.info).toHaveBeenCalledOnce();
  });

  it("fails when the current password is incorrect", async () => {
    const { useCase, mockUserRepo, mockAuth } = setup();
    const user = makeUser();
    mockUserRepo.findById.mockResolvedValue(user);
    mockAuth.comparePassword.mockResolvedValue(false);

    const result = await useCase.execute(user.id, dto);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(UnauthorizedError);
    }
    expect(mockAuth.hashPassword).not.toHaveBeenCalled();
  });

  it("fails when the user does not exist", async () => {
    const { useCase, mockUserRepo } = setup();
    mockUserRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(EntityId.create(), dto);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(NotFoundError);
    }
  });
});