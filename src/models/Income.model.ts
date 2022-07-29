import mongoose from 'mongoose';
import { TIncome } from '../util/types';
import { ECurrency, EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
let date = (new Date()).toString();
let month = date.split(' ')[1]
const IncomeSchema = new mongoose.Schema<TIncome>({

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
    source:{
        type: mongoose.Types.ObjectId,
        ref:"IncomeSource",
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


IncomeSchema.plugin(pagination)

export const Income:any = mongoose.model<TIncome>("Income", IncomeSchema)
// asigned type any to allow mongoose-v2 to work