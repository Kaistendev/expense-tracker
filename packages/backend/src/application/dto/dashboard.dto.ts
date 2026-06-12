export interface CategorySummaryResponse {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  total: number;
  count: number;
}

export interface MonthlySummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: CategorySummaryResponse[];
  previousMonthTotal: number;
  percentageChange: number;
}
