import { describe, it, expect, vi } from "vitest";
import { DeleteExpenseUseCase } from "../../../../../src/application/use-cases";
import { EntityId } from "../../../../../src/domain/value-objects";
import { NotFoundError } from "../../../../../src/domain/errors";

function setup() {
  const mockRepo = { findById: vi.fn(), findAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), getMonthlySummary: vi.fn(), getCategorySummary: vi.fn() };
  const useCase = new DeleteExpenseUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("DeleteExpenseUseCase", () => {
  const userId = EntityId.create();
  const expenseId = EntityId.create();

  it("deletes an existing expense", async () => {
    const { useCase, mockRepo } = setup();
    const expense = { id: expenseId, belongsTo: (u: any) => u.equals(userId) };
    mockRepo.findById.mockResolvedValue(expense);

    const result = await useCase.execute(expenseId, userId);

    expect(result.success).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith(expenseId);
  });

  it("fails when expense not found", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(expenseId, userId);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
