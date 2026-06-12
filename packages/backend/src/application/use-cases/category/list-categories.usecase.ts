import type { ICategoryRepository } from "../../../domain/ports";
import { EntityId } from "../../../domain/value-objects";
import { ok, Result } from "../../../domain/errors";
import type { CategoryResponse } from "../../dto";

export class ListCategoriesUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(userId: EntityId): Promise<Result<CategoryResponse[]>> {
    const categories = await this.categoryRepo.findAllByUserId(userId);

    return ok(
      categories.map((c) => ({
        id: c.id.value,
        name: c.name,
        icon: c.icon,
        color: c.color,
      }))
    );
  }
}
