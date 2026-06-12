import { httpClient } from "../http-client";
import type { MonthlySummary } from "../../core/types";

export const dashboardApi = {
  getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    return httpClient.get<MonthlySummary>("/dashboard/monthly", { params: { year, month } }).then((r) => r.data);
  },
};
