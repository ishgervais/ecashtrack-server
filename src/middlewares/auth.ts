import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model'

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string = ''
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return next(
      res
        .send({ success: false, message: 'Unauthorized to access the service' })
        .status(401)
    )
  }
  try {
    let secreKey: any = process.env.JWT_SECRET
    const decoded: any = jwt.verify(token, secreKey)
    let user = await User.findById(decoded.id)
   
    if (!user) {
      return next(
        res
          .send({
            success: false,
            message: 'Unauthorized to access the service'
          })
          .status(401)
      )
    }
    req.body.user_id = user._id
    next()
  } catch (e: any) {
    return res.send({ success: false, data: e.message })
  }
}
