import { describe, it, expect, vi } from "vitest";
import { GetMonthlySummaryUseCase } from "../../../../../src/application/use-cases";
import { EntityId } from "../../../../../src/domain/value-objects";

function setup() {
  const mockRepo = { findById: vi.fn(), findAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), getMonthlySummary: vi.fn(), getCategorySummary: vi.fn() };
  const useCase = new GetMonthlySummaryUseCase(mockRepo);
  return { useCase, mockRepo };
}

describe("GetMonthlySummaryUseCase", () => {
  const userId = EntityId.create();

  it("returns monthly summary", async () => {
    const { useCase, mockRepo } = setup();
    mockRepo.getMonthlySummary.mockResolvedValue({
      totalExpenses: 500,
      balance: 1000,
      byCategory: [
        { categoryId: "1", categoryName: "Food", categoryIcon: "🍕", categoryColor: "#FF5733", total: 300, count: 3 },
        { categoryId: "2", categoryName: "Transport", categoryIcon: "🚗", categoryColor: "#33FF57", total: 200, count: 2 },
      ],
      previousMonthTotal: 400,
      percentageChange: 25,
    });

    const result = await useCase.execute(userId, 2024, 6);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.totalExpenses).toBe(500);
      expect(result.value.balance).toBe(1000);
      expect(result.value.byCategory).toHaveLength(2);
      expect(result.value.percentageChange).toBe(25);
    }
  });
});
