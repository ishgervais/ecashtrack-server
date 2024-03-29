import { Booking } from "../models/Booking.model"
import { Debt } from "../models/Debt.model"
import { Expense } from "../models/expense.model"
import { ApiError } from "../util/ApiError"
import { EStatus } from "../util/types/enums"
import { Income } from "../models/Income.model"
export class TotalCountsService {
  async getTotalCountsForTheCurrentYear(user_id: string) {
    try {
      // for expenses
      let year = new Date().getFullYear()
      let expenses = await Expense.find({
        created_by: user_id,
        year: year,
        status: EStatus.ACTIVE
      })
      let totalAmountOnExpenses = 0
      let totalExpenses = 0
      for (let expense of expenses) {
        totalExpenses++
        totalAmountOnExpenses += expense.amount
      }
      // for bookings count
      let bookings = await Booking.find({ year: year, status: EStatus.ACTIVE })
      let totalBookings = 0
      let totalBookingsAmount = 0
      let totalEstimatedBoookingAmount = 0

      for (let book of bookings) {
        totalBookings++
        totalBookingsAmount += book.payment
        totalEstimatedBoookingAmount += book.estimated_payment
      }

      // debts counter

      // for bookings count
      let debts = await Debt.find({
        created_by: user_id,
        year: year,
        status: EStatus.ACTIVE
      })
      let totalDebts = 0
      let totalDebtsAmount = 0
      let totalEstimatedDebtAmount = 0

      for (let debt of debts) {
        totalDebts++
        totalDebtsAmount += debt.payment
        // to be fixed later
        // debt.payment_status === EPaymentStatus.PENDING && (totalEstimatedDebtAmount += debt.estimated_payment)
        totalEstimatedDebtAmount += debt.estimated_payment
      }

      // for income
      let incomes = await Income.find({
        created_by: user_id,
        year: year,
        status: EStatus.ACTIVE
      })
      let totalIncomes = 0
      let totalIncomesAmount = 0

      for (let income of incomes) {
        totalIncomes++
        totalIncomesAmount += income.amount
      }

      return {
        bookings: totalBookings,
        bookingAmount: totalBookingsAmount,
        estimatedBookingAmount: totalEstimatedBoookingAmount,
        expenses: totalExpenses,
        expensesAmount: totalAmountOnExpenses,

        // debts
        debts: totalDebts,
        debtsAmount: totalDebtsAmount,
        estimatedDebtsAmount: totalEstimatedDebtAmount,

        // incomes

        incomes: totalIncomes,
        incomesAmount: totalIncomesAmount
      }
    } catch (err: any) {
      throw new ApiError(false, 400, err.message)
    }
  }
}
