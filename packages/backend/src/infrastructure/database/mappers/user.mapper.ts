import { User } from "../../../domain/entities";
import { EntityId, Email } from "../../../domain/value-objects";
import { users } from "../sqlite/schema";

type UserRow = typeof users.$inferSelect;

export class UserMapper {
  toDomain(row: UserRow): User {
    return User.from({
      id: EntityId.from(row.id),
      name: row.name,
      email: Email.create(row.email),
      passwordHash: row.passwordHash,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  toDrizzle(user: User): typeof users.$inferInsert {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
