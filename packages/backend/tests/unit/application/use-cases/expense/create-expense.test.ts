import { describe, it, expect, vi } from "vitest";
import { CreateExpenseUseCase } from "../../../../../src/application/use-cases";
import { EntityId, Money } from "../../../../../src/domain/value-objects";

function setup() {
  const mockRepo = { findById: vi.fn(), findAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), getMonthlySummary: vi.fn(), getCategorySummary: vi.fn() };
  const useCase = new CreateExpenseUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("CreateExpenseUseCase", () => {
  const userId = EntityId.create();

  it("creates an expense", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.create.mockImplementation((e) => e);

    const result = await useCase.execute({
      amount: 50,
      description: "Lunch",
      date: "2024-06-15",
      categoryId: EntityId.create().value,
    }, userId);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toHaveProperty("id");
      expect(result.value.amount).toBe(50);
      expect(result.value.description).toBe("Lunch");
    }
    expect(mockRepo.create).toHaveBeenCalledOnce();
  });
});
