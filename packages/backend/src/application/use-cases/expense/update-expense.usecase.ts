import type { IExpenseRepository } from "../../../domain/ports";
import { EntityId, Money } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { UpdateExpenseDto, ExpenseResponse } from "../../dto";

export class UpdateExpenseUseCase {
  constructor(private expenseRepo: IExpenseRepository) {}

  async execute(
    id: EntityId,
    dto: UpdateExpenseDto,
    userId: EntityId
  ): Promise<Result<ExpenseResponse>> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense || !expense.belongsTo(userId)) {
      return fail(new NotFoundError("Expense", id.value));
    }

    expense.update({
      amount: dto.amount ? Money.create(dto.amount) : undefined,
      description: dto.description,
      date: dto.date ? new Date(dto.date) : undefined,
      type: dto.type,
      categoryId: dto.categoryId ? EntityId.from(dto.categoryId) : undefined,
    });

    await this.expenseRepo.update(expense);

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
