import { Router } from "express";
import { IncomeSourceController } from "../controllers/IncomeSource.controller";
import { protect } from "../middlewares/auth";
const router = Router();
const incomeSourceController = new IncomeSourceController();

router.get("/all", incomeSourceController.getAll);

/**
 * @param id Incomesource ID
 */
router.get("/:id", incomeSourceController.getOne);

/**
 * @param id Incomesource ID
 */
router.delete("/delete/:id", incomeSourceController.delete);

router.post("/create", incomeSourceController.create);

/**
 * @param id Incomesource ID
 */
router.put("/update/:id", protect, incomeSourceController.update);

/**
 * @param id Incomesource ID
 */
router.put("/update/:id/status", protect, incomeSourceController.updateStatus);

//   authentication

export default router;
