import { z } from "zod";

export const CreateExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(200),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  type: z.enum(["income", "expense"]).default("expense"),
  categoryId: z.string().min(1, "Category is required"),
});

export const UpdateExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  description: z.string().min(1).max(200).optional(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date").optional(),
  type: z.enum(["income", "expense"]).optional(),
  categoryId: z.string().min(1).optional(),
});

export const ExpenseFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  search: z.string().optional(),
});

export type CreateExpenseDto = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof UpdateExpenseSchema>;
export type ExpenseFiltersDto = z.infer<typeof ExpenseFiltersSchema>;

export interface ExpenseResponse {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedExpensesResponse {
  data: ExpenseResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
