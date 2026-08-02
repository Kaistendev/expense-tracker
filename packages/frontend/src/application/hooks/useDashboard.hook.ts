import { useState, useCallback } from "react";
import { dashboardApi } from "../../infrastructure/api";
import { getErrorMessage } from "./getErrorMessage";
import type { MonthlySummary } from "../../core/types";

interface DashboardState {
  summary: MonthlySummary | null;
  loading: boolean;
  error: string | null;
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    summary: null,
    loading: false,
    error: null,
  });

  const fetchSummary = useCallback(async (year: number, month: number) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const summary = await dashboardApi.getMonthlySummary(year, month);
      setState({ summary, loading: false, error: null });
      return summary;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  return {
    summary: state.summary,
    loading: state.loading,
    error: state.error,
    fetchSummary,
  };
}
