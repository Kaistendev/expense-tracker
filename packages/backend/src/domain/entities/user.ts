import { EntityId, Email } from "../value-objects";

export interface UserProps {
  id: EntityId;
  name: string;
  email: Email;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(
    name: string,
    email: Email,
    passwordHash: string
  ): User {
    const now = new Date();
    return new User({
      id: EntityId.create(),
      name: name.trim(),
      email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });
  }

  static from(props: UserProps): User {
    return new User(props);
  }

  get id(): EntityId { return this.props.id; }
  get name(): string { return this.props.name; }
  get email(): Email { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  updateProfile(name: string): void {
    this.props.name = name.trim();
    this.props.updatedAt = new Date();
  }

  equals(other: User): boolean {
    return this.props.id.equals(other.props.id);
  }
}
