import mongoose from 'mongoose';
import { ECurrency, EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
const BudgetSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    initiated_amount:{
        type:Number,
        required:true
    },
    consumed_amount:{
        type:Number,
        default:0
    },
    currency:{
        type:String,
        enum:[ECurrency.RWF, ECurrency.USD, ECurrency.EURO],
        default: ECurrency.RWF
    },
    start_date:{
        type:Date,
        required:true
    },
    end_date:{
        type:Date,
        required:true
    },
    
    description:{
        type:String,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
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


BudgetSchema.plugin(pagination)

const Budget: any = mongoose.model("Budget", BudgetSchema)
export {Budget}