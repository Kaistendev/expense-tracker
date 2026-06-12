import { EntityId, DateRange } from "../value-objects";

export interface ExpenseFilters {
  userId: EntityId;
  categoryId?: EntityId;
  dateRange?: DateRange;
  search?: string;
  page: number;
  limit: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  total: number;
  count: number;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: CategorySummary[];
  previousMonthTotal: number;
  percentageChange: number;
}
