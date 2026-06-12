import { Request, Response } from "express";
import { resolve } from "../../infrastructure/container/container";
import { RegisterUserUseCase, LoginUseCase } from "../../application/use-cases";
import { RegisterUserSchema, LoginSchema } from "../../application/dto";
import { DomainError } from "../../domain/errors";

const registerUseCase = resolve(RegisterUserUseCase);
const loginUseCase = resolve(LoginUseCase);

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
