import { eq, and, like, gte, lte, sql } from "drizzle-orm";
import { IExpenseRepository } from "../../../domain/ports";
import type { ExpenseFilters, MonthlySummary, CategorySummary } from "../../../domain/ports";
import { Expense } from "../../../domain/entities";
import { EntityId } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import type { DrizzleDB } from "../sqlite/connection";
import { expenses, categories } from "../sqlite/schema";
import { ExpenseMapper } from "../mappers";

export class DrizzleExpenseRepository implements IExpenseRepository {
  private mapper = new ExpenseMapper();

  constructor(private db: DrizzleDB) {}

  async findById(id: EntityId): Promise<Expense | null> {
    const row = await this.db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id.value))
      .get();
    return row ? this.mapper.toDomain(row) : null;
  }

  async findAll(
    filters: ExpenseFilters
  ): Promise<{ data: Expense[]; total: number }> {
    const conditions = [eq(expenses.userId, filters.userId.value)];

    if (filters.categoryId) {
      conditions.push(eq(expenses.categoryId, filters.categoryId.value));
    }

    if (filters.dateRange) {
      conditions.push(gte(expenses.date, filters.dateRange.start.toISOString()));
      conditions.push(lte(expenses.date, filters.dateRange.end.toISOString()));
    }

    if (filters.search) {
      conditions.push(like(expenses.description, `%${filters.search}%`));
    }

    const where = and(...conditions);

    const total = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(expenses)
      .where(where)
      .get();

    const rows = await this.db
      .select()
      .from(expenses)
      .where(where)
      .orderBy(sql`date DESC, created_at DESC`)
      .limit(filters.limit)
      .offset((filters.page - 1) * filters.limit)
      .all();

    return {
      data: rows.map((r) => this.mapper.toDomain(r)),
      total: total?.count ?? 0,
    };
  }

  async create(expense: Expense): Promise<Expense> {
    await this.db
      .insert(expenses)
      .values(this.mapper.toDrizzle(expense))
      .run();
    return expense;
  }

  async update(expense: Expense): Promise<Expense> {
    const result = await this.db
      .update(expenses)
      .set(this.mapper.toDrizzle(expense))
      .where(eq(expenses.id, expense.id.value))
      .run();
    if (result.changes === 0) {
      throw new NotFoundError("Expense", expense.id.value);
    }
    return expense;
  }

  async delete(id: EntityId): Promise<void> {
    const result = await this.db
      .delete(expenses)
      .where(eq(expenses.id, id.value))
      .run();
    if (result.changes === 0) {
      throw new NotFoundError("Expense", id.value);
    }
  }

  async getMonthlySummary(
    userId: EntityId,
    year: number,
    month: number
  ): Promise<MonthlySummary> {
    const startStr = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0);
    const endStr = endDate.toISOString().split("T")[0];

    const baseWhere = and(
      eq(expenses.userId, userId.value),
      gte(expenses.date, startStr),
      lte(expenses.date, endStr)
    );

    const expenseWhere = baseWhere
      ? and(baseWhere, eq(expenses.type, "expense"))
      : eq(expenses.type, "expense");
    const incomeWhere = baseWhere
      ? and(baseWhere, eq(expenses.type, "income"))
      : eq(expenses.type, "income");

    const incomeResult = await this.db
      .select({ total: sql<number>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .where(incomeWhere)
      .get();

    const expenseRows = await this.db
      .select({
        total: sql<number>`coalesce(sum(${expenses.amount}), 0)`,
        count: sql<number>`count(*)`,
        categoryId: expenses.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(expenseWhere)
      .groupBy(expenses.categoryId)
      .all();

    const prevStartStr = `${year - 1}-${String(month).padStart(2, "0")}-01`;
    const prevEndDate = new Date(year - 1, month, 0);
    const prevEndStr = prevEndDate.toISOString().split("T")[0];

    const prevTotal = await this.db
      .select({ total: sql<number>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId.value),
          gte(expenses.date, prevStartStr),
          lte(expenses.date, prevEndStr)
        )
      )
      .get();

    const totalIncome = incomeResult?.total ?? 0;
    const totalExpenses = expenseRows.reduce((acc, r) => acc + r.total, 0);
    const previousMonthTotal = prevTotal?.total ?? 0;
    const percentageChange =
      previousMonthTotal > 0
        ? ((totalExpenses - previousMonthTotal) / previousMonthTotal) * 100
        : 0;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      byCategory: expenseRows.map((r) => ({
        categoryId: r.categoryId,
        categoryName: r.categoryName ?? "Unknown",
        categoryIcon: r.categoryIcon ?? "help-circle",
        categoryColor: r.categoryColor ?? "#6b7280",
        total: r.total,
        count: r.count,
      })),
      previousMonthTotal,
      percentageChange: Math.round(percentageChange * 100) / 100,
    };
  }

  async getCategorySummary(
    userId: EntityId,
    year: number,
    month: number
  ): Promise<CategorySummary[]> {
    const startStr = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0);
    const endStr = endDate.toISOString().split("T")[0];

    const rows = await this.db
      .select({
        categoryId: expenses.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
        total: sql<number>`coalesce(sum(${expenses.amount}), 0)`,
        count: sql<number>`count(*)`,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          eq(expenses.userId, userId.value),
          gte(expenses.date, startStr),
          lte(expenses.date, endStr)
        )
      )
      .groupBy(expenses.categoryId)
      .all();

    return rows.map((r) => ({
      categoryId: r.categoryId,
      categoryName: r.categoryName ?? "Unknown",
      categoryIcon: r.categoryIcon ?? "help-circle",
      categoryColor: r.categoryColor ?? "#6b7280",
      total: r.total,
      count: r.count,
    }));
  }
}
