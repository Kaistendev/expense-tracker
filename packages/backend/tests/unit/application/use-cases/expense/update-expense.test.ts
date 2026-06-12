import { describe, it, expect, vi } from "vitest";
import { UpdateExpenseUseCase } from "../../../../../src/application/use-cases";
import { EntityId, Money } from "../../../../../src/domain/value-objects";
import { NotFoundError } from "../../../../../src/domain/errors";

function setup() {
  const mockRepo = { findById: vi.fn(), findAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), getMonthlySummary: vi.fn(), getCategorySummary: vi.fn() };
  const useCase = new UpdateExpenseUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("UpdateExpenseUseCase", () => {
  const userId = EntityId.create();
  const expenseId = EntityId.create();

  it("updates an existing expense", async () => {
    const { useCase, mockRepo } = setup();
    const expense = { id: expenseId, amount: Money.create(50), description: "Lunch", date: new Date(), categoryId: EntityId.create(), userId, createdAt: new Date(), updatedAt: new Date(), belongsTo: (u: any) => u.equals(userId), update: vi.fn() };
    mockRepo.findById.mockResolvedValue(expense);

    const result = await useCase.execute(expenseId, { description: "Dinner", amount: 30 }, userId);

    expect(result.success).toBe(true);
    expect(expense.update).toHaveBeenCalled();
    expect(mockRepo.update).toHaveBeenCalledWith(expense);
  });

  it("fails when expense not found", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(expenseId, { description: "Dinner" }, userId);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
