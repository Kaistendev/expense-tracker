import { httpClient } from "../http-client";
import type { ExpenseResponse, CreateExpenseRequest, UpdateExpenseRequest, ExpenseFilters, PaginatedResponse } from "../../core/types";

export const expenseApi = {
  list(filters?: ExpenseFilters): Promise<PaginatedResponse<ExpenseResponse>> {
    return httpClient.get<PaginatedResponse<ExpenseResponse>>("/expenses", { params: filters }).then((r) => r.data);
  },
  getById(id: string): Promise<ExpenseResponse> {
    return httpClient.get<ExpenseResponse>(`/expenses/${id}`).then((r) => r.data);
  },
  create(data: CreateExpenseRequest): Promise<ExpenseResponse> {
    return httpClient.post<ExpenseResponse>("/expenses", data).then((r) => r.data);
  },
  update(id: string, data: UpdateExpenseRequest): Promise<ExpenseResponse> {
    return httpClient.put<ExpenseResponse>(`/expenses/${id}`, data).then((r) => r.data);
  },
  delete(id: string): Promise<void> {
    return httpClient.delete(`/expenses/${id}`).then(() => undefined);
  },
};
