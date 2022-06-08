import { Request, Response } from "express";
import { formatResponse } from "../util/formatRepsone";
import { TBooking } from "../util/types";
import { BookingService } from "../services/booking.service";
import { EPaymentStatus, EStatus } from "../util/types/enums";

const bookingService = new BookingService();
export class BookingController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "5000";
      let users = await bookingService.getBookings(page, limit, req.body.user_id);
      return res.status(200).send(formatResponse(true, "", users));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let user = await bookingService.getBooking(req.params.id);
      return res.status(200).send(formatResponse(true, "", user));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

//   get all by payment status

async getAllByPaymentStatus(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "100";
      let q:EPaymentStatus  = req.params.status as EPaymentStatus
      let bookings = await bookingService.getBookingsByPaymentStatus(page, limit, q);
      return res.status(200).send(formatResponse(true, "", bookings));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

//   get by status

async getAllByStatus(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "100";
      let q:EStatus  = req.params.status as EStatus
      let users = await bookingService.getBookingsByStatus(page, limit, q);
      return res.status(200).send(formatResponse(true, "", users));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }


  async create(req: Request, res: Response) {
    try {
        req.body.created_by = req.body.user_id
      let booking: TBooking = await bookingService.createBooking(req.body);
      return res
        .status(201)
        .send(formatResponse(true, "Booking created successfully", booking));
    } catch (e: any) {
      let success:boolean = <boolean>e.success?e.success:false
      return res
        .status(e.statusCode?e.statusCode:400)
        .send(formatResponse(success, e.message, {}));
    }
  }
  async update(req: Request, res: Response) {
    try {
      let booking: TBooking = await bookingService.updateBooking(
        req.params.id,
        req.body
      );
      return res
        .status(200)
        .send(formatResponse(true, "Booking updated successfully", booking));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

//   update payment status
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      let status: EPaymentStatus = req.params.status as EPaymentStatus
      let booking = await bookingService.updatePaymentStatus(req.params.id, req.body, status);
      return res
        .status(201)
        .send(
          formatResponse(true, "Payment status changed", booking)
        );
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  //   activate and diactivate
  async updateStatus(req: Request, res: Response) {
    try {
      let action: EStatus = <EStatus>req.query.action;
      let booking = await bookingService.updateStatus(req.params.id, action);
      return res
        .status(201)
        .send(
          formatResponse(true, "Booking deleted successfully", booking) // temporary delete
        );
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let booking: TBooking = await bookingService.deleteBooking(req.params.id, req.body.user_id);
      return res
        .status(200)
        .send(formatResponse(true, "Booking deleted successfully", booking));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  // statistics
  async getByYear(req: Request, res: Response) {
    try {
      let year:number = parseInt(req.params.year)
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "5000";
      let bookings = await bookingService.getBookingsByYear(page, limit, year);
      
      return res
        .status(200)
        .send(formatResponse(true, "Data found", bookings));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }
}
