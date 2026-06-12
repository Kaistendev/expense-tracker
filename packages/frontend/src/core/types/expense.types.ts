export interface ExpenseResponse {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  amount: number;
  description: string;
  date: string;
  type?: "income" | "expense";
  categoryId: string;
}

export interface UpdateExpenseRequest {
  amount?: number;
  description?: string;
  date?: string;
  type?: "income" | "expense";
  categoryId?: string;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  from?: string;
  to?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
