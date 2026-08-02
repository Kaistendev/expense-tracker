import { Request, Response } from "express";
import { resolve } from "../../infrastructure/container/container";
import {
  RegisterUserUseCase,
  LoginUseCase,
  UpdateProfileUseCase,
  ChangePasswordUseCase,
} from "../../application/use-cases";
import {
  RegisterUserSchema,
  LoginSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
} from "../../application/dto";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { EntityId } from "../../domain/value-objects";
import { DomainError } from "../../domain/errors";

const registerUseCase = resolve(RegisterUserUseCase);
const loginUseCase = resolve(LoginUseCase);
const updateProfileUseCase = resolve(UpdateProfileUseCase);
const changePasswordUseCase = resolve(ChangePasswordUseCase);

function respondWithError(res: Response, error: unknown): void {
  const code = error instanceof DomainError ? error.code : "INTERNAL_ERROR";
  const status = error instanceof DomainError ? errorCodeToStatus(code) : 500;
  res.status(status).json({ error: { code, message: error instanceof DomainError ? error.message : "Internal server error" } });
}

function errorCodeToStatus(code: string): number {
  switch (code) {
    case "NOT_FOUND": return 404;
    case "UNAUTHORIZED": return 401;
    case "CONFLICT": return 409;
    case "VALIDATION_ERROR": return 400;
    default: return 500;
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = RegisterUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.errors } });
    return;
  }

  const result = await registerUseCase.execute(parsed.data);

  if (result.success) {
    res.status(201).json(result.value);
  } else {
    const status = result.error instanceof DomainError && result.error.code === "CONFLICT" ? 409 : 400;
    res.status(status).json({ error: { code: result.error instanceof DomainError ? result.error.code : "INTERNAL_ERROR", message: result.error.message } });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.errors } });
    return;
  }

  const result = await loginUseCase.execute(parsed.data);

  if (result.success) {
    res.json(result.value);
  } else {
    const status = result.error instanceof DomainError && result.error.code === "UNAUTHORIZED" ? 401 : 404;
    res.status(status).json({ error: { code: result.error instanceof DomainError ? result.error.code : "INTERNAL_ERROR", message: result.error.message } });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.errors } });
    return;
  }

  const result = await updateProfileUseCase.execute(EntityId.from(req.userId!), parsed.data);

  if (result.success) {
    res.json(result.value);
  } else {
    respondWithError(res, result.error);
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = ChangePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.errors } });
    return;
  }

  const result = await changePasswordUseCase.execute(EntityId.from(req.userId!), parsed.data);

  if (result.success) {
    res.json({ success: true });
  } else {
    respondWithError(res, result.error);
  }
}
