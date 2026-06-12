import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createCategory, listCategories, updateCategory, deleteCategory } from "../controllers/category.controller";

const router = Router();

router.use(authenticate);

router.get("/", listCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export { router as categoryRoutes };
