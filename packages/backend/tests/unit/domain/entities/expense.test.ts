import { describe, it, expect } from "vitest";
import { Expense } from "../../../../src/domain/entities";
import { EntityId, Money, DateRange } from "../../../../src/domain/value-objects";

describe("Expense", () => {
  const userId = EntityId.create();
  const categoryId = EntityId.create();
  const amount = Money.create(50);
  const date = new Date("2024-06-15");

  it("creates an expense with valid data", () => {
    const expense = Expense.create(amount, "Lunch", date, categoryId, userId);
    expect(expense.amount.amount).toBe(50);
    expect(expense.description).toBe("Lunch");
    expect(expense.date.toISOString().startsWith("2024-06-15")).toBe(true);
    expect(expense.categoryId.equals(categoryId)).toBe(true);
    expect(expense.userId.equals(userId)).toBe(true);
    expect(expense.createdAt).toBeInstanceOf(Date);
    expect(expense.updatedAt).toBeInstanceOf(Date);
  });

  it("trims description on create", () => {
    const expense = Expense.create(amount, "  Lunch  ", date, categoryId, userId);
    expect(expense.description).toBe("Lunch");
  });

  it("reconstructs from props", () => {
    const original = Expense.create(amount, "Lunch", date, categoryId, userId);
    const restored = Expense.from({
      id: original.id,
      amount: original.amount,
      description: original.description,
      date: original.date,
      categoryId: original.categoryId,
      userId: original.userId,
      createdAt: original.createdAt,
      updatedAt: original.updatedAt,
    });
    expect(restored.equals(original)).toBe(true);
  });

  it("updates all properties", () => {
    const expense = Expense.create(amount, "Lunch", date, categoryId, userId);
    const newAmount = Money.create(30);
    const newDate = new Date("2024-06-20");
    const newCategoryId = EntityId.create();

    expense.update({
      amount: newAmount,
      description: "Dinner",
      date: newDate,
      categoryId: newCategoryId,
    });

    expect(expense.amount.equals(newAmount)).toBe(true);
    expect(expense.description).toBe("Dinner");
    expect(expense.date.toISOString().startsWith("2024-06-20")).toBe(true);
    expect(expense.categoryId.equals(newCategoryId)).toBe(true);
  });

  it("updates only provided properties", () => {
    const expense = Expense.create(amount, "Lunch", date, categoryId, userId);
    expense.update({ description: "Dinner" });
    expect(expense.description).toBe("Dinner");
    expect(expense.amount.amount).toBe(50);
  });

  it("checks ownership", () => {
    const expense = Expense.create(amount, "Lunch", date, categoryId, userId);
    expect(expense.belongsTo(userId)).toBe(true);
    expect(expense.belongsTo(EntityId.create())).toBe(false);
  });

  it("checks if within date range", () => {
    const expense = Expense.create(amount, "Lunch", new Date("2024-06-15"), categoryId, userId);
    const range = DateRange.fromStrings("2024-06-01", "2024-06-30");
    const outside = DateRange.fromStrings("2024-07-01", "2024-07-31");
    expect(expense.isInDateRange(range)).toBe(true);
    expect(expense.isInDateRange(outside)).toBe(false);
  });
});
