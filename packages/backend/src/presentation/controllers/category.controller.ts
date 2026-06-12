import { Response } from "express";
import { resolve } from "../../infrastructure/container/container";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../application/use-cases";
import { CreateCategorySchema, UpdateCategorySchema } from "../../application/dto";
import { EntityId } from "../../domain/value-objects";
import { DomainError } from "../../domain/errors";

const createUseCase = resolve(CreateCategoryUseCase);
const listUseCase = resolve(ListCategoriesUseCase);
const updateUseCase = resolve(UpdateCategoryUseCase);
const deleteUseCase = resolve(DeleteCategoryUseCase);

export async function createCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = CreateCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.errors } });
    return;
  }

  const result = await createUseCase.execute(parsed.data, EntityId.from(req.userId!));

  if (result.success) {
    res.status(201).json(result.value);
  } else {
    const status = result.error instanceof DomainError && result.error.code === "CONFLICT" ? 409 : 400;
    res.status(status).json({ error: { code: result.error instanceof DomainError ? result.error.code : "INTERNAL_ERROR", message: result.error.message } });
  }
}

export async function listCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await listUseCase.execute(EntityId.from(req.userId!));
  res.json(result.success ? result.value : []);
}

export async function updateCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = UpdateCategorySchema.safeParse(req.body);
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

export async function deleteCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await deleteUseCase.execute(EntityId.from(req.params.id as string), EntityId.from(req.userId!));

  if (result.success) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: { code: "NOT_FOUND", message: result.error.message } });
  }
}
