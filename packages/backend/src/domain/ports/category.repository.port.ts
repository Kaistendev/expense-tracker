import { Category } from "../entities";
import { EntityId } from "../value-objects";

export interface ICategoryRepository {
  findById(id: EntityId): Promise<Category | null>;
  findAllByUserId(userId: EntityId): Promise<Category[]>;
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: EntityId): Promise<void>;
}
