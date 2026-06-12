import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuthService, TokenPayload } from "../../application/ports";

const SALT_ROUNDS = 10;
const DEFAULT_SECRET = "dev-secret-change-in-production";
const EXPIRES_IN = "7d";

export class AuthService implements IAuthService {
  private get secret(): string {
    return process.env.JWT_SECRET ?? DEFAULT_SECRET;
  }

  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  signToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: EXPIRES_IN });
  }

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload;
  }
}
