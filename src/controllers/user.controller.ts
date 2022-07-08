import { User } from "../models/user.model"
import { Request, Response } from "express"
import { comparePassword, hashPassword } from "../util/hash"
import { generateToken } from "../util/generateAuthToken"
import { UserService } from "../services/user.service"
import { formatResponse } from "../util/formatRepsone"
import { TUser } from "../util/types"
import { EStatus } from "../util/types/enums"

const userService = new UserService()
export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      let page: any = req.query.page || "1"
      let limit: any = req.query.limit || "100"
      let users = await userService.getUsers(page, limit)
      return res.status(200).send(formatResponse(true, "", users))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      let user = await userService.getUser(req.params.id)
      return res.status(200).send(formatResponse(true, "", user))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async create(req: Request, res: Response) {
    try {
      let user = await userService.createUser(req.body)
      return res
        .status(201)
        .send(formatResponse(true, "Account created successfully", user))
    } catch (e: any) {
      let success: boolean = <boolean>e.success ? e.success : false
      return res
        .status(e.statusCode ? e.statusCode : 400)
        .send(formatResponse(success, e.message, {}))
    }
  }
  async update(req: Request, res: Response) {
    try {
      let _id = req.params.id
      const user = await userService.updateUser(
        _id,
        req.body
      )
      if (user)
      return res
      .status(200)
      .send(formatResponse(true, "Account updated successfully", user))
     
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }
  //   activate and diactivate
  async updateStatus(req: Request, res: Response) {
    try {
      let action: EStatus = <EStatus>req.query.action
      let user = await userService.updateStatus(req.params.id, action)
      return res
        .status(201)
        .send(formatResponse(true, "Status changed [INACTIVE / ACTIVE]", user))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let user: TUser = await userService.deleteUser(req.params.id)
      return res
        .status(200)
        .send(formatResponse(true, "User deleted successfully", user))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }

  // change password

  async changePassword(req: Request, res: Response) {
    try {
      const userPasswordChanged = await userService.changePassword(
        req.params.id,
        req.body
      )
      if (userPasswordChanged)
      return res
      .status(200)
      .send(formatResponse(true, "Password changed successfully", userPasswordChanged))
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }
  // login

  async login(req: Request, res: Response) {
    try {
      let token = await userService.login(req.body)
      if (token) {
        return res
          .status(200)
          .send(formatResponse(true, "Login successfully", token))
      } else {
        return res
          .status(400)
          .send(formatResponse(true, "Invalid email or password", {}))
      }
    } catch (e: any) {
      return res
        .status(e.statusCode)
        .send(formatResponse(e.success, e.message, {}))
    }
  }
}
