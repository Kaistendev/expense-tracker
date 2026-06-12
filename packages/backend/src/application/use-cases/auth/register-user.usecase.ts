import type { IUserRepository } from "../../../domain/ports";
import type { IAuthService, ILogger } from "../../ports";
import { User } from "../../../domain/entities";
import { Email } from "../../../domain/value-objects";
import { ConflictError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { RegisterUserDto, AuthResponse } from "../../dto";

export class RegisterUserUseCase {
  constructor(
    private userRepo: IUserRepository,
    private auth: IAuthService,
    private logger: ILogger
  ) {}

  async execute(dto: RegisterUserDto): Promise<Result<AuthResponse>> {
    const email = Email.create(dto.email);

    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      return fail(new ConflictError("Email already registered"));
    }

    const passwordHash = await this.auth.hashPassword(dto.password);
    const user = User.create(dto.name, email, passwordHash);

    await this.userRepo.create(user);

    const token = this.auth.signToken({
      userId: user.id.value,
      email: user.email.value,
    });

    this.logger.info("User registered", { userId: user.id.value });

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
