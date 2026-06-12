import { Response } from "express";
import { resolve } from "../../infrastructure/container/container";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  CreateExpenseUseCase,
  ListExpensesUseCase,
  GetExpenseUseCase,
  UpdateExpenseUseCase,
  DeleteExpenseUseCase,
} from "../../application/use-cases";
import { CreateExpenseSchema, UpdateExpenseSchema, ExpenseFiltersSchema } from "../../application/dto";
import { EntityId } from "../../domain/value-objects";
import { DomainError } from "../../domain/errors";

const createUseCase = resolve(CreateExpenseUseCase);
const listUseCase = resolve(ListExpensesUseCase);
const getUseCase = resolve(GetExpenseUseCase);
const updateUseCase = resolve(UpdateExpenseUseCase);
const deleteUseCase = resolve(DeleteExpenseUseCase);

export async function createExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = CreateExpenseSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.errors } });
    return;
  }

  const result = await createUseCase.execute(parsed.data, EntityId.from(req.userId!));

  if (result.success) {
    res.status(201).json(result.value);
  } else {
    res.status(400).json({ error: { code: result.error instanceof DomainError ? result.error.code : "INTERNAL_ERROR", message: result.error.message } });
  }
}

export async function listExpenses(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = ExpenseFiltersSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid filters", details: parsed.error.errors } });
    return;
  }

  const result = await listUseCase.execute(parsed.data, EntityId.from(req.userId!));
  res.json(result.success ? result.value : { data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
}

export async function getExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await getUseCase.execute(EntityId.from(req.params.id as string), EntityId.from(req.userId!));

  if (result.success) {
    res.json(result.value);
  } else {
    res.status(404).json({ error: { code: "NOT_FOUND", message: result.error.message } });
  }
}

export async function updateExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = UpdateExpenseSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.errors } });
    return;
  }

  const result = await updateUseCase.execute(
    EntityId.from(req.params.id as string),
    parsed.data,
    EntityId.from(req.userId!)
  );

  if (result.success) {
    res.json(result.value);
  } else {
    res.status(404).json({ error: { code: "NOT_FOUND", message: result.error.message } });
  }
}

export async function deleteExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await deleteUseCase.execute(EntityId.from(req.params.id as string), EntityId.from(req.userId!));

  if (result.success) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: { code: "NOT_FOUND", message: result.error.message } });
  }
}
