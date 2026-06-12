import { describe, it, expect } from "vitest";
import { EntityId } from "../../../../src/domain/value-objects";

describe("EntityId", () => {
  it("creates a valid UUID", () => {
    const id = EntityId.create();
    expect(id.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("creates from an existing string", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const id = EntityId.from(uuid);
    expect(id.value).toBe(uuid);
  });

  it("trims whitespace", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const id = EntityId.from(`  ${uuid}  `);
    expect(id.value).toBe(uuid);
  });

  it("throws on empty string", () => {
    expect(() => EntityId.from("")).toThrow("EntityId cannot be empty");
    expect(() => EntityId.from("   ")).toThrow("EntityId cannot be empty");
  });

  it("compares equality", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const a = EntityId.from(uuid);
    const b = EntityId.from(uuid);
    expect(a.equals(b)).toBe(true);
  });

  it("detects inequality", () => {
    const a = EntityId.create();
    const b = EntityId.create();
    expect(a.equals(b)).toBe(false);
  });

  it("converts to string", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const id = EntityId.from(uuid);
    expect(id.toString()).toBe(uuid);
  });
});
