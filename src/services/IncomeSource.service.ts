import { IncomeSource } from "../models/IncomeSource.model";
import { ApiError } from "../util/ApiError";
import { getPaginationProps } from "../util/getPagination";
import { TIncomeSource } from "../util/types";
import { EStatus } from "../util/types/enums";
import { HistoryLogsService } from "./history.service";

const historyLogsService = new HistoryLogsService()

export class IncomeSourceService {
  async getAllIncomeSources(page: string, limit: string, user_id: string) {
    const filter = {
      created_by:user_id,
        status:EStatus.ACTIVE
    }
    let data = await IncomeSource.paginate(
      filter,
      getPaginationProps(parseInt(page), parseInt(limit))
    );
    return data;
  }


  async getIncomeSource(id: string) {
    let data = await IncomeSource.findById(id);
    if (!data) {
      throw new ApiError(false, 404, "Income not found");
    }
    return data;
  }

  async createIncomeSource(body: TIncomeSource) {
    let item = await IncomeSource.create(body);
    if (!item) {
      throw new ApiError(false, 400, "Registration failed");
    }
    const logObj = {
      activity: "Created new income source: "+item.name,
      created_by: body.created_by
    }
    await historyLogsService.createHistoryLog(logObj)
    return item;
  }

  async updateIncomeSource(_id: string, body: TIncomeSource) {
    let itemToUpdate: TIncomeSource = await IncomeSource.findById(_id);
    if (itemToUpdate) {
      let upIncomeSource = await IncomeSource.findByIdAndUpdate(_id, body, {
        new: true,
      });
      if (upIncomeSource) {
        return upIncomeSource;
      } else throw new ApiError(false, 400, "Updating failed");
    } else throw new ApiError(false, 404, "Income not found");
  }

  async updateStatus(_id: string, action: EStatus) {
    let recordToUpdate: TIncomeSource = await IncomeSource.findById(_id);
    if (recordToUpdate) {
      let newRecordUpdate = await IncomeSource.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      );
      if (newRecordUpdate) {
        const logObj = {
          activity: "Deleted income source: "+newRecordUpdate.name,
          created_by: newRecordUpdate.created_by
        }
        await historyLogsService.createHistoryLog(logObj)
        return newRecordUpdate;
      } else throw new ApiError(false, 404, "Income not found");
    }
  }

  async deleteIncomeSource(_id: string) {
    let delRecord: TIncomeSource = await IncomeSource.findById(_id);
    if (!delRecord) {
      throw new ApiError(false, 404, "Income not found");
    } else {
      let delTIncomeSource = await IncomeSource.findByIdAndRemove(_id);
      return delTIncomeSource;
    }
  }
}