import { Category } from "../../../domain/entities";
import { EntityId } from "../../../domain/value-objects";
import { categories } from "../sqlite/schema";

type CategoryRow = typeof categories.$inferSelect;

export class CategoryMapper {
  toDomain(row: CategoryRow): Category {
    return Category.from({
      id: EntityId.from(row.id),
      name: row.name,
      icon: row.icon,
      color: row.color,
      userId: EntityId.from(row.userId),
      createdAt: new Date(row.createdAt),
    });
  }

  toDrizzle(category: Category): typeof categories.$inferInsert {
    return {
      id: category.id.value,
      name: category.name,
      icon: category.icon,
      color: category.color,
      userId: category.userId.value,
      createdAt: category.createdAt.toISOString(),
    };
  }
}
