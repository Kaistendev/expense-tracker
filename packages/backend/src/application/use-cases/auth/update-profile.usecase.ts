import type { IUserRepository } from "../../../domain/ports";
import type { ILogger } from "../../ports";
import { EntityId } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { UpdateProfileDto, UserProfileResponse } from "../../dto";

export class UpdateProfileUseCase {
  constructor(
    private userRepo: IUserRepository,
    private logger: ILogger
  ) {}

  async execute(
    userId: EntityId,
    dto: UpdateProfileDto
  ): Promise<Result<UserProfileResponse>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return fail(new NotFoundError("User", userId.value));
    }

    user.updateProfile(dto.name);
    await this.userRepo.update(user);

    this.logger.info("User profile updated", { userId: userId.value });

    return ok({
      user: {
        id: user.id.value,
        name: user.name,
        email: user.email.value,
      },
    });
  }
}