import { User } from "../entities";
import { EntityId, Email } from "../value-objects";

export interface IUserRepository {
  findById(id: EntityId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: EntityId): Promise<void>;
}
