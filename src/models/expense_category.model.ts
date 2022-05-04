import mongoose from 'mongoose';
import { EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
const ExpenseCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    notes:{
        type:String
    },
    status:{
        type:String,
        default: EStatus.ACTIVE,
        enum:[EStatus.ACTIVE, EStatus.INACTIVE]
    },
    created_by:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})


ExpenseCategorySchema.plugin(pagination)

const ExpenseCategory: any = mongoose.model("ExpenseCategory", ExpenseCategorySchema)
export {ExpenseCategory}