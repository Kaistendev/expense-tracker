import type { ICategoryRepository } from "../../../domain/ports";
import { EntityId } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { UpdateCategoryDto, CategoryResponse } from "../../dto";

export class UpdateCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(
    id: EntityId,
    dto: UpdateCategoryDto,
    userId: EntityId
  ): Promise<Result<CategoryResponse>> {
    const category = await this.categoryRepo.findById(id);
    if (!category || !category.belongsTo(userId)) {
      return fail(new NotFoundError("Category", id.value));
    }

    category.update(
      dto.name ?? category.name,
      dto.icon ?? category.icon,
      dto.color ?? category.color
    );

    await this.categoryRepo.update(category);

    return ok({
      id: category.id.value,
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
  }
}
