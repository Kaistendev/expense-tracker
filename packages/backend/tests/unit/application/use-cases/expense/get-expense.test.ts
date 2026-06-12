import { describe, it, expect, vi } from "vitest";
import { GetExpenseUseCase } from "../../../../../src/application/use-cases";
import { EntityId, Money } from "../../../../../src/domain/value-objects";
import { NotFoundError } from "../../../../../src/domain/errors";

function setup() {
  const mockRepo = { findById: vi.fn(), findAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), getMonthlySummary: vi.fn(), getCategorySummary: vi.fn() };
  const useCase = new GetExpenseUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("GetExpenseUseCase", () => {
  const userId = EntityId.create();
  const expenseId = EntityId.create();

  it("returns an expense by id", async () => {
    const { useCase, mockRepo } = setup();
    const expense = { id: expenseId, amount: Money.create(50), description: "Lunch", date: new Date(), categoryId: EntityId.create(), userId, createdAt: new Date(), updatedAt: new Date(), belongsTo: (u: any) => u.equals(userId) };
    mockRepo.findById.mockResolvedValue(expense);

    const result = await useCase.execute(expenseId, userId);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.description).toBe("Lunch");
    }
  });

  it("fails when expense not found", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(expenseId, userId);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
