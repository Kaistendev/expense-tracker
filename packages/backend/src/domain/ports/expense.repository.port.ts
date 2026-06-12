import { Expense } from "../entities";
import { EntityId } from "../value-objects";
import { ExpenseFilters, MonthlySummary, CategorySummary } from "./expense-filters";

export interface IExpenseRepository {
  findById(id: EntityId): Promise<Expense | null>;
  findAll(filters: ExpenseFilters): Promise<{ data: Expense[]; total: number }>;
  create(expense: Expense): Promise<Expense>;
  update(expense: Expense): Promise<Expense>;
  delete(id: EntityId): Promise<void>;
  getMonthlySummary(
    userId: EntityId,
    year: number,
    month: number
  ): Promise<MonthlySummary>;
  getCategorySummary(
    userId: EntityId,
    year: number,
    month: number
  ): Promise<CategorySummary[]>;
}
