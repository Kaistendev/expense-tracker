import { v4 as uuidv4 } from "uuid";

export class EntityId {
  private constructor(private readonly _value: string) {}

  static create(): EntityId {
    return new EntityId(uuidv4());
  }

  static from(value: string): EntityId {
    if (!value?.trim()) {
      throw new Error("EntityId cannot be empty");
    }
    return new EntityId(value.trim());
  }

  get value(): string {
    return this._value;
  }

  equals(other: EntityId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
