import { Budget } from "../models/budget.model";
import { ApiError } from "../util/ApiError";
import { getPaginationProps } from "../util/getPagination";
import { TBudget } from "../util/types";
import { EStatus } from "../util/types/enums";
export class BudgetService {
  async getBudgets(page: string, limit: string, user_id:string) {
    let budgets = await Budget.paginate(
      {created_by:user_id},
      getPaginationProps(parseInt(page), parseInt(limit),'')
    );
    return budgets;
  }

  async getBudgetsByUserId(page: string, limit: string, user_id: string) {
    let budgets = await Budget.paginate(
      {user:user_id},
      getPaginationProps(parseInt(page), parseInt(limit),'user')
    );
    return budgets;
  }


  async getBudget(id: string) {
    let budget = await Budget.findById(id);
    if (!budget) {
      throw new ApiError(false, 404, "Budget not found");
    }
    return budget;
  }

  async createBudget(body: TBudget) {
    let budget = await Budget.create(body);
    if (!budget) {
      throw new ApiError(false, 400, "Registration failed");
    }
    return budget;
  }

  async updateBudget(_id: string, body: TBudget) {
    let budgetToUpdate: TBudget = await Budget.findById(_id);
    if (budgetToUpdate) {
      let upBudget = await Budget.findByIdAndUpdate(_id, body, {
        new: true,
      });
      if (upBudget) {
        return upBudget;
      } else throw new ApiError(false, 400, "Updating failed");
    } else throw new ApiError(false, 404, "Budget not found");
  }

  async updateStatus(_id: string, action: EStatus) {
    let budgetUpdate: TBudget = await Budget.findById(_id);
    if (budgetUpdate) {
      let newUpBudget = await Budget.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      );
      if (newUpBudget) {
        return newUpBudget;
      } else throw new ApiError(false, 404, "Budget not found");
    }
  }

  async deleteBudget(_id: string) {
    let delBudget: TBudget = await Budget.findById(_id);
    if (!delBudget) {
      throw new ApiError(false, 404, "Budget not found");
    } else {
      let deltBudget = await Budget.findByIdAndRemove(_id);
      return deltBudget;
    }
  }


  // transactions

  async loodConsumedAmount(_id: string, amount:number) {

  }
}
