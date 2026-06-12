import { useState, useCallback } from "react";
import { expenseApi } from "../../infrastructure/api";
import type { ExpenseResponse, CreateExpenseRequest, UpdateExpenseRequest, ExpenseFilters } from "../../core/types";

interface ExpensesState {
  expenses: ExpenseResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    return axiosErr.response?.data?.error ?? "An error occurred";
  }
  return "An error occurred";
}

export function useExpenses() {
  const [state, setState] = useState<ExpensesState>({
    expenses: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    loading: false,
    error: null,
  });

  const fetchExpenses = useCallback(async (filters?: ExpenseFilters) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await expenseApi.list(filters);
      setState({
        expenses: res.data,
        total: res.total,
        page: res.page,
        limit: res.limit,
        totalPages: res.totalPages,
        loading: false,
        error: null,
      });
      return res;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const getExpense = useCallback(async (id: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const expense = await expenseApi.getById(id);
      setState((s) => ({ ...s, loading: false, error: null }));
      return expense;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const createExpense = useCallback(async (data: CreateExpenseRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const expense = await expenseApi.create(data);
      setState((s) => ({
        ...s,
        expenses: [expense, ...s.expenses],
        total: s.total + 1,
        loading: false,
        error: null,
      }));
      return expense;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id: string, data: UpdateExpenseRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const updated = await expenseApi.update(id, data);
      setState((s) => ({
        ...s,
        expenses: s.expenses.map((e) => (e.id === id ? updated : e)),
        loading: false,
        error: null,
      }));
      return updated;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await expenseApi.delete(id);
      setState((s) => ({
        ...s,
        expenses: s.expenses.filter((e) => e.id !== id),
        total: s.total - 1,
        loading: false,
        error: null,
      }));
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  return {
    expenses: state.expenses,
    total: state.total,
    page: state.page,
    limit: state.limit,
    totalPages: state.totalPages,
    loading: state.loading,
    error: state.error,
    fetchExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
