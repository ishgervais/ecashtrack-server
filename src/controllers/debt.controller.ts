import { Request, Response } from "express";
import { formatResponse } from "../util/formatRepsone";
import { TBooking, TDebt } from "../util/types";
import { DebtService } from "../services/debt.service";
import { EPaymentStatus, EStatus } from "../util/types/enums";

const debtService = new DebtService();
export class DebtController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "5000";
      let users = await debtService.getDebts(page, limit, req.body.user_id);
      return res.status(200).send(formatResponse(true, "", users));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let user = await debtService.getDebt(req.params.id);
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
      let bookings = await debtService.getDebtsByPaymentStatus(page, limit, q);
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
      let users = await debtService.getDebtsByStatus(page, limit, q);
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
      let booking: TBooking = await debtService.createDebt(req.body);
      return res
        .status(201)
        .send(formatResponse(true, "Debt created successfully", booking));
    } catch (e: any) {
      let success:boolean = <boolean>e.success?e.success:false
      return res
        .status(e.statusCode?e.statusCode:400)
        .send(formatResponse(success, e.message, {}));
    }
  }
  async update(req: Request, res: Response) {
    try {
      let booking: TBooking = await debtService.updateDept(
        req.params.id,
        req.body
      );
      return res
        .status(200)
        .send(formatResponse(true, "Debt updated successfully", booking));
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
      let booking = await debtService.updatePaymentStatus(req.params.id, req.body, status);
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
      let booking = await debtService.updateStatus(req.params.id, action);
      return res
        .status(201)
        .send(
          formatResponse(true, "Debt deleted successfully", booking) // temporary delete
        );
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let booking: TBooking = await debtService.deleteDebt(req.params.id, req.body.user_id);
      return res
        .status(200)
        .send(formatResponse(true, "Debt deleted successfully", booking));
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
      let debts = await debtService.getDebtByYear(req.body.user_id, year);
      
      return res
        .status(200)
        .send(formatResponse(true, "Data found", debts));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async getByYearAndCategory(req: Request, res: Response) {
    try {
      let year: number = parseInt(req.params.year)
      let cat_id: string = req.query.category as string
      let debts: TDebt = await debtService.getDebtsByYearAndCategory(req.body.user_id,cat_id,year)
      return res.status(200).send(formatResponse(true, "Data found", debts))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

}
