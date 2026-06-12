import type { IExpenseRepository } from "../../../domain/ports";
import { Expense } from "../../../domain/entities";
import { EntityId, Money } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { CreateExpenseDto, ExpenseResponse } from "../../dto";

export class CreateExpenseUseCase {
  constructor(private expenseRepo: IExpenseRepository) {}

  async execute(
    dto: CreateExpenseDto,
    userId: EntityId
  ): Promise<Result<ExpenseResponse>> {
    const amount = Money.create(dto.amount);
    const expense = Expense.create(
      amount,
      dto.description,
      new Date(dto.date),
      EntityId.from(dto.categoryId),
      userId,
      dto.type
    );

    await this.expenseRepo.create(expense);

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
