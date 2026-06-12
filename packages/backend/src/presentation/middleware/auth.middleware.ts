import { Request, Response, NextFunction } from "express";
import { resolve } from "../../infrastructure/container/container";
import { AuthService } from "../../infrastructure/auth";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

const authService = resolve(AuthService);

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing or invalid token" } });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = authService.verifyToken(token);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } });
  }
}
