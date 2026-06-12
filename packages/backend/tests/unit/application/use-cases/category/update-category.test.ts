import { describe, it, expect, vi } from "vitest";
import { UpdateCategoryUseCase } from "../../../../../src/application/use-cases";
import { EntityId } from "../../../../../src/domain/value-objects";
import { NotFoundError } from "../../../../../src/domain/errors";

function setup() {
  const mockRepo = { findById: vi.fn(), findAllByUserId: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const useCase = new UpdateCategoryUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("UpdateCategoryUseCase", () => {
  const userId = EntityId.create();
  const categoryId = EntityId.create();

  it("updates an existing category", async () => {
    const { useCase, mockRepo } = setup();
    const category = { id: categoryId, name: "Food", icon: "🍕", color: "#FF5733", userId, belongsTo: (u: any) => u.equals(userId), update: vi.fn() };
    mockRepo.findById.mockResolvedValue(category);

    const result = await useCase.execute(categoryId, { name: "Drinks", icon: "🥤", color: "#33FF57" }, userId);

    expect(result.success).toBe(true);
    expect(category.update).toHaveBeenCalledWith("Drinks", "🥤", "#33FF57");
    expect(mockRepo.update).toHaveBeenCalledWith(category);
  });

  it("fails when category not found", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(categoryId, { name: "Drinks" }, userId);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it("fails when category belongs to another user", async () => {
    const { useCase, mockRepo } = setup();
    const otherUserId = EntityId.create();
    const category = { id: categoryId, name: "Food", icon: "🍕", color: "#FF5733", userId: otherUserId, belongsTo: (u: any) => u.equals(otherUserId) };
    mockRepo.findById.mockResolvedValue(category);

    const result = await useCase.execute(categoryId, { name: "Drinks" }, userId);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
