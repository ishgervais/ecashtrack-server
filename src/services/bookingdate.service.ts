import { BookingDate } from "../models/BookingDate.model"
import { ApiError } from "../util/ApiError"
import { getPaginationProps } from "../util/getPagination"
import { TBookingDate } from "../util/types"
import { EStatus } from "../util/types/enums"
import { HistoryLogsService } from "./history.service"
const historyLogsService = new HistoryLogsService()

export class BookingDateService {
  async getBookingDates(page: string, limit: string) {
    let dates = await BookingDate.paginate(
      {},
      getPaginationProps(parseInt(page), parseInt(limit), "")
    )
    return dates
  }

  async getBookingDate(id: string) {
    let date = await BookingDate.findById(id)
    if (!date) {
      throw new ApiError(false, 404, "Booking date not found")
    }
    return date
  }

  //   get booking dates by status  [ACTIVE,INACTIVE]
  async getBookingDatesByStatus(page: string, limit: string, status: EStatus) {
    let q = status.toUpperCase()
    let dates = await BookingDate.paginate(
      { status: q },
      getPaginationProps(parseInt(page), parseInt(limit), "")
    )
    if (!dates) {
      throw new ApiError(false, 404, "Booking dates not found")
    }
    return dates
  }

  async createBookingDate(body: TBookingDate) {
    let date = await BookingDate.create(body)
    if (!date) {
      throw new ApiError(false, 400, "Registration failed")
    }
    const logObj = {
      activity:'Created new booking date:  '+ new Date(date.date).toDateString(),
      created_by:body.created_by,
    }
    await historyLogsService.createHistoryLog(logObj)
    return date
  }

  async updateBookingDate(_id: string, body: TBookingDate) {
    try {
      let dateToUpdate: TBookingDate = await BookingDate.findById(_id)
      if (dateToUpdate) {
        let upBudget = await BookingDate.findByIdAndUpdate(_id, body, {
          new: true
        })
        if (upBudget) {
          return upBudget
        } else throw new ApiError(false, 400, "Updating failed")
      } else throw new ApiError(false, 404, "Booking date not found")
    } catch (e: any) {
      throw new ApiError(false, 400, e.message)
    }
  }

  async updateStatus(_id: string, action: EStatus) {
    let dateUpdate: TBookingDate = await BookingDate.findById(_id)
    if (dateUpdate) {
      let newUpBookingDate = await BookingDate.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      )
      if (newUpBookingDate) {
        const logObj = {
          activity:'Deleted booking date:  '+ new Date(newUpBookingDate.date).toDateString(),
          created_by:newUpBookingDate.created_by,
        }
        await historyLogsService.createHistoryLog(logObj)
        return newUpBookingDate
      } else throw new ApiError(false, 404, "Booking date not found")
    }
  }

  async deleteBookingDate(_id: string) {
    let delBookingDate: TBookingDate = await BookingDate.findById(_id)
    if (!delBookingDate) {
      throw new ApiError(false, 404, "Booking date not found")
    } else {
      let delBookingDate = await BookingDate.findByIdAndRemove(_id)
      return delBookingDate
    }
  }
}
