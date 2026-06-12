import { createConnection } from "../database/sqlite/connection";
import { DrizzleUserRepository } from "../database/repositories";
import { DrizzleCategoryRepository } from "../database/repositories";
import { DrizzleExpenseRepository } from "../database/repositories";
import { AuthService } from "../auth";
import { ConsoleLogger } from "../logger";
import {
  RegisterUserUseCase,
  LoginUseCase,
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
  CreateExpenseUseCase,
  ListExpensesUseCase,
  GetExpenseUseCase,
  UpdateExpenseUseCase,
  DeleteExpenseUseCase,
  GetMonthlySummaryUseCase,
} from "../../application/use-cases";

const db = createConnection();

const userRepo = new DrizzleUserRepository(db);
const categoryRepo = new DrizzleCategoryRepository(db);
const expenseRepo = new DrizzleExpenseRepository(db);
const authService = new AuthService();
const logger = new ConsoleLogger();

const registerUser = new RegisterUserUseCase(userRepo, authService, logger);
const loginUser = new LoginUseCase(userRepo, authService, logger);
const createCategory = new CreateCategoryUseCase(categoryRepo);
const listCategories = new ListCategoriesUseCase(categoryRepo);
const updateCategory = new UpdateCategoryUseCase(categoryRepo);
const deleteCategory = new DeleteCategoryUseCase(categoryRepo);
const createExpense = new CreateExpenseUseCase(expenseRepo);
const listExpenses = new ListExpensesUseCase(expenseRepo);
const getExpense = new GetExpenseUseCase(expenseRepo);
const updateExpense = new UpdateExpenseUseCase(expenseRepo);
const deleteExpense = new DeleteExpenseUseCase(expenseRepo);
const getMonthlySummary = new GetMonthlySummaryUseCase(expenseRepo);

const instances = new Map<any, any>();

function register<T>(cls: new (...args: any[]) => T, instance: T): void {
  instances.set(cls, instance);
}

function resolve<T>(cls: new (...args: any[]) => T): T {
  const instance = instances.get(cls);
  if (!instance) {
    throw new Error(`No instance registered for ${cls.name}`);
  }
  return instance;
}

register(RegisterUserUseCase, registerUser);
register(LoginUseCase, loginUser);
register(CreateCategoryUseCase, createCategory);
register(ListCategoriesUseCase, listCategories);
register(UpdateCategoryUseCase, updateCategory);
register(DeleteCategoryUseCase, deleteCategory);
register(CreateExpenseUseCase, createExpense);
register(ListExpensesUseCase, listExpenses);
register(GetExpenseUseCase, getExpense);
register(UpdateExpenseUseCase, updateExpense);
register(DeleteExpenseUseCase, deleteExpense);
register(GetMonthlySummaryUseCase, getMonthlySummary);

register(AuthService, authService);

export { resolve, instances };
