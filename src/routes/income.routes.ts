import { Router } from "express"
import { IncomeController } from "../controllers/Income.controller"
import { protect } from "../middlewares/auth"
const router = Router()
const incomeController = new IncomeController()

router.get("/all", incomeController.getAll)
router.get("/user/:id", incomeController.getUserincomes)
router.get("/source/:id", incomeController.getIncomesBySource)

/**
 * @param id IncomeID
 */
router.get("/:id", incomeController.getOne)

/**
 * @param id IncomeID
 */
router.delete("/delete/:id", incomeController.delete)

router.post("/create", incomeController.create)

/**
 * @param id IncomeID
 */
router.put("/update/:id", protect, incomeController.update)

/**
 * @param id IncomeID
 */
router.put("/update/:id/status", protect, incomeController.updateStatus)

//  statistics
/**
 * @param year Number
 */
router.get("/year/:year", incomeController.getByYear)

/**
 * @param year Number
 * @query IncomeSource String
 */
router.get("/year-source/:year", incomeController.getByYearAndSource)

export default router
