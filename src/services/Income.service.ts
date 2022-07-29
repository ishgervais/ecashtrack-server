import { Income } from "../models/Income.model";
import { ApiError } from "../util/ApiError";
import { getDateSeparated } from "../util/customFunctions";
import { getPaginationProps } from "../util/getPagination";
import { TIncome } from "../util/types";
import { EStatus } from "../util/types/enums";
import { HistoryLogsService } from "./history.service";

const historyLogsService = new HistoryLogsService()

export class IncomeService {
  async getAll(page: string, limit: string, user_id:string) {
    const filter = {
      created_by:user_id,
        status:EStatus.ACTIVE
    }
    let data = await Income.paginate(
      filter,
      getPaginationProps(parseInt(page), parseInt(limit),['source'])
    )
    return data;
  }

  async getAllByUserId(page: string, limit: string, user_id: string) {
    let data = await Income.paginate(
      {user:user_id},
       getPaginationProps(parseInt(page), parseInt(limit),['source'])
    );
    return data;
  }


  async getAllBySourceId(page: string, limit: string, category_id: string) {
    let data = await Income.paginate(
      {category:category_id},
       getPaginationProps(parseInt(page), parseInt(limit),['source'])
    );
    return data;
  }



  async getOne(id: string) {
    let income = await Income.findById(id).populate("source");
    if (!income) {
      throw new ApiError(false, 404, "Income not found");
    }
    return income;
  }

  async createOne(body: TIncome) {

    const {issued_date} = body

    // get these datetime from issued_date
    const {month,year} = getDateSeparated(issued_date)
    body.month = month
    body.year = year


    let income = await Income.create(body);
    if (!income) {
      throw new ApiError(false, 400, "Registration failed");
    }
    // await this.loadBudgetAmount(Income.amount,Income.budget)
    const logObj = {
      activity:'Recorded new income:  '+income.amount + " RWF",
      created_by:body.created_by,
    }
    await historyLogsService.createHistoryLog(logObj)
    return income;
  }

  async updateOne(_id: string, body: TIncome) {
    let incomeToUpdate: TIncome = await Income.findById(_id);
    if (incomeToUpdate) {
      let upIncome = await Income.findByIdAndUpdate(_id, body, {
        new: true,
      });
      if (upIncome) {
        const logObj = {
          activity:'Edit income:  '+upIncome.name,
          created_by:body.created_by,
        }
        await historyLogsService.createHistoryLog(logObj)
        return upIncome;
      } else throw new ApiError(false, 400, "Updating failed");
    } else throw new ApiError(false, 404, "Income not found");
  }

  async updateStatus(_id: string, action: EStatus) {
    let incomeUpdate: TIncome = await Income.findById(_id);
    if (incomeUpdate) {
      let newUpIncome = await Income.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      );
      if (newUpIncome) {
        const logObj = {
          activity:'Deleted income:  '+newUpIncome.name,
          created_by:newUpIncome.created_by,
        }
        await historyLogsService.createHistoryLog(logObj)
        return newUpIncome;
      } else throw new ApiError(false, 404, "Income not found");
    }
  }

  async deleteIncome(_id: string, body:TIncome) {
    let delincome: TIncome = await Income.findById(_id);
    if (!delincome) {
      throw new ApiError(false, 404, "Income not found");
    } else {
      let incomeToDelete = await Income.findByIdAndRemove(_id);
      
      const logObj = {
        activity:'Delete income:  '+incomeToDelete.name,
        created_by:body.created_by,
      }
      await historyLogsService.createHistoryLog(logObj)
      
      return incomeToDelete;
    }
  }



// statistics

async getdataByYear(user_id:string, year: number) {
  try {
    let data = await Income.find({ created_by:user_id,year, status:EStatus.ACTIVE})
    if (!data) {
      throw new ApiError(false, 404, "data not found")
    }
    return data
  } catch (e: any) {
    throw new ApiError(false, 404, e.message)
  }
}
// get income by year and 
// category : income source

async geTIncomeByYearAndSource(user_id:string,source_id: string, year:number){
  try {
    let data = await Income.find({created_by:user_id, year, source:source_id, status:EStatus.ACTIVE })
    if (!data) {
      throw new ApiError(false, 404, "data not found")
    }
    return data
  } catch (e: any) {
    throw new ApiError(false, 404, e.message)
  }
}

}
