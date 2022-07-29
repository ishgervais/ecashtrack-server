import { Debt } from "../models/Debt.model"
import { ApiError } from "../util/ApiError"
import { getDateSeparated } from "../util/customFunctions"
import { getPaginationProps } from "../util/getPagination"
import { TDebt, TUser } from "../util/types"
import { EPaymentStatus, EStatus } from "../util/types/enums"
import { HistoryLogsService } from "./history.service"

const historyLogsService = new HistoryLogsService()

export class DebtService {
  async getDebts(page: string, limit: string,user_id: string) {

    const filter = {
      created_by:user_id,
        status:EStatus.ACTIVE
    }
    
    let debts = await Debt.paginate(
      filter,
      getPaginationProps(parseInt(page), parseInt(limit), "")
    )
    return debts
  }

  async getDebt(id: string) {
    let debt = await Debt.findById(id).populate("")
    if (!debt) {
      throw new ApiError(false, 404, " Debt not found")
    }
    return debt
  }

  //   get debts by payment status  [CONFIRMED,PENDING]
  async getDebtsByPaymentStatus(
    page: string,
    limit: string,
    status: EPaymentStatus
  ) {
    let q = status.toUpperCase()
    let debts = await Debt.paginate(
      { payment_status: q, status:EStatus.ACTIVE },
      getPaginationProps(parseInt(page), parseInt(limit), "")
    )
    if (!debts) {
      throw new ApiError(false, 404, "Debts not found")
    }
    return debts
  }

  //   get debts by status  [ACTIVE,INACTIVE]
  async getDebtsByStatus(page: string, limit: string, status: EStatus) {
    let q = status.toUpperCase()
    let debts = await Debt.paginate(
      { status: q },
      getPaginationProps(parseInt(page), parseInt(limit), "")
    )
    if (!debts) {
      throw new ApiError(false, 404, "Debts not found")
    }
    return debts
  }

  async createDebt(body: TDebt) {
    try {
        const {issued_date} = body

        const {month,year} = getDateSeparated(issued_date)
        body.month = month
        body.year = year

        let debt = await Debt.create(body)
        if(body.payment === body.estimated_payment){
          debt.payment_status = EPaymentStatus.CONFIRMED
        await this.updateDept(debt._id, debt)
        }
        if (!debt) {
          throw new ApiError(false, 400, "Registration failed")
        }

        const logObj = {
          activity: "Registered new debt in deal with: "+debt.name,
          created_by: body.created_by
        }
  
        await historyLogsService.createHistoryLog(logObj)
        return debt
      
  
    } catch (e: any) {
      throw new ApiError(false, 400, e.message)
    }
  }

  async updateDept(_id: string, body: TDebt) {
    try {
      let debtToUpdate: TDebt = await Debt.findById(_id)

      if  (debtToUpdate) {
        let upDebt = await Debt.findByIdAndUpdate(_id, body, {
          new: true
        })
        if (upDebt) {
          if(upDebt.payment === upDebt.estimated_payment) {
            let newupDebt = await Debt.findByIdAndUpdate(
              _id,
              { payment_status: EPaymentStatus.CONFIRMED},
              { new: true }
            )
            const logObj = {
              activity: "Confirmed the payment of the debt of " + newupDebt.client_names,
              created_by: body.created_by
            }
            await historyLogsService.createHistoryLog(logObj)
          } else {
            await Debt.findByIdAndUpdate(
              _id,
              { payment_status: EPaymentStatus.PENDING},
              { new: true }
            )
          }
          const logObj = {
            activity: "Updated the debt of " + upDebt.client_names,
            created_by: body.created_by
          }
          await historyLogsService.createHistoryLog(logObj)

          return upDebt
        } else throw new ApiError(false, 400, "Updating failed")
      } else throw new ApiError(false, 404, " Debt not found")
    } catch (e: any) {
      throw new ApiError(false, 400, e.message)
    }
  }
  async updatePaymentStatus(
    _id: string,
    body: TDebt,
    status: EPaymentStatus
  ) {
    try {
      if (body.payment) {
        let debtUpdate: TDebt = await Debt.findById(_id)
        let payment = body.payment
        let p_status: EPaymentStatus = status.toUpperCase() as EPaymentStatus
        if (debtUpdate) {
          if (payment > 0) {
            let newupDebt = await Debt.findByIdAndUpdate(
              _id,
              { payment_status: p_status, payment },
              { new: true }
            )
            if (newupDebt) {
              const logObj = {
                activity:
                  "Approved the debt payment of " + newupDebt.name,
                created_by: body.created_by
              }
              await historyLogsService.createHistoryLog(logObj)

              return newupDebt
            } else throw new ApiError(false, 404, " Debt not found")
          } else {
            throw new ApiError(false, 400, "No payment provided")
          }
        }
      } else {
        throw new ApiError(false, 404, "No body found")
      }
    } catch (e: any) {
      throw new ApiError(false, 404, e.message)
    }
  }

  async updateStatus(_id: string, action: EStatus) {
    let debtUpdate: TDebt = await Debt.findById(_id)
    if (debtUpdate) {

      if(action === EStatus.INACTIVE){
        await Debt.findByIdAndUpdate(
          _id,
          { payment: 0 },
          { new: true }
        )
      }
      let newupDebt = await Debt.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      )
      if (newupDebt) {
        const logObj = {
          activity:'Deleted debt of client:  '+newupDebt.client_names,
          created_by:newupDebt.created_by,
        }
        await historyLogsService.createHistoryLog(logObj)
        return newupDebt
      } else throw new ApiError(false, 404, " Debt not found")
    }
  }

  async deleteDebt(_id: string, created_by: TUser) {
    let deldebt: TDebt = await Debt.findById(_id)
    if (!deldebt) {
      throw new ApiError(false, 404, " Debt not found")
    } else {
      let deldebt = await Debt.findByIdAndRemove(_id)
      const logObj = {
        activity: "Deleted the debt record " + deldebt.client_names,
        created_by: created_by
      }
      await historyLogsService.createHistoryLog(logObj)
      return deldebt
    }
  }

  // statistics

  // statistics

async getDebtByYear(user_id:string, year: number) {
  try {
    let debts = await Debt.find({ created_by:user_id,year, status:EStatus.ACTIVE})
    if (!debts) {
      throw new ApiError(false, 404, "Debts not found")
    }
    return debts
  } catch (e: any) {
    throw new ApiError(false, 404, e.message)
  }
}

  async getDebtsByYearAndCategory(user_id:string,cat_id: string, year:number){
    try {
      let debts = await Debt.find({created_by:user_id, year, holder_status:cat_id, status:EStatus.ACTIVE })
      if (!debts) {
        throw new ApiError(false, 404, "Debts not found")
      }
      return debts
    } catch (e: any) {
      throw new ApiError(false, 404, e.message)
    }
  }
}
