import type { IExpenseRepository } from "../../../domain/ports";
import { EntityId } from "../../../domain/value-objects";
import { ok, Result } from "../../../domain/errors";
import type { MonthlySummaryResponse } from "../../dto";

export class GetMonthlySummaryUseCase {
  constructor(private expenseRepo: IExpenseRepository) {}

  async execute(
    userId: EntityId,
    year: number,
    month: number
  ): Promise<Result<MonthlySummaryResponse>> {
    const summary = await this.expenseRepo.getMonthlySummary(userId, year, month);

    return ok({
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      balance: summary.balance,
      byCategory: summary.byCategory.map((c) => ({
        categoryId: c.categoryId,
        categoryName: c.categoryName,
        categoryIcon: c.categoryIcon,
        categoryColor: c.categoryColor,
        total: c.total,
        count: c.count,
      })),
      previousMonthTotal: summary.previousMonthTotal,
      percentageChange: summary.percentageChange,
    });
  }
}
