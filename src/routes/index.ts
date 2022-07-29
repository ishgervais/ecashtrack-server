import { Router } from "express";
import { protect } from "../middlewares/auth";
import user_routes from "../routes/user.routes";
import budget_routes from "../routes/budget.routes";
import expense_category_routes from "../routes/expense_category.routes";
import expense_routes from "../routes/expenses.routes";
import bookingDate_routes from '../routes/bookingDate.routes'
import booking_routes from '../routes/booking.routes'
import debt_routes from '../routes/debt.routes'
import income_routes from '../routes/income.routes'
import income_source_routes from '../routes/income_source.routes'
import history_logs_routes from '../routes/history_logs.routes'
import total_counts_routes from '../routes/total_counts.routes'

const router = Router();
router.use("/user", user_routes);
router.use("/budget", protect, budget_routes);
router.use("/expense-category", protect, expense_category_routes);
router.use("/expense", protect, expense_routes);
router.use("/booking-date", protect, bookingDate_routes);
router.use("/booking", protect, booking_routes);
router.use("/debt", protect, debt_routes);
router.use("/income", protect, income_routes);
router.use("/income-source", protect, income_source_routes);
router.use("/history-logs", protect, history_logs_routes);
router.use("/total-counts", protect, total_counts_routes);


export default router;
