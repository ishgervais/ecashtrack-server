import mongoose from 'mongoose';
import { EPaymentStatus, EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
let date = (new Date()).toString();
let month = date.split(' ')[1]
const BookingSchema = new mongoose.Schema({
    client_names:{
        type:String,
        required:true
    },
  
    booking_date:{
        type: mongoose.Types.ObjectId,
        ref:"BookingDate",
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
       // for statistics
    month:{
        type:String,
        default: month
    },
    year:{
        type:Number,
    },
    payment_status:{
        type:String,
        default:EPaymentStatus.PENDING,
        enum : [EPaymentStatus.PENDING, EPaymentStatus.CONFIRMED]

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


BookingSchema.plugin(pagination)

const Booking: any = mongoose.model("Booking", BookingSchema)
export {Booking}