import { Request, Response } from "express"
import { formatResponse } from "../util/formatRepsone"
import { TBooking } from "../util/types"
import { TotalCountsService } from "../services/totalCounts.service"

const totalCountsService = new TotalCountsService()
export class TotalCountsController {
  async getAll(req: Request, res: Response) {
    try {
      let data = await totalCountsService.getTotalCountsForTheCurrentYear()
      return res.status(200).send(formatResponse(true, "", data))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

}
