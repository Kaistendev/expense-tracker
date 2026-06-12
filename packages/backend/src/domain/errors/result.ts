import { DomainError } from "./domain-error";

export type Result<T, E = DomainError> =
  | { success: true; value: T }
  | { success: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

export function fail<E>(error: E): Result<never, E> {
  return { success: false, error };
}
