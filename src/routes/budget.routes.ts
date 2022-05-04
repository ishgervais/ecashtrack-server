import { Router } from "express";
import { BudgetController } from "../controllers/budget.controller";
import { protect } from "../middlewares/auth";
const router = Router();
const budgetController = new BudgetController();

router.get("/all", budgetController.getAll);
router.get("/user/:id", budgetController.getUserBudgets);

/**
 * @param id BudgetID
 */
router.get("/:id", budgetController.getOne);

/**
 * @param id BudgetID`
 */
router.delete("/delete/:id", budgetController.delete);

router.post("/create", budgetController.create);

/**
 * @param id BudgetID
 */
router.put("/update/:id", protect, budgetController.update);

/**
 * @param id BudgetID
 */
router.put("/update/:id/status", protect, budgetController.updateStatus);

//   authentication

export default router;
