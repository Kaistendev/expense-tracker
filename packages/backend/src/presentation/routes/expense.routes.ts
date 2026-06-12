import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createExpense, listExpenses, getExpense, updateExpense, deleteExpense } from "../controllers/expense.controller";

const router = Router();

router.use(authenticate);

router.get("/", listExpenses);
router.post("/", createExpense);
router.get("/:id", getExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export { router as expenseRoutes };
