import type { IUserRepository } from "../../../domain/ports";
import type { IAuthService, ILogger } from "../../ports";
import { Email } from "../../../domain/value-objects";
import { NotFoundError, UnauthorizedError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { LoginDto, AuthResponse } from "../../dto";

export class LoginUseCase {
  constructor(
    private userRepo: IUserRepository,
    private auth: IAuthService,
    private logger: ILogger
  ) {}

  async execute(dto: LoginDto): Promise<Result<AuthResponse>> {
    const email = Email.create(dto.email);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      return fail(new NotFoundError("User", dto.email));
    }

    const valid = await this.auth.comparePassword(dto.password, user.passwordHash);
    if (!valid) {
      return fail(new UnauthorizedError("Invalid credentials"));
    }

    const token = this.auth.signToken({
      userId: user.id.value,
      email: user.email.value,
    });

    this.logger.info("User logged in", { userId: user.id.value });

    return ok({
      user: {
        id: user.id.value,
        name: user.name,
        email: user.email.value,
      },
      token,
    });
  }
}
