import { Request, Response } from "express";
import { formatResponse } from "../util/formatRepsone";
import { TExpenseCategory } from "../util/types";
import { EStatus } from "../util/types/enums";
import { ExpenseCategoryService } from "../services/expense_category.service";

const expenseCategoryService = new ExpenseCategoryService();
export class ExpenseCategoryController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "100";
      let categories = await expenseCategoryService.getExpenseCategories(page, limit);
      return res.status(200).send(formatResponse(true, "", categories));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let category = await expenseCategoryService.getExpenseCategory(req.params.id);
      return res.status(200).send(formatResponse(true, "", category));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }



  async create(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let category: TExpenseCategory = await expenseCategoryService.createExpenseCategory(req.body);
      return res
        .status(201)
        .send(formatResponse(true, "Category created successfully", category));
    } catch (e: any) {
      let success:boolean = <boolean>e.success?e.success:false
      return res
        .status(e.statusCode?e.statusCode:400)
        .send(formatResponse(success, e.message, {}));
    }
  }
  async update(req: Request, res: Response) {
    try {
      let category: TExpenseCategory = await expenseCategoryService.updateExpenseCategory(
        req.params.id,
        req.body
      );
      return res
        .status(200)
        .send(formatResponse(true, "Category updated successfully", category));
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
      let category = await expenseCategoryService.updateStatus(req.params.id, action);
      return res
        .status(201)
        .send(
          formatResponse(true, "Expense category deleted successfully", category)
        );
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let category: TExpenseCategory = await expenseCategoryService.deleteExpenseCategory(req.params.id);
      return res
        .status(200)
        .send(formatResponse(true, "Category deleted successfully", category));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }
}
