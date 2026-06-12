import { describe, it, expect } from "vitest";
import { DateRange } from "../../../../src/domain/value-objects";

describe("DateRange", () => {
  it("creates a valid date range", () => {
    const range = DateRange.create(new Date("2024-01-01"), new Date("2024-01-31"));
    expect(range.start).toBeInstanceOf(Date);
    expect(range.end).toBeInstanceOf(Date);
  });

  it("creates from strings", () => {
    const range = DateRange.fromStrings("2024-01-01", "2024-01-31");
    expect(range.start.toISOString().startsWith("2024-01-01")).toBe(true);
    expect(range.end.toISOString().startsWith("2024-01-31")).toBe(true);
  });

  it("throws on invalid start date", () => {
    expect(() => DateRange.create(new Date("invalid"), new Date("2024-01-31"))).toThrow("Start date is invalid");
  });

  it("throws on invalid end date", () => {
    expect(() => DateRange.create(new Date("2024-01-01"), new Date("invalid"))).toThrow("End date is invalid");
  });

  it("throws when start is after end", () => {
    expect(() => DateRange.fromStrings("2024-02-01", "2024-01-01")).toThrow("Start date must be before or equal to end date");
  });

  it("allows same start and end date", () => {
    expect(() => DateRange.fromStrings("2024-01-01", "2024-01-01")).not.toThrow();
  });

  it("checks if a date is contained", () => {
    const range = DateRange.fromStrings("2024-01-01", "2024-01-31");
    expect(range.contains(new Date("2024-01-15"))).toBe(true);
    expect(range.contains(new Date("2024-01-01"))).toBe(true);
    expect(range.contains(new Date("2024-01-31"))).toBe(true);
    expect(range.contains(new Date("2024-02-01"))).toBe(false);
    expect(range.contains(new Date("2023-12-31"))).toBe(false);
  });

  it("detects overlapping ranges", () => {
    const a = DateRange.fromStrings("2024-01-01", "2024-01-15");
    const b = DateRange.fromStrings("2024-01-10", "2024-01-20");
    const c = DateRange.fromStrings("2024-02-01", "2024-02-10");
    expect(a.overlaps(b)).toBe(true);
    expect(b.overlaps(a)).toBe(true);
    expect(a.overlaps(c)).toBe(false);
  });

  it("compares equality", () => {
    const a = DateRange.fromStrings("2024-01-01", "2024-01-31");
    const b = DateRange.fromStrings("2024-01-01", "2024-01-31");
    expect(a.equals(b)).toBe(true);
  });
});
