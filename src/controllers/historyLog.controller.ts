import { Request, Response } from "express"
import { formatResponse } from "../util/formatRepsone"
import { TBooking } from "../util/types"
import { HistoryLogsService } from "../services/history.service"

const historyLogsService = new HistoryLogsService()
export class HistoryLogController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "5000"
      let users = await historyLogsService.getHistoryLogs(page, limit)
      return res.status(200).send(formatResponse(true, "", users))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async getByUser(req: Request, res: Response) {
    try {
      let user = await historyLogsService.getHistoryLogsByUser(req.params.id)
      return res.status(200).send(formatResponse(true, "", user))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body.created_by = req.body.user_id
      let booking: TBooking = await historyLogsService.createHistoryLog(
        req.body
      )
      return res
        .status(201)
        .send(formatResponse(true, "Booking created successfully", booking))
    } catch (e: any) {
      let success: boolean = <boolean>e.success ? e.success : false
      return res
        .status(e.statusCode ? e.statusCode : 400)
        .send(formatResponse(success, e.message, {}))
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let booking: TBooking = await historyLogsService.deleteHistoryLog(
        req.params.id
      )
      return res
        .status(200)
        .send(formatResponse(true, "Booking deleted successfully", booking))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }
}
