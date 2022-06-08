import { Budget } from "../models/budget.model";
import { Expense } from "../models/expense.model";
import { ApiError } from "../util/ApiError";
import { getPaginationProps } from "../util/getPagination";
import { TExpense } from "../util/types";
import { EStatus } from "../util/types/enums";
import { HistoryLogsService } from "./history.service";

const historyLogsService = new HistoryLogsService()

export class ExpenseService {
  async getAll(page: string, limit: string, user_id:string) {
    const filter = {
      created_by:user_id,
        status:EStatus.ACTIVE
    }
    let expenses = await Expense.paginate(
      filter,
      getPaginationProps(parseInt(page), parseInt(limit),['created_by','budget','category'])
    )
    return expenses;
  }

  async getAllByUserId(page: string, limit: string, user_id: string) {
    let expenses = await Expense.paginate(
      {user:user_id},
       getPaginationProps(parseInt(page), parseInt(limit),['user','budget','category'])
    );
    return expenses;
  }

  async getAllByBudgetId(page: string, limit: string, budget_id: string) {
    let expenses = await Expense.paginate(
      {budget:budget_id},
       getPaginationProps(parseInt(page), parseInt(limit),['user','budget','category'])
    );
    return expenses;
  }


  async getAllByCategoryId(page: string, limit: string, category_id: string) {
    let expenses = await Expense.paginate(
      {category:category_id},
       getPaginationProps(parseInt(page), parseInt(limit),['user','budget','category'])
    );
    return expenses;
  }



  async getOne(id: string) {
    let expense = await Expense.findById(id);
    if (!expense) {
      throw new ApiError(false, 404, "Expense not found");
    }
    return expense;
  }

  async createOne(body: TExpense) {
    let expense = await Expense.create(body);
    if (!expense) {
      throw new ApiError(false, 400, "Registration failed");
    }
    // await this.loadBudgetAmount(expense.amount,expense.budget)
    const logObj = {
      activity:'Recorded new expense:  '+expense.name,
      created_by:body.created_by,
    }
    await historyLogsService.createHistoryLog(logObj)
    return expense;
  }

  async updateOne(_id: string, body: TExpense) {
    let expenseToUpdate: TExpense = await Expense.findById(_id);
    if (expenseToUpdate) {
      let upExpense = await Expense.findByIdAndUpdate(_id, body, {
        new: true,
      });
      if (upExpense) {
        const logObj = {
          activity:'Edit expense:  '+upExpense.name,
          created_by:body.created_by,
        }
        await historyLogsService.createHistoryLog(logObj)
        return upExpense;
      } else throw new ApiError(false, 400, "Updating failed");
    } else throw new ApiError(false, 404, "Expense not found");
  }

  async updateStatus(_id: string, action: EStatus) {
    let expenseUpdate: TExpense = await Expense.findById(_id);
    if (expenseUpdate) {
      let newUpExpense = await Expense.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      );
      if (newUpExpense) {
        const logObj = {
          activity:'Deleted expense:  '+newUpExpense.name,
          created_by:newUpExpense.created_by,
        }
        await historyLogsService.createHistoryLog(logObj)
        return newUpExpense;
      } else throw new ApiError(false, 404, "Expense not found");
    }
  }

  async deleteExpense(_id: string, body:TExpense) {
    let delExpense: TExpense = await Expense.findById(_id);
    if (!delExpense) {
      throw new ApiError(false, 404, "Expense not found");
    } else {
      let expenseToDelete = await Expense.findByIdAndRemove(_id);
      
      const logObj = {
        activity:'Delete expense:  '+expenseToDelete.name,
        created_by:body.created_by,
      }
      await historyLogsService.createHistoryLog(logObj)
      
      return expenseToDelete;
    }
  }

//   transactions

async loadBudgetAmount(expense_amount:string, budget_id:string){
    let budget = await Budget.findById(budget_id);
    if(!budget){
        throw new ApiError(false, 404, "Budget not found");
    }
    let newBudget = await Budget.findByIdAndUpdate(budget_id, {
        consumed_amount:budget.consumed_amount+expense_amount
    }, {new:true})

    return newBudget;
}

// statistics

async getExpensesByYear(user_id:string, year: number) {
  try {
    let expenses = await Expense.find({ created_by:user_id,year, status:EStatus.ACTIVE})
    if (!expenses) {
      throw new ApiError(false, 404, "Expenses not found")
    }
    return expenses
  } catch (e: any) {
    throw new ApiError(false, 404, e.message)
  }
}
// get expense by year and category name

async getExpenseByYearAndCategory(user_id:string,cat_id: string, year:number){
  try {
    let expenses = await Expense.find({created_by:user_id, year, category:cat_id, status:EStatus.ACTIVE })
    if (!expenses) {
      throw new ApiError(false, 404, "Expenses not found")
    }
    return expenses
  } catch (e: any) {
    throw new ApiError(false, 404, e.message)
  }
}

}
