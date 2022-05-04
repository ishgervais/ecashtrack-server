import { Router } from "express";
import { HistoryLogController } from "../controllers/historyLog.controller";
const router = Router();
const historLogController = new HistoryLogController();

router.get("/all", historLogController.getAll);
/**
 * @param id UserID
 */
router.get("/:id", historLogController.getByUser);

/**
 * @param id HistoryLog ID`
 */
router.delete("/delete/:id", historLogController.delete);

router.post("/create", historLogController.create);

export default router;
