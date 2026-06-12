import { EntityId, Money, DateRange } from "../value-objects";

export type TransactionType = "income" | "expense";

export interface ExpenseProps {
  id: EntityId;
  amount: Money;
  description: string;
  date: Date;
  type: TransactionType;
  categoryId: EntityId;
  userId: EntityId;
  createdAt: Date;
  updatedAt: Date;
}

export class Expense {
  private constructor(private readonly props: ExpenseProps) {}

  static create(
    amount: Money,
    description: string,
    date: Date,
    categoryId: EntityId,
    userId: EntityId,
    type: TransactionType = "expense"
  ): Expense {
    const now = new Date();
    return new Expense({
      id: EntityId.create(),
      amount,
      description: description.trim(),
      date,
      type,
      categoryId,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static from(props: ExpenseProps): Expense {
    return new Expense(props);
  }

  get id(): EntityId { return this.props.id; }
  get amount(): Money { return this.props.amount; }
  get description(): string { return this.props.description; }
  get date(): Date { return new Date(this.props.date); }
  get type(): TransactionType { return this.props.type; }
  get categoryId(): EntityId { return this.props.categoryId; }
  get userId(): EntityId { return this.props.userId; }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  update(params: {
    amount?: Money;
    description?: string;
    date?: Date;
    type?: TransactionType;
    categoryId?: EntityId;
  }): void {
    if (params.amount !== undefined) this.props.amount = params.amount;
    if (params.description !== undefined) this.props.description = params.description.trim();
    if (params.date !== undefined) this.props.date = params.date;
    if (params.type !== undefined) this.props.type = params.type;
    if (params.categoryId !== undefined) this.props.categoryId = params.categoryId;
    this.props.updatedAt = new Date();
  }

  belongsTo(userId: EntityId): boolean {
    return this.props.userId.equals(userId);
  }

  isInDateRange(range: DateRange): boolean {
    return range.contains(this.props.date);
  }

  equals(other: Expense): boolean {
    return this.props.id.equals(other.props.id);
  }
}
