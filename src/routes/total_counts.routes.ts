import { Router } from "express";
import { TotalCountsController } from "../controllers/total_counts.controller";
const router = Router();
const totalCountsController = new TotalCountsController();

router.get("/all", totalCountsController.getAll);

export default router;
