import { HistoryLog } from "../models/HistoryLogs.model"
import { ApiError } from "../util/ApiError"
import { getPaginationProps } from "../util/getPagination"
import { THistoryLog } from "../util/types"
export class HistoryLogsService {
  async getHistoryLogs(page: string, limit: string) {
    try{
      let logs = await HistoryLog.paginate(
        {},
        getPaginationProps(parseInt(page), parseInt(limit), "created_by")
      )
      return logs
    }catch(err:any){
      throw new ApiError(false, 400, err.message)
    }
  }

  async getHistoryLogsByUser(id: string) {
    let log = await HistoryLog.findOne({user:id}).populate("created_by")
    if (!log) {
      throw new ApiError(false, 404, "History log not found")
    }
    return log
  }

  async createHistoryLog(body: THistoryLog) {
    try {
      let log = await HistoryLog.create(body)
      if (!log) {
        throw new ApiError(false, 400, "Registration failed")
      }
      return log
    } catch (e: any) {
      throw new ApiError(false, 400, "Registration failed")
    }
  }

  async deleteHistoryLog(_id: string) {
    let delHistoryLog: THistoryLog = await HistoryLog.findById(_id)
    if (!delHistoryLog) {
      throw new ApiError(false, 404, "History log not found")
    } else {
      let delHistoryLog = await HistoryLog.findByIdAndRemove(_id)
      return delHistoryLog
    }
  }
}
