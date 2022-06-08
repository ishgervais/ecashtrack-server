import { Booking } from "../models/Booking.model"
import { Expense } from "../models/expense.model"
import { ApiError } from "../util/ApiError"
import { EStatus } from "../util/types/enums"
export class TotalCountsService {
  async getTotalCountsForTheCurrentYear(user_id:string) {
    try {
      // for expenses
      let year = new Date().getFullYear()
      let expenses = await Expense.find({ created_by:user_id, year: year, status:EStatus.ACTIVE })
      let totalAmountOnExpenses = 0
      let totalExpenses = 0
      for (let expense of expenses) {
        totalExpenses++
        totalAmountOnExpenses += expense.amount
      }
      // for bookings count
      let bookings = await Booking.find({ year: year, status:EStatus.ACTIVE  })
      let totalBookings = 0
      let totalBookingsAmount = 0
      let totalEstimatedBoookingAmount = 0

      for (let book of bookings) {
        totalBookings++
        totalBookingsAmount += book.payment
        totalEstimatedBoookingAmount += book.estimated_payment
      }
      return({
          bookings:totalBookings,
          bookingAmount:totalBookingsAmount,
          estimatedBookingAmount:totalEstimatedBoookingAmount,
          expenses:totalExpenses,
          expensesAmount:totalAmountOnExpenses

      })
    } catch (err: any) {
      throw new ApiError(false, 400, err.message)
    }
  }
}
