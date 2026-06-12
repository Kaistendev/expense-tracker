import type { IExpenseRepository } from "../../../domain/ports";
import { EntityId, DateRange } from "../../../domain/value-objects";
import { ok, Result } from "../../../domain/errors";
import type { ExpenseFiltersDto, PaginatedExpensesResponse } from "../../dto";

export class ListExpensesUseCase {
  constructor(private expenseRepo: IExpenseRepository) {}

  async execute(
    filters: ExpenseFiltersDto,
    userId: EntityId
  ): Promise<Result<PaginatedExpensesResponse>> {
    const dateRange =
      filters.from && filters.to
        ? DateRange.fromStrings(filters.from, filters.to)
        : undefined;

    const result = await this.expenseRepo.findAll({
      userId,
      categoryId: filters.categoryId ? EntityId.from(filters.categoryId) : undefined,
      dateRange,
      search: filters.search,
      page: filters.page,
      limit: filters.limit,
    });

    return ok({
      data: result.data.map((e) => ({
        id: e.id.value,
        amount: e.amount.amount,
        description: e.description,
        date: e.date.toISOString(),
        type: e.type,
        categoryId: e.categoryId.value,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      })),
      total: result.total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(result.total / filters.limit),
    });
  }
}
