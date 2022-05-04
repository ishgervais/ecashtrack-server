import { Router } from "express";
import { ExpenseCategoryController } from "../controllers/expense_category.controller";
import { protect } from "../middlewares/auth";
const router = Router();
const expenseCategoryController = new ExpenseCategoryController();

router.get("/all", expenseCategoryController.getAll);

/**
 * @param id CategoryID
 */
router.get("/:id", expenseCategoryController.getOne);

/**
 * @param id CategoryID
 */
router.delete("/delete/:id", expenseCategoryController.delete);

router.post("/create", expenseCategoryController.create);

/**
 * @param id CategoryID
 */
router.put("/update/:id", protect, expenseCategoryController.update);

/**
 * @param id CategoryID
 */
router.put("/update/:id/status", protect, expenseCategoryController.updateStatus);

//   authentication

export default router;
