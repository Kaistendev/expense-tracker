import { Response } from "express";
import { resolve } from "../../infrastructure/container/container";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { GetMonthlySummaryUseCase } from "../../application/use-cases";
import { EntityId } from "../../domain/value-objects";

const getMonthlySummary = resolve(GetMonthlySummaryUseCase);

export async function monthlySummary(req: AuthenticatedRequest, res: Response): Promise<void> {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

  if (month < 1 || month > 12) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Month must be between 1 and 12" } });
    return;
  }

  const result = await getMonthlySummary.execute(EntityId.from(req.userId!), year, month);
  res.json(result.success ? result.value : { totalIncome: 0, totalExpenses: 0, balance: 0, byCategory: [], previousMonthTotal: 0, percentageChange: 0 });
}
