import { Request, Response } from "express";
import { formatResponse } from "../util/formatRepsone";
import { TIncomeSource } from "../util/types";
import { EStatus } from "../util/types/enums";
import { IncomeSourceService } from "../services/IncomeSource.service";

const incomeSourceService = new IncomeSourceService();
export class IncomeSourceController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1";
      let limit: any = req.query.limit || "100";
      let data = await incomeSourceService.getAllIncomeSources(page, limit,req.body.user_id  );
      return res.status(200).send(formatResponse(true, "", data));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let incomeSource = await incomeSourceService.getIncomeSource(req.params.id);
      return res.status(200).send(formatResponse(true, "", incomeSource));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }



  async create(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let incomeSource: TIncomeSource = await incomeSourceService.createIncomeSource(req.body);
      return res
        .status(201)
        .send(formatResponse(true, "Income source created successfully", incomeSource));
    } catch (e: any) {
      let success:boolean = <boolean>e.success?e.success:false
      return res
        .status(e.statusCode?e.statusCode:400)
        .send(formatResponse(success, e.message, {}));
    }
  }
  async update(req: Request, res: Response) {
    try {
      let incomeSource: TIncomeSource = await incomeSourceService.updateIncomeSource(
        req.params.id,
        req.body
      );
      return res
        .status(200)
        .send(formatResponse(true, "Income source updated successfully", incomeSource));
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
      let incomeSource = await incomeSourceService.updateStatus(req.params.id, action);
      return res
        .status(201)
        .send(
          formatResponse(true, "Income source deleted successfully", incomeSource)
        );
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let incomeSource: TIncomeSource = await incomeSourceService.deleteIncomeSource(req.params.id);
      return res
        .status(200)
        .send(formatResponse(true, "Income source deleted successfully", incomeSource));
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}));
    }
  }
}
