import type { IExpenseRepository } from "../../../domain/ports";
import { EntityId } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";

export class DeleteExpenseUseCase {
  constructor(private expenseRepo: IExpenseRepository) {}

  async execute(
    id: EntityId,
    userId: EntityId
  ): Promise<Result<void>> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense || !expense.belongsTo(userId)) {
      return fail(new NotFoundError("Expense", id.value));
    }

    await this.expenseRepo.delete(id);
    return ok(undefined);
  }
}
