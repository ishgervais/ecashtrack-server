import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
const router = Router();
const bookingController = new BookingController();

router.get("/all", bookingController.getAll);
router.get("/status/:status", bookingController.getAllByStatus);
// by payment status
router.get("/status/payment/:status", bookingController.getAllByPaymentStatus);

/**
 * @param id Booking Id
 */
router.get("/:id", bookingController.getOne);

/**
 * @param id Booking Id`
 */
router.delete("/delete/:id", bookingController.delete);

router.post("/create", bookingController.create);

/**
 * @param id Booking Id
 */
router.put("/update/:id", bookingController.update);

/**
 * @param id Booking Id
 */
router.put("/update/:id/status", bookingController.updateStatus);

/**
 * @param id Booking Id
 */
 router.put("/update/payment/:id/:status", bookingController.updatePaymentStatus);


//  statistics 
/**
 * @param year Number
 */
 router.get("/year/:year", bookingController.getByYear);

export default router;
