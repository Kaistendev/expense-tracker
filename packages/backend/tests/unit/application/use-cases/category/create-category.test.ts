import { describe, it, expect, vi } from "vitest";
import { CreateCategoryUseCase } from "../../../../../src/application/use-cases";
import { EntityId } from "../../../../../src/domain/value-objects";
import { ConflictError } from "../../../../../src/domain/errors";

function setup() {
  const mockRepo = { findById: vi.fn(), findAllByUserId: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const useCase = new CreateCategoryUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("CreateCategoryUseCase", () => {
  const userId = EntityId.create();

  it("creates a category", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.findAllByUserId.mockResolvedValue([]);
    mockRepo.create.mockImplementation((c) => c);

    const result = await useCase.execute({ name: "Food", icon: "🍕", color: "#FF5733" }, userId);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.name).toBe("Food");
    }
    expect(mockRepo.create).toHaveBeenCalledOnce();
  });

  it("fails when duplicate name exists", async () => {
    const { useCase, mockRepo } = setup();
    const existing = [{ name: "Food" } as any];
    mockRepo.findAllByUserId.mockResolvedValue([{ name: "Food" } as any]);

    const result = await useCase.execute({ name: "Food", icon: "🍕", color: "#FF5733" }, userId);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(ConflictError);
  });
});
