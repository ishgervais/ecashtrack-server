import { Request, Response } from "express";
import { formatResponse } from "../util/formatRepsone";
import { TBookingDate } from "../util/types";
import { BookingDateService } from "../services/bookingdate.service";
import { EStatus } from "../util/types/enums";

const bookingDateService = new BookingDateService();
export class BookingDateController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "5000";
      let users = await bookingDateService.getBookingDates(page, limit);
      return res.status(200).send(formatResponse(true, "", users));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let user = await bookingDateService.getBookingDate(req.params.id);
      return res.status(200).send(formatResponse(true, "", user));
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
      let users = await bookingDateService.getBookingDatesByStatus(page, limit, q);
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
      let bookingDate: TBookingDate = await bookingDateService.createBookingDate(req.body);
      return res
        .status(201)
        .send(formatResponse(true, "Booking Date created successfully", bookingDate));
    } catch (e: any) {
      let success:boolean = <boolean>e.success?e.success:false
      return res
        .status(e.statusCode?e.statusCode:400)
        .send(formatResponse(success, e.message, {}));
    }
  }
  async update(req: Request, res: Response) {
    try {
      let bookingDate: TBookingDate = await bookingDateService.updateBookingDate(
        req.params.id,
        req.body
      );
      return res
        .status(200)
        .send(formatResponse(true, "Booking Date updated successfully", bookingDate));
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
      let bookingDate = await bookingDateService.updateStatus(req.params.id, action);
      return res
        .status(201)
        .send(
          formatResponse(true, "Booking date deleted successfully", bookingDate)
        );
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let bookingDate: TBookingDate = await bookingDateService.deleteBookingDate(req.params.id);
      return res
        .status(200)
        .send(formatResponse(true, "Booking Date deleted successfully", bookingDate));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }
}
