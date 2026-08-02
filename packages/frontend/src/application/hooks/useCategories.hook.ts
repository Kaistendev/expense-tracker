import { useState, useCallback } from "react";
import { categoryApi } from "../../infrastructure/api";
import { getErrorMessage } from "./getErrorMessage";
import type { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from "../../core/types";

interface CategoriesState {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
}

export function useCategories() {
  const [state, setState] = useState<CategoriesState>({
    categories: [],
    loading: false,
    error: null,
  });

  const fetchCategories = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const categories = await categoryApi.list();
      setState({ categories, loading: false, error: null });
      return categories;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const createCategory = useCallback(async (data: CreateCategoryRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const category = await categoryApi.create(data);
      setState((s) => ({ categories: [...s.categories, category], loading: false, error: null }));
      return category;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: UpdateCategoryRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const updated = await categoryApi.update(id, data);
      setState((s) => ({
        categories: s.categories.map((c) => (c.id === id ? updated : c)),
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

  const deleteCategory = useCallback(async (id: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await categoryApi.delete(id);
      setState((s) => ({
        categories: s.categories.filter((c) => c.id !== id),
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
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
