import mongoose from "mongoose"
import { EStatus } from "../util/types/enums"
const pagination = require("mongoose-paginate-v2")
import { TIncomeSource } from "../util/types"
const IncomeSourceSchema = new mongoose.Schema<TIncomeSource>(
  {
    name: {
      type: String,
      required: true
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      default: EStatus.ACTIVE,
      enum: [EStatus.ACTIVE, EStatus.INACTIVE]
    },
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
)

IncomeSourceSchema.plugin(pagination)

export const IncomeSource: any = mongoose.model<TIncomeSource>(
  "IncomeSource",
  IncomeSourceSchema
)
