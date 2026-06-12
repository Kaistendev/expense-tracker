import { describe, it, expect } from "vitest";
import { Category } from "../../../../src/domain/entities";
import { EntityId } from "../../../../src/domain/value-objects";

describe("Category", () => {
  const userId = EntityId.create();

  it("creates a category with valid data", () => {
    const category = Category.create("Food", "🍕", "#FF5733", userId);
    expect(category.name).toBe("Food");
    expect(category.icon).toBe("🍕");
    expect(category.color).toBe("#FF5733");
    expect(category.userId.equals(userId)).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  it("trims name on create", () => {
    const category = Category.create("  Food  ", "🍕", "#FF5733", userId);
    expect(category.name).toBe("Food");
  });

  it("reconstructs from props", () => {
    const original = Category.create("Food", "🍕", "#FF5733", userId);
    const restored = Category.from({
      id: original.id,
      name: original.name,
      icon: original.icon,
      color: original.color,
      userId: original.userId,
      createdAt: original.createdAt,
    });
    expect(restored.equals(original)).toBe(true);
  });

  it("updates properties", () => {
    const category = Category.create("Food", "🍕", "#FF5733", userId);
    category.update("Drinks", "🥤", "#33FF57");
    expect(category.name).toBe("Drinks");
    expect(category.icon).toBe("🥤");
    expect(category.color).toBe("#33FF57");
  });

  it("checks ownership", () => {
    const category = Category.create("Food", "🍕", "#FF5733", userId);
    expect(category.belongsTo(userId)).toBe(true);
    expect(category.belongsTo(EntityId.create())).toBe(false);
  });
});
