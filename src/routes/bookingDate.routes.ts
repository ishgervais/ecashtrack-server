import { Router } from "express";
import { BookingDateController } from "../controllers/bookingDate.controller";
import { protect } from "../middlewares/auth";
const router = Router();
const bookingDateController = new BookingDateController();

router.get("/all", bookingDateController.getAll);
router.get("/status/:status", bookingDateController.getAllByStatus);

/**
 * @param id BookingDate Id
 */
router.get("/:id", bookingDateController.getOne);

/**
 * @param id BookingDate Id`
 */
router.delete("/delete/:id", bookingDateController.delete);

router.post("/create", bookingDateController.create);

/**
 * @param id BookingDate Id
 */
router.put("/update/:id", protect, bookingDateController.update);

/**
 * @param id BookingDate Id
 */
router.put("/update/:id/status", protect, bookingDateController.updateStatus);

//   authentication

export default router;
