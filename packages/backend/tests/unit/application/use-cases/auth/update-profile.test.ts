import { describe, it, expect, vi } from "vitest";
import { UpdateProfileUseCase } from "../../../../../src/application/use-cases";
import { EntityId, Email } from "../../../../../src/domain/value-objects";
import { NotFoundError } from "../../../../../src/domain/errors";

function setup() {
  const mockUserRepo = { findById: vi.fn(), findByEmail: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
  const useCase = new UpdateProfileUseCase(mockUserRepo, mockLogger);
  return { useCase, mockUserRepo, mockLogger };
}

function makeUser(name = "John") {
  const user = {
    id: EntityId.create(),
    name,
    email: Email.create("john@example.com"),
    updateProfile: vi.fn(function (newName: string) {
      this.name = newName;
    }),
    updatePassword: vi.fn(),
  };
  return user;
}

describe("UpdateProfileUseCase", () => {
  it("updates the user name successfully", async () => {
    const { useCase, mockUserRepo, mockLogger } = setup();
    const user = makeUser("John");
    mockUserRepo.findById.mockResolvedValue(user);

    const result = await useCase.execute(user.id, { name: "Jane" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.user.name).toBe("Jane");
    }
    expect(user.updateProfile).toHaveBeenCalledWith("Jane");
    expect(mockUserRepo.update).toHaveBeenCalledWith(user);
    expect(mockLogger.info).toHaveBeenCalledOnce();
  });

  it("fails when the user does not exist", async () => {
    const { useCase, mockUserRepo } = setup();
    mockUserRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(EntityId.create(), { name: "Jane" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(NotFoundError);
    }
  });
});