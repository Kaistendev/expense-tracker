import { describe, it, expect, vi } from "vitest";
import { DeleteCategoryUseCase } from "../../../../../src/application/use-cases";
import { EntityId } from "../../../../../src/domain/value-objects";
import { NotFoundError } from "../../../../../src/domain/errors";

function setup() {
  const mockRepo = { findById: vi.fn(), findAllByUserId: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const useCase = new DeleteCategoryUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("DeleteCategoryUseCase", () => {
  const userId = EntityId.create();
  const categoryId = EntityId.create();

  it("deletes an existing category", async () => {
    const { useCase, mockRepo } = setup();
    const category = { id: categoryId, belongsTo: (u: any) => u.equals(userId) };
    mockRepo.findById.mockResolvedValue(category);

    const result = await useCase.execute(categoryId, userId);

    expect(result.success).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith(categoryId);
  });

  it("fails when category not found", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(categoryId, userId);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
