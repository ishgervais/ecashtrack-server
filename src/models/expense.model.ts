import mongoose from 'mongoose';
import { ECurrency, EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
let date = (new Date()).toString();
let month = date.split(' ')[1]
const ExpenseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    amount:{
        type:Number,
        default:0,
        required:true
    },
    currency:{
        type:String,
        enum:[ECurrency.RWF, ECurrency.USD, ECurrency.EURO],
        default: ECurrency.RWF
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref:"ExpenseCategory",
    },
    budget:{
        type: mongoose.Types.ObjectId, 
        default:null,
        ref:"Budget"
    },
    notes:{
        type:String
    },
    // for statistics
    month:{
        type:String,
        default: month
    },
    year:{
        type:Number,
        default: new Date().getFullYear()
    },

    status:{
        type:String,
        default: EStatus.ACTIVE,
        enum:[EStatus.ACTIVE, EStatus.INACTIVE]
    },
    created_by:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },

},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})


ExpenseSchema.plugin(pagination)

const Expense: any = mongoose.model("Expense", ExpenseSchema)
export {Expense}