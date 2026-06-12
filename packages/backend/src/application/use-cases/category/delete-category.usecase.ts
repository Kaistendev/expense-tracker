import type { ICategoryRepository } from "../../../domain/ports";
import { EntityId } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";

export class DeleteCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(
    id: EntityId,
    userId: EntityId
  ): Promise<Result<void>> {
    const category = await this.categoryRepo.findById(id);
    if (!category || !category.belongsTo(userId)) {
      return fail(new NotFoundError("Category", id.value));
    }

    await this.categoryRepo.delete(id);
    return ok(undefined);
  }
}
