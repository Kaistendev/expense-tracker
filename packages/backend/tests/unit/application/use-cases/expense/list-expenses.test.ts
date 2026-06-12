import { describe, it, expect, vi } from "vitest";
import { ListExpensesUseCase } from "../../../../../src/application/use-cases";
import { EntityId, Money } from "../../../../../src/domain/value-objects";

function setup() {
  const mockRepo = { findById: vi.fn(), findAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), getMonthlySummary: vi.fn(), getCategorySummary: vi.fn() };
  const useCase = new ListExpensesUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("ListExpensesUseCase", () => {
  const userId = EntityId.create();

  it("returns paginated expenses", async () => {
    const { useCase, mockRepo } = setup();
    const expense = { id: EntityId.create(), amount: Money.create(50), description: "Lunch", date: new Date("2024-06-15"), categoryId: EntityId.create(), createdAt: new Date(), updatedAt: new Date(), belongsTo: () => true };
    mockRepo.findAll.mockResolvedValue({ data: [expense], total: 1 });

    const result = await useCase.execute({ page: 1, limit: 20 }, userId);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.data).toHaveLength(1);
      expect(result.value.total).toBe(1);
      expect(result.value.page).toBe(1);
      expect(result.value.totalPages).toBe(1);
    }
  });

  it("returns empty list when no expenses", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.findAll.mockResolvedValue({ data: [], total: 0 });

    const result = await useCase.execute({ page: 1, limit: 20 }, userId);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.data).toHaveLength(0);
      expect(result.value.total).toBe(0);
    }
  });
});
