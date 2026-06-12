import { eq } from "drizzle-orm";
import { IUserRepository } from "../../../domain/ports";
import { User } from "../../../domain/entities";
import { EntityId, Email } from "../../../domain/value-objects";
import { NotFoundError } from "../../../domain/errors";
import type { DrizzleDB } from "../sqlite/connection";
import { users } from "../sqlite/schema";
import { UserMapper } from "../mappers";

export class DrizzleUserRepository implements IUserRepository {
  private mapper = new UserMapper();

  constructor(private db: DrizzleDB) {}

  async findById(id: EntityId): Promise<User | null> {
    const row = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id.value))
      .get();
    return row ? this.mapper.toDomain(row) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.value))
      .get();
    return row ? this.mapper.toDomain(row) : null;
  }

  async create(user: User): Promise<User> {
    await this.db.insert(users).values(this.mapper.toDrizzle(user)).run();
    return user;
  }

  async update(user: User): Promise<User> {
    const result = await this.db
      .update(users)
      .set(this.mapper.toDrizzle(user))
      .where(eq(users.id, user.id.value))
      .run();
    if (result.changes === 0) {
      throw new NotFoundError("User", user.id.value);
    }
    return user;
  }

  async delete(id: EntityId): Promise<void> {
    const result = await this.db
      .delete(users)
      .where(eq(users.id, id.value))
      .run();
    if (result.changes === 0) {
      throw new NotFoundError("User", id.value);
    }
  }
}
