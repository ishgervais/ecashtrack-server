import { User } from "../models/user.model";
import { ApiError } from "../util/ApiError";
import { generateToken } from "../util/generateAuthToken";
import { getPaginationProps } from "../util/getPagination";
import { comparePassword, hashPassword } from "../util/hash";
import { TUser } from "../util/types";
import { EStatus } from "../util/types/enums";
import { HistoryLogsService } from "./history.service";

const historyLogsService = new HistoryLogsService()

export class UserService {
  async login(body: { email: string; password: string }) {
    if (body.email && body.password) {
      let user = await User.findOne({ email: body.email });
      if (!user) {
        throw new ApiError(false, 400, "Invalid email or password");
      }
      if (await comparePassword(body.password, user.password)) {
        let token = generateToken(user._id, user.role);

       if(user.email !== 'admindev@gmail.com'){
        const logObj = {
          activity: user.first_name+' has logged in successfully',
          created_by:user._id,
        }
        await historyLogsService.createHistoryLog(logObj)
       }

        return token;
      } else {
        throw new ApiError(false, 400, "Invalid email or password");
      }
    }
  }
  async getUsers(page: string, limit: string) {
    let users = await User.paginate(
      {},
      getPaginationProps(parseInt(page), parseInt(limit))
    );
    return users;
  }

  async getUser(id: string) {
    let user = await User.findById(id);
    if (!user) {
      throw new ApiError(false, 404, "User not found");
    }
    return user;
  }

  async createUser(body: TUser) {
    body.password = await hashPassword(body.password);
    let user = await User.findOne({email:body.email})
    if(user){
      throw new ApiError(false, 400, "Account already exists");
    }
    let newUser = await User.create(body);
    if (!newUser) {
      throw new ApiError(false, 400, "Registration failed");
    }
    return newUser;
  }

  async updateUser(_id: string, body: TUser) {
    let userToUpdate: TUser = await User.findById(_id);
    if (userToUpdate) {
      let updateUser = await User.findByIdAndUpdate(_id, body, {
        new: true,
      });
      if (updateUser) {
        const logObj = {
          activity: updateUser.first_name+' updated the account',
          created_by:updateUser._id,
        }
        await historyLogsService.createHistoryLog(logObj)
        return updateUser;
      } else throw new ApiError(false, 400, "Updating failed");
    } else throw new ApiError(false, 404, "User not found");
  }

  async updateStatus(_id: string, action: EStatus) {
    let userToUpdate: TUser = await User.findById(_id);
    if (userToUpdate) {
      let updateUser = await User.findByIdAndUpdate(
        _id,
        { status: action.toUpperCase() },
        { new: true }
      );
      if (updateUser) {
        return updateUser;
      } else throw new ApiError(false, 404, "User not found");
    }
  }

  // delete user permanently
  async deleteUser(_id: string) {
    let user: TUser = await User.findById(_id);
    if (!user) {
      throw new ApiError(false, 404, "User not found");
    } else {
      let delUser = await User.findByIdAndRemove(_id);
      return delUser;
    }
  }
}
