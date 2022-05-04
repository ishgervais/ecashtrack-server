import { ExpenseCategory } from "../models/expense_category.model";
import { ApiError } from "../util/ApiError";
import { getPaginationProps } from "../util/getPagination";
import { TExpenseCategory } from "../util/types";
import { EStatus } from "../util/types/enums";
import { HistoryLogsService } from "./history.service";

const historyLogsService = new HistoryLogsService()

export class ExpenseCategoryService {
  async getExpenseCategories(page: string, limit: string) {
    let categories = await ExpenseCategory.paginate(
      {status:EStatus.ACTIVE},
      getPaginationProps(parseInt(page), parseInt(limit))
    );
    return categories;
  }


  async getExpenseCategory(id: string) {
    let category = await ExpenseCategory.findById(id);
    if (!category) {
      throw new ApiError(false, 404, "Category not found");
    }
    return category;
  }

  async createExpenseCategory(body: TExpenseCategory) {
    let category = await ExpenseCategory.create(body);
    if (!category) {
      throw new ApiError(false, 400, "Registration failed");
    }
    const logObj = {
      activity: "Created new expense category: "+category.name,
      created_by: body.created_by
    }
    await historyLogsService.createHistoryLog(logObj)
    return category;
  }

  async updateExpenseCategory(_id: string, body: TExpenseCategory) {
    let categoryToUpdate: TExpenseCategory = await ExpenseCategory.findById(_id);
    if (categoryToUpdate) {
      let upExpenseCategory = await ExpenseCategory.findByIdAndUpdate(_id, body, {
        new: true,
      });
      if (upExpenseCategory) {
        return upExpenseCategory;
      } else throw new ApiError(false, 400, "Updating failed");
    } else throw new ApiError(false, 404, "Category not found");
  }

  async updateStatus(_id: string, action: EStatus) {
    let categoryUpdate: TExpenseCategory = await ExpenseCategory.findById(_id);
    if (categoryUpdate) {
      let newExpenseCategory = await ExpenseCategory.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      );
      if (newExpenseCategory) {
        const logObj = {
          activity: "Deleted expense category: "+newExpenseCategory.name,
          created_by: newExpenseCategory.created_by
        }
        await historyLogsService.createHistoryLog(logObj)
        return newExpenseCategory;
      } else throw new ApiError(false, 404, "Category not found");
    }
  }

  async deleteExpenseCategory(_id: string) {
    let delCategory: TExpenseCategory = await ExpenseCategory.findById(_id);
    if (!delCategory) {
      throw new ApiError(false, 404, "Category not found");
    } else {
      let delTExpenseCategory = await ExpenseCategory.findByIdAndRemove(_id);
      return delTExpenseCategory;
    }
  }
}