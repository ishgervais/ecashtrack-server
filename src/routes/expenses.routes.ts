import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";
import { protect } from "../middlewares/auth";
const router = Router();
const expenseController = new ExpenseController();

router.get("/all", expenseController.getAll);
router.get("/user/:id", expenseController.getUserExpenses);
router.get("/budget/:id", expenseController.getBudgetExpenses);
router.get("/category/:id", expenseController.getCategoryExpenses);

/**
 * @param id ExpenseID
 */
router.get("/:id", expenseController.getOne);

/**
 * @param id ExpenseID
 */
router.delete("/delete/:id", expenseController.delete);

router.post("/create", expenseController.create);

/**
 * @param id ExpenseID
 */
router.put("/update/:id", protect, expenseController.update);

/**
 * @param id ExpenseID
 */
router.put("/update/:id/status", protect, expenseController.updateStatus);

//  statistics 
/**
 * @param year Number
 */
 router.get("/year/:year", expenseController.getByYear);

 /**
 * @param year Number
 * @query category String
 */
  router.get("/year-category/:year", expenseController.getByYearAndCategory);

export default router;
