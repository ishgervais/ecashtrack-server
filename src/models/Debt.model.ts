import mongoose from 'mongoose';
import { ECurrency, EDebtStatus, EPaymentStatus, EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
let date = (new Date()).toString();
let month = date.split(' ')[1]
const DebtSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    // client current payment
    payment:{
        type:Number,
        default:0,
       
    },
    // agreed on payment or amoun the client is supposed to pay
    estimated_payment:{
        type:Number,
        required:true
    },

    currency:{
        type:String,
        enum:[ECurrency.RWF, ECurrency.USD, ECurrency.EURO],
        default: ECurrency.RWF
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

    payment_status:{
        type:String,
        default:EPaymentStatus.PENDING,
        enum : [EPaymentStatus.PENDING, EPaymentStatus.CONFIRMED]

    },

    holder_status:{
        type:String,
        default: EDebtStatus.SOMEONE_OWES_ME,
        enum:[EDebtStatus.SOMEONE_OWES_ME, EDebtStatus.I_OWE_SOMEONE]
    },

    status:{
        type:String,
        default: EStatus.ACTIVE,
        enum:[EStatus.ACTIVE, EStatus.INACTIVE]
    },
    issued_date:{
        type:Date,
        default: new Date()
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


DebtSchema.plugin(pagination)

const Debt: any = mongoose.model("Debt", DebtSchema)
export {Debt}