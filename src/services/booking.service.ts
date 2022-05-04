import { Booking } from "../models/Booking.model"
import { ApiError } from "../util/ApiError"
import { getYearFromDate } from "../util/customFunctions"
import { getPaginationProps } from "../util/getPagination"
import { TBooking, TUser } from "../util/types"
import { EPaymentStatus, EStatus } from "../util/types/enums"
import { BookingDateService } from "./bookingdate.service"
import { HistoryLogsService } from "./history.service"

const bookingDateService = new BookingDateService()
const historyLogsService = new HistoryLogsService()

export class BookingService {
  async getBookings(page: string, limit: string) {
    let bookings = await Booking.paginate(
      {status:EStatus.ACTIVE},
      getPaginationProps(parseInt(page), parseInt(limit), "booking_date")
    )
    return bookings
  }

  async getBooking(id: string) {
    let booking = await Booking.findById(id).populate("booking_date")
    if (!booking) {
      throw new ApiError(false, 404, "Booking not found")
    }
    return booking
  }

  //   get Bookings by payment status  [CONFIRMED,PENDING]
  async getBookingsByPaymentStatus(
    page: string,
    limit: string,
    status: EPaymentStatus
  ) {
    let q = status.toUpperCase()
    let bookings = await Booking.paginate(
      { payment_status: q, status:EStatus.ACTIVE },
      getPaginationProps(parseInt(page), parseInt(limit), "booking_date")
    )
    if (!bookings) {
      throw new ApiError(false, 404, "Bookings not found")
    }
    return bookings
  }

  //   get Bookings by status  [ACTIVE,INACTIVE]
  async getBookingsByStatus(page: string, limit: string, status: EStatus) {
    let q = status.toUpperCase()
    let bookings = await Booking.paginate(
      { status: q },
      getPaginationProps(parseInt(page), parseInt(limit), "booking_date")
    )
    if (!bookings) {
      throw new ApiError(false, 404, "Bookings not found")
    }
    return bookings
  }

  async createBooking(body: TBooking) {
    try {

      // updating the  booking date
      // if(body.pre_payment === body.final_payment){
        let booking_date_id:string = body.booking_date as any
        let booking_date = await bookingDateService.getBookingDate(booking_date_id)
        if(booking_date){
          if(booking_date.count >= 1){
            booking_date.count = booking_date.count - 1;
            
            if(booking_date.count === 0 ){
              booking_date.status = EStatus.INACTIVE
            }
            await bookingDateService.updateBookingDate(booking_date._id, booking_date)
          }
        // }
        // booking submission here
        // get the booked date year to save in booking
        body.year= getYearFromDate(booking_date.date)
        let booking = await Booking.create(body)
        if(body.payment === body.estimated_payment){
          booking.payment_status = EPaymentStatus.CONFIRMED
        await this.updateBooking(booking._id, booking)
        }
        if (!booking) {
          throw new ApiError(false, 400, "Registration failed")
        }

        const logObj = {
          activity: "Registered new booking for client: "+booking.client_names,
          created_by: body.created_by
        }
  
        await historyLogsService.createHistoryLog(logObj)
        return booking
      }
      
  
    } catch (e: any) {
      throw new ApiError(false, 400, e.message)
    }
  }

  async updateBooking(_id: string, body: TBooking) {
    try {
      let bookingToUpdate: TBooking = await Booking.findById(_id)

      let booking_date_id:string = body.booking_date as any
      let booking_date = await bookingDateService.getBookingDate(booking_date_id)
   
        // get the booked date year to save in booking
        body.year= getYearFromDate(booking_date.date)

      if (bookingToUpdate) {
        let upBooking = await Booking.findByIdAndUpdate(_id, body, {
          new: true
        })
        if (upBooking) {
          if(upBooking.payment === upBooking.estimated_payment) {
            let newUpBooking = await Booking.findByIdAndUpdate(
              _id,
              { payment_status: EPaymentStatus.CONFIRMED},
              { new: true }
            )
            const logObj = {
              activity: "Confirmed the payment of the booking of " + newUpBooking.client_names,
              created_by: body.created_by
            }
            await historyLogsService.createHistoryLog(logObj)
          } else {
            await Booking.findByIdAndUpdate(
              _id,
              { payment_status: EPaymentStatus.PENDING},
              { new: true }
            )
          }
          const logObj = {
            activity: "Updated the booking of " + upBooking.client_names,
            created_by: body.created_by
          }
          await historyLogsService.createHistoryLog(logObj)

          return upBooking
        } else throw new ApiError(false, 400, "Updating failed")
      } else throw new ApiError(false, 404, "Booking not found")
    } catch (e: any) {
      throw new ApiError(false, 400, e.message)
    }
  }
  async updatePaymentStatus(
    _id: string,
    body: TBooking,
    status: EPaymentStatus
  ) {
    try {
      if (body.payment) {
        let bookingUpdate: TBooking = await Booking.findById(_id)
        let payment = body.payment
        let p_status: EPaymentStatus = status.toUpperCase() as EPaymentStatus
        if (bookingUpdate) {
          if (payment > 0) {
            let newUpBooking = await Booking.findByIdAndUpdate(
              _id,
              { payment_status: p_status, payment },
              { new: true }
            )
            if (newUpBooking) {
              const logObj = {
                activity:
                  "Approved the booking payment of " + newUpBooking.client_names,
                created_by: body.created_by
              }
              await historyLogsService.createHistoryLog(logObj)

              return newUpBooking
            } else throw new ApiError(false, 404, "Booking not found")
          } else {
            throw new ApiError(false, 400, "No payment provided")
          }
        }
      } else {
        throw new ApiError(false, 404, "No body found")
      }
    } catch (e: any) {
      throw new ApiError(false, 404, e.message)
    }
  }

  async updateStatus(_id: string, action: EStatus) {
    let bookingUpdate: TBooking = await Booking.findById(_id)
    if (bookingUpdate) {

      if(action === EStatus.INACTIVE){
        await Booking.findByIdAndUpdate(
          _id,
          { payment: 0 },
          { new: true }
        )
      }
      let newUpBooking = await Booking.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      )
      if (newUpBooking) {
        const logObj = {
          activity:'Deleted booking of client:  '+newUpBooking.client_names,
          created_by:newUpBooking.created_by,
        }
        await historyLogsService.createHistoryLog(logObj)
        return newUpBooking
      } else throw new ApiError(false, 404, "Booking not found")
    }
  }

  async deleteBooking(_id: string, created_by: TUser) {
    let delBooking: TBooking = await Booking.findById(_id)
    if (!delBooking) {
      throw new ApiError(false, 404, "Booking not found")
    } else {
      let delBooking = await Booking.findByIdAndRemove(_id)
      const logObj = {
        activity: "Deleted the booking record " + delBooking.client_names,
        created_by: created_by
      }
      await historyLogsService.createHistoryLog(logObj)
      return delBooking
    }
  }

  // statistics

  async getBookingsByYear(page:string, limit:string, year: number) {
    try {
      let bookings = await Booking.paginate(
        {year, status:EStatus.ACTIVE},
        getPaginationProps(parseInt(page), parseInt(limit), "booking_date")
      )
      if (!bookings) {
        throw new ApiError(false, 404, "Bookings not found")
      }
      return bookings
    } catch (e: any) {
      throw new ApiError(false, 404, e.message)
    }
  }
}
