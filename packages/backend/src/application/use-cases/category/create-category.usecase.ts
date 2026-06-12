import type { ICategoryRepository } from "../../../domain/ports";
import { Category } from "../../../domain/entities";
import { EntityId } from "../../../domain/value-objects";
import { ConflictError, NotFoundError } from "../../../domain/errors";
import { ok, fail, Result } from "../../../domain/errors";
import type { CreateCategoryDto, CategoryResponse } from "../../dto";

export class CreateCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(
    dto: CreateCategoryDto,
    userId: EntityId
  ): Promise<Result<CategoryResponse>> {
    const existing = await this.categoryRepo.findAllByUserId(userId);
    if (existing.some((c) => c.name.toLowerCase() === dto.name.toLowerCase())) {
      return fail(new ConflictError("Category name already exists"));
    }

    const category = Category.create(dto.name, dto.icon, dto.color, userId);
    await this.categoryRepo.create(category);

    return ok({
      id: category.id.value,
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
  }
}
