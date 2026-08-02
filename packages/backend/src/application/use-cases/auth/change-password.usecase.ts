import type { IUserRepository } from "../../../domain/ports";
import type { IAuthService, ILogger } from "../../ports";
import { EntityId } from "../../../domain/value-objects";
import { NotFoundError, UnauthorizedError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { ChangePasswordDto } from "../../dto";

export class ChangePasswordUseCase {
  constructor(
    private userRepo: IUserRepository,
    private auth: IAuthService,
    private logger: ILogger
  ) {}

  async execute(
    userId: EntityId,
    dto: ChangePasswordDto
  ): Promise<Result<void>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return fail(new NotFoundError("User", userId.value));
    }

    const valid = await this.auth.comparePassword(
      dto.currentPassword,
      user.passwordHash
    );
    if (!valid) {
      return fail(new UnauthorizedError("Current password is incorrect"));
    }

    const passwordHash = await this.auth.hashPassword(dto.newPassword);
    user.updatePassword(passwordHash);
    await this.userRepo.update(user);

    this.logger.info("User password changed", { userId: userId.value });

    return ok(undefined);
  }
}