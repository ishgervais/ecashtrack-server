import { Request, Response } from "express"
import { formatResponse } from "../util/formatRepsone"
import { TIncome } from "../util/types"
import { IncomeService } from "../services/Income.service"
import { EStatus } from "../util/types/enums"

const incomeService = new IncomeService()
export class IncomeController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "100"
      let users = await incomeService.getAll(page, limit, req.body.user_id)
      return res.status(200).send(formatResponse(true, "", users))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let user = await incomeService.getOne(req.params.id)
      return res.status(200).send(formatResponse(true, "", user))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  // get incomes by user id

  async getUserincomes(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "100"
      let incomes = await incomeService.getAllByUserId(
        page,
        limit,
        req.params.id
      )
      return res.status(200).send(formatResponse(true, "", incomes))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  // get incomes by source id

  async getIncomesBySource(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "100"
      let incomes = await incomeService.getAllBySourceId(
        page,
        limit,
        req.params.id
      )
      return res.status(200).send(formatResponse(true, "", incomes))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let budget: TIncome = await incomeService.createOne(req.body)
      return res
        .status(201)
        .send(formatResponse(true, "Income recorded successfully", budget))
    } catch (e: any) {
      let success: boolean = <boolean>e.success ? e.success : false
      return res
        .status(e.statusCode ? e.statusCode : 400)
        .send(formatResponse(success, e.message, {}))
    }
  }
  async update(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let budget: TIncome = await incomeService.updateOne(
        req.params.id,
        req.body
      )
      return res
        .status(200)
        .send(formatResponse(true, "Income updated successfully", budget))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }
  //   activate and diactivate
  async updateStatus(req: Request, res: Response) {
    try {
      let action: EStatus = <EStatus>req.query.action
      let budget = await incomeService.updateStatus(req.params.id, action)
      return res
        .status(201)
        .send(formatResponse(true, "Income deleted successfully", budget))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async delete(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let budget: TIncome = await incomeService.deleteIncome(
        req.params.id,
        req.body
      )
      return res
        .status(200)
        .send(formatResponse(true, "Income deleted successfully", budget))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  // statistics

  async getByYear(req: Request, res: Response) {
    try {
      let year: number = parseInt(req.params.year)
      let bookings: TIncome = await incomeService.getdataByYear(
        req.body.user_id,
        year
      )
      return res.status(200).send(formatResponse(true, "Data found", bookings))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async getByYearAndSource(req: Request, res: Response) {
    try {
      let year: number = parseInt(req.params.year)
      let cat_id: string = req.query.category as string
      let bookings: TIncome = await incomeService.geTIncomeByYearAndSource(
        req.body.user_id,
        cat_id,
        year
      )
      return res.status(200).send(formatResponse(true, "Data found", bookings))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }
}
