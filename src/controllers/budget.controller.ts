import { Request, Response } from "express";
import { formatResponse } from "../util/formatRepsone";
import { TBudget } from "../util/types";
import { BudgetService } from "../services/budget.service";
import { EStatus } from "../util/types/enums";

const budgetService = new BudgetService();
export class BudgetController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "100";
      let users = await budgetService.getBudgets(page, limit);
      return res.status(200).send(formatResponse(true, "", users));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let user = await budgetService.getBudget(req.params.id);
      return res.status(200).send(formatResponse(true, "", user));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }


  // get budgets by user id

  async getUserBudgets(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "100";
      let budgets = await budgetService.getBudgetsByUserId(page, limit,req.params.id);
      return res.status(200).send(formatResponse(true, "", budgets));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }


  async create(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let budget: TBudget = await budgetService.createBudget(req.body);
      return res
        .status(201)
        .send(formatResponse(true, "Budget created successfully", budget));
    } catch (e: any) {
      let success:boolean = <boolean>e.success?e.success:false
      return res
        .status(e.statusCode?e.statusCode:400)
        .send(formatResponse(success, e.message, {}));
    }
  }
  async update(req: Request, res: Response) {
    try {
      let budget: TBudget = await budgetService.updateBudget(
        req.params.id,
        req.body
      );
      return res
        .status(200)
        .send(formatResponse(true, "Budget updated successfully", budget));
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
      let budget = await budgetService.updateStatus(req.params.id, action);
      return res
        .status(201)
        .send(
          formatResponse(true, "Status changed [INACTIVE / ACTIVE]", budget)
        );
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let budget: TBudget = await budgetService.deleteBudget(req.params.id);
      return res
        .status(200)
        .send(formatResponse(true, "Budget deleted successfully", budget));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }
}
