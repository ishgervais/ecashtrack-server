import { Request, Response } from "express"
import { formatResponse } from "../util/formatRepsone"
import { TExpense } from "../util/types"
import { ExpenseService } from "../services/expense.service"
import { EStatus } from "../util/types/enums"

const expenseService = new ExpenseService()
export class ExpenseController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "100"
      let users = await expenseService.getAll(page, limit)
      return res.status(200).send(formatResponse(true, "", users))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let user = await expenseService.getOne(req.params.id)
      return res.status(200).send(formatResponse(true, "", user))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  // get expenses by user id

  async getUserExpenses(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "100"
      let expenses = await expenseService.getAllByUserId(
        page,
        limit,
        req.params.id
      )
      return res.status(200).send(formatResponse(true, "", expenses))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  // get expenses by budget id

  async getBudgetExpenses(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "100"
      let expenses = await expenseService.getAllByBudgetId(
        page,
        limit,
        req.params.id
      )
      return res.status(200).send(formatResponse(true, "", expenses))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  // get expenses by category id

  async getCategoryExpenses(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "100"
      let expenses = await expenseService.getAllByCategoryId(
        page,
        limit,
        req.params.id
      )
      return res.status(200).send(formatResponse(true, "", expenses))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let budget: TExpense = await expenseService.createOne(req.body)
      return res
        .status(201)
        .send(formatResponse(true, "Expense created successfully", budget))
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
      let budget: TExpense = await expenseService.updateOne(
        req.params.id,
        req.body
      )
      return res
        .status(200)
        .send(formatResponse(true, "Expense updated successfully", budget))
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
      let budget = await expenseService.updateStatus(req.params.id, action)
      return res
        .status(201)
        .send(
          formatResponse(true, "Expense deleted successfully", budget)
        )
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async delete(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let budget: TExpense = await expenseService.deleteExpense(
        req.params.id,
        req.body
      )
      return res
        .status(200)
        .send(formatResponse(true, "Expense deleted successfully", budget))
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
      let bookings: TExpense = await expenseService.getExpensesByYear(year)
      return res.status(200).send(formatResponse(true, "Data found", bookings))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async getByYearAndCategory(req: Request, res: Response) {
    try {
      let year: number = parseInt(req.params.year)
      let cat_id: string = req.query.category as string
      let bookings: TExpense = await expenseService.getExpenseByYearAndCategory(cat_id,year)
      return res.status(200).send(formatResponse(true, "Data found", bookings))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }
}
