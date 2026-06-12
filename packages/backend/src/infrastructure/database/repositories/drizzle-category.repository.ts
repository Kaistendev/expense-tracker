import { eq } from "drizzle-orm";
import { ICategoryRepository } from "../../../domain/ports";
import { Category } from "../../../domain/entities";
import { EntityId } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import type { DrizzleDB } from "../sqlite/connection";
import { categories } from "../sqlite/schema";
import { CategoryMapper } from "../mappers";

export class DrizzleCategoryRepository implements ICategoryRepository {
  private mapper = new CategoryMapper();

  constructor(private db: DrizzleDB) {}

  async findById(id: EntityId): Promise<Category | null> {
    const row = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id.value))
      .get();
    return row ? this.mapper.toDomain(row) : null;
  }

  async findAllByUserId(userId: EntityId): Promise<Category[]> {
    const rows = await this.db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId.value))
      .all();
    return rows.map((r) => this.mapper.toDomain(r));
  }

  async create(category: Category): Promise<Category> {
    await this.db
      .insert(categories)
      .values(this.mapper.toDrizzle(category))
      .run();
    return category;
  }

  async update(category: Category): Promise<Category> {
    const result = await this.db
      .update(categories)
      .set(this.mapper.toDrizzle(category))
      .where(eq(categories.id, category.id.value))
      .run();
    if (result.changes === 0) {
      throw new NotFoundError("Category", category.id.value);
    }
    return category;
  }

  async delete(id: EntityId): Promise<void> {
    const result = await this.db
      .delete(categories)
      .where(eq(categories.id, id.value))
      .run();
    if (result.changes === 0) {
      throw new NotFoundError("Category", id.value);
    }
  }
}
