import { EntityId } from "../value-objects";

export interface CategoryProps {
  id: EntityId;
  name: string;
  icon: string;
  color: string;
  userId: EntityId;
  createdAt: Date;
}

export class Category {
  private constructor(private readonly props: CategoryProps) {}

  static create(
    name: string,
    icon: string,
    color: string,
    userId: EntityId
  ): Category {
    return new Category({
      id: EntityId.create(),
      name: name.trim(),
      icon,
      color,
      userId,
      createdAt: new Date(),
    });
  }

  static from(props: CategoryProps): Category {
    return new Category(props);
  }

  get id(): EntityId { return this.props.id; }
  get name(): string { return this.props.name; }
  get icon(): string { return this.props.icon; }
  get color(): string { return this.props.color; }
  get userId(): EntityId { return this.props.userId; }
  get createdAt(): Date { return new Date(this.props.createdAt); }

  update(name: string, icon: string, color: string): void {
    this.props.name = name.trim();
    this.props.icon = icon;
    this.props.color = color;
  }

  belongsTo(userId: EntityId): boolean {
    return this.props.userId.equals(userId);
  }

  equals(other: Category): boolean {
    return this.props.id.equals(other.props.id);
  }
}
