import { Expense } from "../../../domain/entities";
import { EntityId, Money } from "../../../domain/value-objects";
import { expenses } from "../sqlite/schema";

type ExpenseRow = typeof expenses.$inferSelect;

export class ExpenseMapper {
  toDomain(row: ExpenseRow): Expense {
    return Expense.from({
      id: EntityId.from(row.id),
      amount: Money.create(row.amount),
      description: row.description,
      date: new Date(row.date),
      type: (row.type ?? "expense") as "income" | "expense",
      categoryId: EntityId.from(row.categoryId),
      userId: EntityId.from(row.userId),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  toDrizzle(expense: Expense): typeof expenses.$inferInsert {
    return {
      id: expense.id.value,
      amount: expense.amount.amount,
      description: expense.description,
      date: expense.date.toISOString(),
      type: expense.type,
      categoryId: expense.categoryId.value,
      userId: expense.userId.value,
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    };
  }
}
