import type { IExpenseRepository } from "../../../domain/ports";
import { EntityId } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { ExpenseResponse } from "../../dto";

export class GetExpenseUseCase {
  constructor(private expenseRepo: IExpenseRepository) {}

  async execute(
    id: EntityId,
    userId: EntityId
  ): Promise<Result<ExpenseResponse>> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense || !expense.belongsTo(userId)) {
      return fail(new NotFoundError("Expense", id.value));
    }

    return ok({
      id: expense.id.value,
      amount: expense.amount.amount,
      description: expense.description,
      date: expense.date.toISOString(),
      type: expense.type,
      categoryId: expense.categoryId.value,
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    });
  }
}
