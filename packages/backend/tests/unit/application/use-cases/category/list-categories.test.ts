import { describe, it, expect, vi } from "vitest";
import { ListCategoriesUseCase } from "../../../../../src/application/use-cases";
import { EntityId } from "../../../../../src/domain/value-objects";

function setup() {
  const mockRepo = { findById: vi.fn(), findAllByUserId: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  const useCase = new ListCategoriesUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("ListCategoriesUseCase", () => {
  const userId = EntityId.create();

  it("returns all categories for a user", async () => {
    const { useCase, mockRepo } = setup();
    const category = { id: EntityId.create(), name: "Food", icon: "🍕", color: "#FF5733", userId, createdAt: new Date(), belongsTo: () => true, equals: () => true };
    mockRepo.findAllByUserId.mockResolvedValue([category]);

    const result = await useCase.execute(userId);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].name).toBe("Food");
    }
  });

  it("returns empty array when no categories", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute(userId);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toHaveLength(0);
    }
  });
});
