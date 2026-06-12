export interface TokenPayload {
  userId: string;
  email: string;
}

export interface IAuthService {
  hashPassword(plain: string): Promise<string>;
  comparePassword(plain: string, hash: string): Promise<boolean>;
  signToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
}
