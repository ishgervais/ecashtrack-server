import { Router } from "express";
import { DebtController } from "../controllers/debt.controller"
const router = Router();
const debtController = new DebtController();

router.get("/all", debtController.getAll);
router.get("/status/:status", debtController.getAllByStatus);
// by payment status
router.get("/status/payment/:status", debtController.getAllByPaymentStatus);

/**
 * @param id Booking Id
 */
router.get("/:id", debtController.getOne);

/**
 * @param id Booking Id`
 */
router.delete("/delete/:id", debtController.delete);

router.post("/create", debtController.create);

/**
 * @param id Booking Id
 */
router.put("/update/:id", debtController.update);

/**
 * @param id Booking Id
 */
router.put("/update/:id/status", debtController.updateStatus);

/**
 * @param id Booking Id
 */
 router.put("/update/payment/:id/:status", debtController.updatePaymentStatus);


//  statistics 
/**
 * @param year Number
 */
 router.get("/year/:year", debtController.getByYear);

export default router;
